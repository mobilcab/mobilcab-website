// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import securityHeaders from './src/integrations/security-headers.mjs';
import launchCheck from './src/integrations/launch-check.mjs';
import vercelCrons from './src/integrations/vercel-crons.mjs';

export default defineConfig({
  site: process.env.SITE_URL || 'https://mobilcab.com',
  // Every page is prerendered to static HTML; only /api/subscribe runs on demand.
  output: 'static',
  adapter: vercel(),
  integrations: [launchCheck(), securityHeaders(), vercelCrons()],
  redirects: {
    '/': '/ro/',
  },
  // Emitted as a <meta> tag on every page, with hashes for Astro's own scripts.
  // Other security headers (incl. frame-ancestors) come from src/integrations/security-headers.mjs.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        // YouTube: demo video thumbnails and the click-to-load player (src/components/VideoPlayer.astro).
        "img-src 'self' data: https://i.ytimg.com",
        'frame-src https://www.youtube-nocookie.com',
        "font-src 'self'",
        "connect-src 'self' https://plausible.io",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
      ],
      scriptDirective: {
        resources: ["'self'", 'https://plausible.io'],
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
      // Sent by Vercel Cron to /api/cleanup; any long random string.
      CRON_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      PUBLIC_PLAUSIBLE_DOMAIN: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
