import type { APIRoute } from 'astro';
import { REFERRAL_CAP, REFERRAL_GOAL, REFERRAL_PROGRAM } from '../../config';
import { referralCount } from '../../lib/brevo';
import { isReferralCode } from '../../lib/referral';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

/** Invite progress for an invite code: only the count, never who was invited. */
export const GET: APIRoute = async ({ url }) => {
  if (!REFERRAL_PROGRAM) return json({ error: 'off' }, 404);
  const code = url.searchParams.get('cod');
  if (!isReferralCode(code)) return json({ error: 'not_found' }, 404);
  try {
    const count = await referralCount(code);
    if (count === null) return json({ error: 'not_found' }, 404);
    return json({ count, goal: REFERRAL_GOAL, cap: REFERRAL_CAP });
  } catch (err) {
    console.error('[referral]', err);
    return json({ error: 'server' }, 502);
  }
};
