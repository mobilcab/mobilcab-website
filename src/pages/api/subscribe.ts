import type { APIRoute } from 'astro';
import { NEON_MARKETING_CONSENT_URL } from 'astro:env/server';
import { isValidEmail, normalizeEmail } from '../../lib/email';
import { NeonConsentError, requestNeonMarketingConsent } from '../../lib/neon-marketing-consent';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

/**
 * Newsletter sign-up, step 1 of double opt-in.
 *
 * Forwards to Neon `POST /marketing-consent` with `source: 'web'`. Neon sends the confirmation
 * email (same Brevo templates as the app) and owns the GDPR row; the confirm link lands on Neon
 * `/marketing-consent/confirm`. Responds `{ status: 'pending' }` for any valid address.
 */
export const POST: APIRoute = async ({ request }) => {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  // Honeypot: real visitors never see or fill this field. Report success so
  // bots have no reason to retry, but don't touch Neon.
  if (typeof data.company === 'string' && data.company.trim() !== '') {
    return json({ status: 'pending' });
  }

  const email = typeof data.email === 'string' ? normalizeEmail(data.email) : '';
  const language = data.lang === 'en' ? 'en' : 'ro';

  if (!isValidEmail(email)) return json({ error: 'invalid_email' }, 400);
  if (data.consent !== true) return json({ error: 'consent_required' }, 400);

  try {
    const status = await requestNeonMarketingConsent({
      email,
      language,
      endpointUrl: NEON_MARKETING_CONSENT_URL ?? '',
    });
    return json({ status });
  } catch (err) {
    if (err instanceof NeonConsentError) {
      if (err.code === 'invalid_email') return json({ error: 'invalid_email' }, 400);
      if (err.code === 'misconfigured') {
        console.error('[subscribe] NEON_MARKETING_CONSENT_URL missing');
        return json({ error: 'server' }, 502);
      }
      console.error('[subscribe]', err.code, err.message);
      return json({ error: 'server' }, 502);
    }
    console.error('[subscribe]', err);
    return json({ error: 'server' }, 502);
  }
};
