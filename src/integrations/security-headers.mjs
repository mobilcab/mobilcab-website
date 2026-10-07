// Adds security headers to every response on Vercel.
//
// The Vercel adapter writes its own routing config (.vercel/output/config.json),
// so headers in vercel.json aren't guaranteed to apply. This runs after the
// adapter and prepends one header rule to that config instead.
//
// The Content-Security-Policy itself comes from Astro (`security.csp` in
// astro.config.mjs) as a <meta> tag with script hashes. `frame-ancestors` can't
// be set from a <meta> tag, so it's sent here as a second, header-only policy.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';

export const securityHeaders = {
  'Content-Security-Policy': "frame-ancestors 'none'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Strict-Transport-Security': 'max-age=63072000',
};

export default function securityHeadersIntegration() {
  return {
    name: 'mobilcab:security-headers',
    hooks: {
      'astro:build:done': ({ logger }) => {
        const configPath = new URL('../../.vercel/output/config.json', import.meta.url);
        if (!existsSync(configPath)) {
          logger.warn('.vercel/output/config.json not found; security headers were not added.');
          return;
        }
        const config = JSON.parse(readFileSync(configPath, 'utf8'));
        config.routes = [{ src: '^/(.*)$', headers: securityHeaders, continue: true }, ...(config.routes ?? [])];
        writeFileSync(configPath, JSON.stringify(config, null, 2));
        logger.info('Added security headers to Vercel routes.');
      },
    },
  };
}
