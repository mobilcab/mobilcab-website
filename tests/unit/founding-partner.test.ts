// POST /api/founding-partner: Brevo list, the CAD app's panel (Neon RPC) and the two emails.
import type { APIContext } from 'astro';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeBrevo } from './fake-brevo';

vi.mock('astro:env/server', () => ({
  BREVO_API_KEY: 'test-key',
  BREVO_LIST_ID: '11',
  BREVO_LIST_ID_EN: undefined,
  BREVO_FP_LIST_ID: '13',
  BREVO_CONFIRM_TEMPLATE_ID_RO: '101',
  BREVO_CONFIRM_TEMPLATE_ID_EN: undefined,
  NEON_DATA_API_URL: 'https://ep-x.apirest.neon.test/neondb/rest/v1',
}));

const endpoint = await import('../../src/pages/api/founding-partner');

const valid = { name: 'Ion Pop', email: 'ion@atelier.ro', phone: '0712 345 678', workshop: 'Atelier Pop', city: 'Cluj', consent: true, lang: 'ro' };

let brevo: FakeBrevo;
let neonCalls: { url: string; body: Record<string, unknown> }[];
let neonResponse: () => Response;
let emails: { to: { email: string }[]; subject: string; htmlContent: string }[];

beforeEach(() => {
  brevo = new FakeBrevo();
  neonCalls = [];
  emails = [];
  neonResponse = () => new Response(JSON.stringify({ ok: true, id: 'x' }), { status: 200 });
  vi.stubGlobal('fetch', (url: string, init?: RequestInit) => {
    if (url === 'https://ep-x.neonauth.neon.test/neondb/auth/token/anonymous') {
      return Promise.resolve(new Response(JSON.stringify({ token: 'anon-jwt', expires_at: 1 }), { status: 200 }));
    }
    if (url.startsWith('https://ep-x.apirest.neon.test')) {
      expect((init?.headers as Record<string, string>).authorization).toBe('Bearer anon-jwt');
      neonCalls.push({ url, body: JSON.parse(String(init?.body)) });
      return Promise.resolve(neonResponse());
    }
    if (url.endsWith('/smtp/email')) {
      emails.push(JSON.parse(String(init?.body)));
      return Promise.resolve(new Response('{}', { status: 201 }));
    }
    return brevo.fetch(url, init);
  });
});
afterEach(() => vi.unstubAllGlobals());

const post = async (body: unknown) => {
  const res = await endpoint.POST({
    request: new Request('https://mobilcab.com/api/founding-partner', { method: 'POST', body: JSON.stringify(body) }),
  } as unknown as APIContext);
  return { status: res.status, body: await res.json() };
};

describe('POST /api/founding-partner', () => {
  it('requires a valid phone', async () => {
    expect(await post({ ...valid, phone: '123' })).toEqual({ status: 400, body: { error: 'invalid_phone' } });
    expect(neonCalls).toHaveLength(0);
  });

  it('saves to the panel and notifies contact@ only; the welcome email is the Brevo automation', async () => {
    expect(await post(valid)).toEqual({ status: 200, body: { status: 'reserved' } });
    expect(neonCalls).toHaveLength(1);
    expect(neonCalls[0].url).toBe('https://ep-x.apirest.neon.test/neondb/rest/v1/rpc/submit_waitlist_request');
    expect(neonCalls[0].body).toMatchObject({ p_name: 'Ion Pop', p_email: 'ion@atelier.ro', p_phone: '0712 345 678', p_city: 'Cluj', p_workshop: 'Atelier Pop' });
    expect(emails.map((e) => e.to[0].email)).toEqual(['contact@mobilcab.com']);
  });

  it('does not repeat anything for someone already on the list', async () => {
    await post(valid);
    neonCalls = [];
    emails = [];
    expect(await post(valid)).toEqual({ status: 200, body: { status: 'already' } });
    expect(neonCalls).toHaveLength(0);
    expect(emails).toHaveLength(0);
  });

  it('keeps the sign-up and flags it in the notification when the panel save fails', async () => {
    neonResponse = () => new Response('boom', { status: 500 });
    expect(await post(valid)).toEqual({ status: 200, body: { status: 'reserved' } });
    expect(emails.find((e) => e.to[0].email === 'contact@mobilcab.com')?.htmlContent).toContain('NU a ajuns în panoul');
  });
});
