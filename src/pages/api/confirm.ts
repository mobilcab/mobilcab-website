import type { APIRoute } from 'astro';
import { REFERRAL_CAP, REFERRAL_PROGRAM } from '../../config';
import { confirmSignup } from '../../lib/brevo';
import { newReferralCode } from '../../lib/referral';
import { readConfirmToken } from '../../lib/tokens';
import { confirmedPaths } from '../../site';

export const prerender = false;

/**
 * Waitlist sign-up, step 2 of double opt-in: the link in the confirmation
 * email. Puts the address on the waitlist and redirects to the "confirmed"
 * page, which shows the person's invite link while the referral program is on.
 */
export const GET: APIRoute = async ({ url, redirect }) => {
  const token = url.searchParams.get('t') ?? '';
  const data = await readConfirmToken(token);
  if (!data) return redirect(`${confirmedPaths.ro}?eroare=link`, 303);

  const page = confirmedPaths[data.lang];
  try {
    const result = await confirmSignup(data.email, data.lang, {
      countReferral: REFERRAL_PROGRAM,
      referralCap: REFERRAL_CAP,
      newCode: newReferralCode,
    });
    if (!result) return redirect(`${page}?eroare=link`, 303);
    // nou=1 marks a first-time confirmation, counted once in Plausible; the page removes it from the address.
    const params = new URLSearchParams();
    if (REFERRAL_PROGRAM) params.set('cod', result.code);
    if (result.fresh) params.set('nou', '1');
    const query = params.toString();
    return redirect(query ? `${page}?${query}` : page, 303);
  } catch (err) {
    console.error('[confirm]', err);
    return redirect(`${page}?eroare=server`, 303);
  }
};
