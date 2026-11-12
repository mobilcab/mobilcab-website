import { describe, expect, it, vi } from 'vitest';
import { NeonConsentError, requestNeonMarketingConsent } from '../../src/lib/neon-marketing-consent';

describe('requestNeonMarketingConsent', () => {
  it('POSTs email + language + source web and accepts 202 pending', async () => {
    const fetchFn = vi.fn(async () =>
      new Response(JSON.stringify({ ok: true, pending: true }), { status: 202 }),
    );
    await expect(
      requestNeonMarketingConsent({
        email: 'a@b.ro',
        language: 'ro',
        endpointUrl: 'https://neon.test/marketing-consent/',
        fetchFn: fetchFn as unknown as typeof fetch,
      }),
    ).resolves.toBe('pending');
    expect(fetchFn).toHaveBeenCalledWith(
      'https://neon.test/marketing-consent',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'a@b.ro', language: 'ro', source: 'web' }),
      }),
    );
  });

  it('maps invalid_email and refuses an empty endpoint', async () => {
    await expect(
      requestNeonMarketingConsent({
        email: 'x',
        language: 'en',
        endpointUrl: '  ',
        fetchFn: vi.fn() as unknown as typeof fetch,
      }),
    ).rejects.toMatchObject({ code: 'misconfigured' });

    const fetchFn = vi.fn(async () =>
      new Response(JSON.stringify({ ok: false, error: 'invalid_email' }), { status: 400 }),
    );
    await expect(
      requestNeonMarketingConsent({
        email: 'x',
        language: 'en',
        endpointUrl: 'https://neon.test/marketing-consent',
        fetchFn: fetchFn as unknown as typeof fetch,
      }),
    ).rejects.toBeInstanceOf(NeonConsentError);
  });
});
