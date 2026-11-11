import { NEON_DATA_API_URL } from 'astro:env/server';

export interface PanelRequest {
  name: string;
  email: string;
  phone: string;
  workshop: string;
  city: string;
}

const trimSlash = (url: string) => url.replace(/\/$/, '');

/**
 * Neon Auth sits next to the Data API: `.../neondb/rest/v1` on the `apirest` host
 * <-> `.../neondb/auth` on the `neonauth` host (see environment.*.ts in mobilcab-cad).
 */
const authUrl = (dataApiUrl: string) => trimSlash(dataApiUrl).replace('.apirest.', '.neonauth.').replace(/\/rest\/v1$/, '/auth');

/**
 * The Data API refuses calls without a JWT, even for the `anonymous` role. Neon Auth
 * hands out an anonymous token, which is what the CAD app uses before login too.
 */
async function anonymousToken(dataApiUrl: string): Promise<string> {
  const res = await fetch(`${authUrl(dataApiUrl)}/token/anonymous`, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });
  const body: { token?: string } | null = await res.json().catch(() => null);
  if (!res.ok || !body?.token) throw new Error(`anonymous token: HTTP ${res.status}`);
  return body.token;
}

/**
 * Saves a Founding Partner request where the CAD app's admin panel reads it:
 * `public.waitlist_requests`, through the anonymous RPC `submit_waitlist_request`
 * on the Neon Data API (the only insert path, and it enforces the cap).
 *
 * Returns `null` when no Data API URL is configured (that environment is
 * Brevo-only), `true` when saved, `false` on any failure. Never throws: the
 * person is already on the Brevo list, so this must not fail their sign-up.
 */
export async function saveToPanel(r: PanelRequest, consentAt = new Date()): Promise<boolean | null> {
  if (!NEON_DATA_API_URL) return null;
  try {
    const token = await anonymousToken(NEON_DATA_API_URL);
    const res = await fetch(`${trimSlash(NEON_DATA_API_URL)}/rpc/submit_waitlist_request`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({
        p_name: r.name,
        p_email: r.email,
        p_phone: r.phone,
        p_workshop: r.workshop || null,
        p_city: r.city,
        p_cui: null,
        p_consent_at: consentAt.toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
    });
    const body: { ok?: boolean; error?: string } | null = await res.json().catch(() => null);
    if (res.ok && body?.ok) return true;
    console.error('[founding-partner] panel save failed', res.status, body?.error ?? '');
    return false;
  } catch (err) {
    console.error('[founding-partner] panel save failed', err);
    return false;
  }
}
