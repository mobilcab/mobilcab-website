// Daily clean-up of unconfirmed sign-ups, as a Cron Trigger.
//
// This replaces the Vercel Cron Job that used to be written into
// .vercel/output/config.json by src/integrations/vercel-crons.mjs. It is a
// separate Worker on purpose: a deploy of the site can then never break the
// schedule, and the site Worker does not need a `scheduled` handler at all.
//
// It holds no logic. It calls the site's own endpoint with CRON_SECRET, so the
// deletion rules stay in one place (src/lib/brevo.ts) and the endpoint is still
// the thing you can call by hand with ?dryRun=1.

const ENDPOINT = 'https://mobilcab.com/api/cleanup';

export default {
  /**
   * @param {ScheduledController} _controller
   * @param {{ CRON_SECRET?: string }} env
   */
  async scheduled(_controller, env) {
    if (!env.CRON_SECRET) throw new Error('CRON_SECRET is not set on the cleanup Worker.');

    const res = await fetch(ENDPOINT, {
      headers: { authorization: `Bearer ${env.CRON_SECRET}` },
      signal: AbortSignal.timeout(120_000),
    });

    if (!res.ok) {
      // Throwing surfaces the failure in the Workers log and in Cloudflare's
      // cron event history; a silent 500 would look like a successful night.
      throw new Error(`Clean-up failed: ${res.status} ${await res.text().catch(() => '')}`.trim());
    }

    console.log(`[cleanup-cron] ${await res.text()}`);
  },
};
