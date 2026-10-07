import type { APIRoute } from 'astro';
import { CRON_SECRET } from 'astro:env/server';
import { cleanupUnconfirmed } from '../../lib/brevo';

export const prerender = false;

/** The privacy policy promises unconfirmed sign-ups are deleted within 30 days. */
const DAYS = 30;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

/**
 * Daily clean-up of sign-ups that were never confirmed. Called once a day by
 * Vercel Cron (registered by src/integrations/vercel-crons.mjs), which sends
 * `Authorization: Bearer <CRON_SECRET>`; any other caller is refused.
 *
 *   ?dryRun=1   report what would be deleted, delete nothing
 *   ?days=0     dev only: treat every unconfirmed sign-up as old, to test locally
 */
export const GET: APIRoute = async ({ request, url }) => {
  const authorised = CRON_SECRET
    ? request.headers.get('authorization') === `Bearer ${CRON_SECRET}`
    : import.meta.env.DEV; // without a secret, only the local dev server may run it
  if (!authorised) return json({ error: 'unauthorized' }, 401);

  const dryRun = url.searchParams.get('dryRun') === '1';
  // Only an explicit ?days= in dev overrides the 30 days (a missing value must not read as 0).
  const daysParam = url.searchParams.get('days');
  const devDays = import.meta.env.DEV && daysParam !== null && daysParam.trim() !== '' ? Number(daysParam) : NaN;
  const days = Number.isFinite(devDays) && devDays >= 0 ? devDays : DAYS;

  try {
    const result = await cleanupUnconfirmed(days * 24 * 60 * 60 * 1000, dryRun);
    console.log(`[cleanup] ${dryRun ? 'dry run: ' : ''}${result.matched} unconfirmed sign-up(s) older than ${days} days, ${result.deleted} deleted, ${result.checked} contacts checked`);
    return json({ ...result, days, dryRun });
  } catch (err) {
    console.error('[cleanup]', err);
    return json({ error: 'server' }, 502);
  }
};
