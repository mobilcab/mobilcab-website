import type { APIRoute } from 'astro';
import { REFERRAL_PROGRAM } from '../../config';
import { requestSignup } from '../../lib/brevo';
import { isValidEmail, normalizeEmail } from '../../lib/email';
import { isReferralCode, newReferralCode } from '../../lib/referral';
import { createConfirmToken } from '../../lib/tokens';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

/**
 * Waitlist sign-up, step 1 of double opt-in: sends the confirmation email.
 * Responds { status: 'pending' } (check your inbox) or { status: 'already' }.
 */
export const POST: APIRoute = async ({ request, url }) => {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  // Honeypot: real visitors never see or fill this field. Report success so
  // bots have no reason to retry, but don't touch Brevo.
  if (typeof data.company === 'string' && data.company.trim() !== '') {
    return json({ status: 'pending' });
  }

  const email = typeof data.email === 'string' ? normalizeEmail(data.email) : '';
  const lang = data.lang === 'en' ? 'en' : 'ro';
  // Invite links only count while the referral program is on.
  const referredBy = REFERRAL_PROGRAM && isReferralCode(data.ref) ? data.ref : undefined;

  if (!isValidEmail(email)) return json({ error: 'invalid_email' }, 400);
  if (data.consent !== true) return json({ error: 'consent_required' }, 400);

  try {
    const status = await requestSignup({
      email,
      lang,
      referredBy,
      confirmUrl: (token) => `${url.origin}/api/confirm?t=${encodeURIComponent(token)}`,
      makeToken: () => createConfirmToken(email, lang),
      newCode: newReferralCode,
    });

    // Local test mode sends no email, so hand the confirmation link to the page.
    if (import.meta.env.DEV && status === 'pending') {
      const { lastConfirmUrl } = await import('../../lib/brevo-mock');
      const devConfirmUrl = lastConfirmUrl.get(email);
      if (devConfirmUrl) return json({ status, devConfirmUrl });
    }
    return json({ status });
  } catch (err) {
    console.error('[subscribe]', err);
    return json({ error: 'server' }, 502);
  }
};
