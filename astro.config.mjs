// @ts-check
import { defineConfig, envField } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import launchCheck from './src/integrations/launch-check.mjs';

// The Cloudflare adapter brings the Cloudflare Vite plugin, which starts its own
// dev server. Vitest loads this file through `getViteConfig` (vitest.config.ts) to
// get astro:env and Markdown imports, and a second server on the same config is a
// hard startup error. Tests never need the adapter, so it is left out under Vitest.
const testing = process.env.VITEST === 'true';

export default defineConfig({
  site: process.env.SITE_URL || 'https://mobilcab.com',
  // Every page is prerendered to static HTML; only the /api/* routes run on demand.
  output: 'static',
  // Cloudflare Workers, not Pages: the adapter dropped Pages support in Astro 6.
  // `passthrough` because the site never uses astro:assets/<Image>; the default
  // (`cloudflare-binding`) would provision a paid Images binding we don't use.
  adapter: testing ? undefined : cloudflare({ imageService: 'passthrough' }),
  // No sessions anywhere, so the adapter must not provision a KV namespace.
  session: false,
  integrations: [launchCheck()],
  // `/` -> `/ro/` is not here on purpose: it is a real 301 in public/_redirects,
  // so the edge answers it instead of shipping a meta-refresh page.
  //
  // Emitted as a <meta> tag on every page, with hashes for Astro's own scripts.
  // The other security headers (incl. frame-ancestors) come from public/_headers.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        // YouTube: demo video thumbnails and the click-to-load player (src/components/VideoPlayer.astro).
        "img-src 'self' data: https://i.ytimg.com",
        'frame-src https://www.youtube-nocookie.com',
        "font-src 'self'",
        // Plausible (optional) + Cloudflare Web Analytics, only when a token is set.
        "connect-src 'self' https://plausible.io https://cloudflareinsights.com",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
      ],
      scriptDirective: {
        resources: ["'self'", 'https://plausible.io', 'https://static.cloudflareinsights.com'],
      },
    },
  },
  env: {
    schema: {
      // Optional in the schema so `astro dev` starts without keys; the endpoint
      // reports a clear error if they're missing at request time.
      BREVO_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      BREVO_LIST_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
      BREVO_LIST_ID_EN: envField.string({ context: 'server', access: 'secret', optional: true }),
      BREVO_FP_LIST_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Double opt-in: the Brevo transactional templates for the confirmation email.
      BREVO_CONFIRM_TEMPLATE_ID_RO: envField.string({ context: 'server', access: 'secret', optional: true }),
      BREVO_CONFIRM_TEMPLATE_ID_EN: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Signs the confirmation links. Any long random string; keep it secret.
      CONFIRM_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Sent by the daily Cron Worker to /api/cleanup; any long random string.
      CRON_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Neon Data API of the environment (…/neondb/rest/v1). Unset = Brevo-only:
      // Founding Partner requests then don't reach the CAD app's admin panel.
      NEON_DATA_API_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      PUBLIC_PLAUSIBLE_DOMAIN: envField.string({ context: 'client', access: 'public', optional: true }),
      // Cloudflare Web Analytics site token (dashboard -> Web Analytics). Read at
      // build time; empty means no page-view beacon at all.
      PUBLIC_CF_ANALYTICS_TOKEN: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
