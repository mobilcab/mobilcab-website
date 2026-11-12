/**
 * Newsletter double opt-in via Neon `marketing_consent` (same path as the CAD app).
 *
 * The website Worker only forwards the request; Neon owns pending → confirmed → Brevo list sync.
 * Confirm links in the email point at Neon `/marketing-consent/confirm`, not `/api/confirm`.
 */

export type NeonConsentResult = 'pending';

export class NeonConsentError extends Error {
  constructor(
    readonly code: 'misconfigured' | 'invalid_email' | 'send_failed' | 'upstream',
    message?: string,
  ) {
    super(message ?? code);
    this.name = 'NeonConsentError';
  }
}

export interface NeonConsentRequest {
  email: string;
  language: 'ro' | 'en';
  /** Full URL of Neon `POST /marketing-consent` (no trailing slash required). */
  endpointUrl: string;
  fetchFn?: typeof fetch;
}

/**
 * `POST { email, language, source: 'web' }` → Neon always answers with the same shape for a valid
 * address (`202 { ok, pending }`), including when it skips a resend — so this never returns
 * `already` (that distinction lived in the old Brevo-only path).
 */
export async function requestNeonMarketingConsent(r: NeonConsentRequest): Promise<NeonConsentResult> {
  const base = r.endpointUrl.trim().replace(/\/$/, '');
  if (!base) throw new NeonConsentError('misconfigured', 'NEON_MARKETING_CONSENT_URL must be set');

  const fetchFn = r.fetchFn ?? fetch;
  let res: Response;
  try {
    res = await fetchFn(base, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        email: r.email,
        language: r.language,
        source: 'web',
      }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    throw new NeonConsentError('upstream', err instanceof Error ? err.message : 'fetch failed');
  }

  const body = (await res.json().catch(() => null)) as
    | { ok?: boolean; pending?: boolean; error?: string }
    | null;

  if (res.status === 400 && body?.error === 'invalid_email') {
    throw new NeonConsentError('invalid_email');
  }
  if (res.status === 502 || body?.error === 'send_failed') {
    throw new NeonConsentError('send_failed');
  }
  if ((res.status === 202 || res.ok) && body?.ok && body.pending) {
    return 'pending';
  }

  throw new NeonConsentError(
    'upstream',
    `Neon marketing-consent responded ${res.status}: ${body?.error ?? ''}`.trim(),
  );
}
