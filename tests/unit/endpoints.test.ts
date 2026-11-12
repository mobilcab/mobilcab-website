// The sign-up endpoints as a visitor's browser uses them — subscribe proxies to
// Neon; legacy /api/confirm still talks to Brevo for links already in flight.
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
  NEON_MARKETING_CONSENT_URL: 'https://neon.test/marketing-consent',
  CONFIRM_SECRET: 'test-secret-that-is-long-enough-1234567890',
  CRON_SECRET: 'cron-secret',
  NEON_DATA_API_URL: undefined,
}));

const subscribe = await import('../../src/pages/api/subscribe');
const confirm = await import('../../src/pages/api/confirm');
const cleanup = await import('../../src/pages/api/cleanup');

let brevo: FakeBrevo;
let neonCalls: Array<{ url: string; body: unknown }>;

beforeEach(() => {
  brevo = new FakeBrevo();
  neonCalls = [];
  vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/marketing-consent')) {
      neonCalls.push({ url, body: init?.body ? JSON.parse(String(init.body)) : null });
      return Promise.resolve(
        new Response(JSON.stringify({ ok: true, pending: true }), {
          status: 202,
          headers: { 'content-type': 'application/json' },
        }),
      );
    }
    return brevo.fetch(input, init);
  });
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
    expect(neonCalls).toEqual([]);
  });

  it('rejects a body that is not JSON', async () => {
    const res = await subscribe.POST(context('https://mobilcab.com/api/subscribe', { method: 'POST', body: '{nope' }));
    expect(res.status).toBe(400);
  });

  it('quietly drops honeypot submissions', async () => {
    expect(await post({ email: 'bot@spam.ro', consent: true, company: 'Spam SRL' })).toEqual({ status: 200, body: { status: 'pending' } });
    expect(neonCalls).toEqual([]);
  });

  it('forwards a valid sign-up to Neon with source web', async () => {
    expect((await post({ email: ' Ion@Atelier.RO ', consent: true, lang: 'ro' })).body).toMatchObject({ status: 'pending' });
    expect(neonCalls).toHaveLength(1);
    expect(neonCalls[0]!.url).toBe('https://neon.test/marketing-consent');
    expect(neonCalls[0]!.body).toEqual({
      email: 'ion@atelier.ro',
      language: 'ro',
      source: 'web',
    });
    // Subscribe no longer writes Brevo contacts itself.
    expect(brevo.contacts.size).toBe(0);
    expect(brevo.sent).toEqual([]);
  });

  it('passes English through as language en', async () => {
    await post({ email: 'ann@example.com', consent: true, lang: 'en' });
    expect(neonCalls[0]!.body).toMatchObject({ language: 'en', source: 'web' });
  });
});

describe('GET /api/confirm (legacy links)', () => {
  it('rejects a missing or forged token', async () => {
    expect(await open('https://mobilcab.com/api/confirm')).toBe('/ro/confirmat/?eroare=link');
    expect(await open('https://mobilcab.com/api/confirm?t=abc.def')).toBe('/ro/confirmat/?eroare=link');
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
