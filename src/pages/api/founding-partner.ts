import type { APIRoute } from 'astro';
import { FOUNDING_PARTNER_SPOTS } from '../../config';
import { countReservations, reserveSpot } from '../../lib/brevo';
import { isValidEmail, normalizeEmail } from '../../lib/email';
import { cleanText, isValidField } from '../../lib/reservation';

export const prerender = false;

const json = (body: unknown, status = 200, cache = 'no-store') =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': cache },
  });

const spots = (taken: number) => ({
  total: FOUNDING_PARTNER_SPOTS,
  remaining: Math.max(0, FOUNDING_PARTNER_SPOTS - taken),
});

/** Spot counter. Cached briefly at Vercel's edge so page views don't each hit Brevo. */
export const GET: APIRoute = async () => {
  try {
    return json(spots(await countReservations()), 200, 'public, max-age=0, s-maxage=60, stale-while-revalidate=300');
  } catch (err) {
    console.error('[founding-partner] count failed', err);
    return json({ error: 'server' }, 503);
  }
};

export const POST: APIRoute = async ({ request }) => {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  // Honeypot, as in /api/subscribe.
  if (cleanText(data.company) !== '') return json({ status: 'reserved' });

  const email = typeof data.email === 'string' ? normalizeEmail(data.email) : '';
  const name = cleanText(data.name);
  const workshop = cleanText(data.workshop);
  const city = cleanText(data.city);
  const lang = data.lang === 'en' ? 'en' : 'ro';

  if (!isValidField('name', name)) return json({ error: 'invalid_name' }, 400);
  if (!isValidEmail(email)) return json({ error: 'invalid_email' }, 400);
  if (!isValidField('workshop', workshop)) return json({ error: 'invalid_workshop' }, 400);
  if (!isValidField('city', city)) return json({ error: 'invalid_city' }, 400);
  if (data.consent !== true) return json({ error: 'consent_required' }, 400);

  try {
    const status = await reserveSpot({ email, name, workshop, city, lang }, FOUNDING_PARTNER_SPOTS);
    return json({ status });
  } catch (err) {
    console.error('[founding-partner] reserve failed', err);
    return json({ error: 'server' }, 502);
  }
};
