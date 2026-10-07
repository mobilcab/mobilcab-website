// The sign-up endpoints as a visitor's browser and the confirmation email use
// them, against the in-memory Brevo.
import type { APIContext } from 'astro';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeBrevo } from './fake-brevo';

// Every setting must be listed: Vitest throws when code reads one the mock leaves out.
vi.mock('astro:env/server', () => ({
  BREVO_API_KEY: 'test-key',
  BREVO_LIST_ID: '11',
  BREVO_LIST_ID_EN: undefined,
  BREVO_FP_LIST_ID: undefined,
  BREVO_CONFIRM_TEMPLATE_ID_RO: '101',
  BREVO_CONFIRM_TEMPLATE_ID_EN: undefined,
  CONFIRM_SECRET: 'test-secret-that-is-long-enough-1234567890',
  CRON_SECRET: 'cron-secret',
}));

const subscribe = await import('../../src/pages/api/subscribe');
const confirm = await import('../../src/pages/api/confirm');
const cleanup = await import('../../src/pages/api/cleanup');

let brevo: FakeBrevo;
beforeEach(() => {
  brevo = new FakeBrevo();
  vi.stubGlobal('fetch', brevo.fetch);
});
afterEach(() => vi.unstubAllGlobals());

const context = (url: string, init?: RequestInit) =>
  ({
    request: new Request(url, init),
    url: new URL(url),
    redirect: (location: string, status = 302) => new Response(null, { status, headers: { location } }),
  }) as unknown as APIContext;

const post = async (body: unknown) => {
  const res = await subscribe.POST(
    context('https://mobilcab.com/api/subscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }),
  );
  return { status: res.status, body: await res.json() };
};

const open = async (url: string) => (await confirm.GET(context(url))).headers.get('location');

describe('POST /api/subscribe', () => {
  it('validates on the server, not just in the browser', async () => {
    expect(await post({ email: 'nope', consent: true })).toEqual({ status: 400, body: { error: 'invalid_email' } });
    expect(await post({ email: 'ion@atelier.ro' })).toEqual({ status: 400, body: { error: 'consent_required' } });
    expect(await post({ email: 'ion@atelier.ro', consent: 'yes' })).toEqual({ status: 400, body: { error: 'consent_required' } });
    expect(brevo.contacts.size).toBe(0);
  });

  it('rejects a body that is not JSON', async () => {
    const res = await subscribe.POST(context('https://mobilcab.com/api/subscribe', { method: 'POST', body: '{nope' }));
    expect(res.status).toBe(400);
  });

  it('quietly drops honeypot submissions', async () => {
    expect(await post({ email: 'bot@spam.ro', consent: true, company: 'Spam SRL' })).toEqual({ status: 200, body: { status: 'pending' } });
    expect(brevo.contacts.size).toBe(0);
    expect(brevo.sent).toEqual([]);
  });

  it('ignores invite codes while the referral program is off', async () => {
    await post({ email: 'ion@atelier.ro', consent: true, ref: 'k7Q2xMa9' });
    expect(brevo.get('ion@atelier.ro')!.attributes.REFERRED_BY).toBe('');
  });

  it('emails a signed link that confirms the sign-up', async () => {
    expect((await post({ email: ' Ion@Atelier.RO ', consent: true, lang: 'ro' })).body).toMatchObject({ status: 'pending' });
    const link = brevo.sent[0]!.params.CONFIRM_URL!;
    expect(link).toMatch(/^https:\/\/mobilcab\.com\/api\/confirm\?t=/);

    expect(await open(link)).toBe('/ro/confirmat/?nou=1');
    expect([...brevo.get('ion@atelier.ro')!.listIds]).toEqual([11]);

    // Opening it again lands on the same page, without counting as a new confirmation.
    expect(await open(link)).toBe('/ro/confirmat/');
  });
});

describe('GET /api/confirm', () => {
  it('rejects a missing or forged token', async () => {
    expect(await open('https://mobilcab.com/api/confirm')).toBe('/ro/confirmat/?eroare=link');
    expect(await open('https://mobilcab.com/api/confirm?t=abc.def')).toBe('/ro/confirmat/?eroare=link');
  });

  it("rejects a valid link whose contact is gone (e.g. cleaned up)", async () => {
    await post({ email: 'ion@atelier.ro', consent: true });
    const link = brevo.sent[0]!.params.CONFIRM_URL!;
    brevo.contacts.clear();
    expect(await open(link)).toBe('/ro/confirmat/?eroare=link');
  });
});

describe('GET /api/cleanup', () => {
  it('refuses callers without the cron secret', async () => {
    const run = (headers: Record<string, string> = {}) => cleanup.GET(context('https://mobilcab.com/api/cleanup', { headers }));
    expect((await run()).status).toBe(401);
    expect((await run({ authorization: 'Bearer wrong' })).status).toBe(401);
    expect((await run({ authorization: 'Bearer cron-secret' })).status).toBe(200);
  });
});
