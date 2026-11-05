// Checks the built site in dist/ (run with `npm run test:build`, which builds
// first). These are the checks that matter most before a deploy: no public page
// exposes a preview, previews aren't indexed, the CSP covers every script, and
// test-mode code never ships.
//
// On Vercel this read .vercel/output; the Cloudflare adapter writes a different
// shape: pages in dist/client, the Worker in dist/server, and the effective
// Wrangler config at dist/server/wrangler.json.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = join(import.meta.dirname, '../..');
const output = join(root, 'dist');
const staticDir = join(output, 'client');
const serverDir = join(output, 'server');

if (!existsSync(staticDir)) throw new Error('No build output: run `npm run test:build` (it builds first).');

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

/** The Wrangler config files allow // comments, so JSON.parse alone is not enough. */
const readJsonc = (file: string) =>
  JSON.parse(
    readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .filter((line) => !/^\s*\/\//.test(line))
      .join('\n'),
  );

const pages = walk(staticDir)
  .filter((f) => f.endsWith('.html'))
  .map((file) => ({
    url: `/${relative(staticDir, file).split(sep).join('/')}`.replace(/index\.html$/, ''),
    html: readFileSync(file, 'utf8'),
  }));
const isPreview = (url: string) => url.startsWith('/preview/');
const noindex = (html: string) => html.includes('<meta name="robots" content="noindex">');
const publicPages = pages.filter((p) => !isPreview(p.url) && p.url !== '/404.html');

describe('built pages', () => {
  it('found the pages', () => {
    expect(pages.length).toBeGreaterThan(10);
    expect(pages.map((p) => p.url)).toEqual(expect.arrayContaining(['/ro/', '/en/', '/ro/confidentialitate/', '/404.html']));
  });

  it('never links a public page to a preview', () => {
    for (const page of publicPages) expect(page.html, page.url).not.toContain('href="/preview/');
  });

  it('marks every preview page as not indexed, with no canonical link', () => {
    for (const page of pages.filter((p) => isPreview(p.url))) {
      expect(noindex(page.html), page.url).toBe(true);
      expect(page.html, page.url).not.toContain('rel="canonical"');
    }
  });

  it('gives indexable pages a canonical link and language alternates', () => {
    for (const page of publicPages.filter((p) => !noindex(p.html))) {
      expect(page.html, page.url).toContain('rel="canonical"');
      expect(page.html, page.url).toContain('hreflang="ro"');
    }
  });

  it('keeps the confirmation pages out of search engines', () => {
    for (const url of ['/ro/confirmat/', '/en/confirmed/']) {
      expect(noindex(pages.find((p) => p.url === url)!.html), url).toBe(true);
    }
  });

  it('covers every inline script with a hash in the page CSP', () => {
    for (const page of pages) {
      const csp = page.html.match(/http-equiv="content-security-policy" content="([^"]*)"/)?.[1];
      expect(csp, page.url).toBeDefined();
      for (const [, attrs, body] of page.html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
        if (/\bsrc=|application\/ld\+json/.test(attrs!)) continue;
        const hash = createHash('sha256').update(body!, 'utf8').digest('base64');
        expect(csp, `${page.url}: inline script not allowed by the CSP`).toContain(`sha256-${hash}`);
      }
    }
  });

  it('has no inline style attributes, which the CSP would block', () => {
    for (const page of pages) expect(page.html, page.url).not.toMatch(/<[a-z][^>]*\sstyle="/);
  });
});

describe('sitemap and robots.txt', () => {
  const sitemap = readFileSync(join(staticDir, 'sitemap.xml'), 'utf8');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);

  it('lists only public pages that exist', () => {
    expect(locs.length).toBeGreaterThan(0);
    const built = new Set(pages.map((p) => p.url));
    for (const loc of locs) {
      expect(loc, loc).not.toMatch(/^\/preview\//);
      expect(built.has(loc), `${loc} is in the sitemap but wasn't built`).toBe(true);
    }
  });

  it('leaves out pages that are not indexed', () => {
    for (const loc of locs) expect(noindex(pages.find((p) => p.url === loc)!.html), loc).toBe(false);
  });

  it('points robots.txt at the sitemap', () => {
    expect(readFileSync(join(staticDir, 'robots.txt'), 'utf8')).toMatch(/^Sitemap: https:\/\/.+\/sitemap\.xml$/m);
  });
});

describe('Cloudflare Worker config', () => {
  const config = readJsonc(join(serverDir, 'wrangler.json'));
  const serverCode = walk(serverDir)
    .filter((f) => /\.(m?js)$/.test(f))
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n');

  it('ships the generated Worker entry and the static assets next to it', () => {
    expect(config.main).toBe('entry.mjs');
    expect(existsSync(join(serverDir, config.main))).toBe(true);
    expect(config.assets.directory).toBe('../client');
  });

  it('routes every API endpoint', () => {
    for (const name of ['subscribe', 'confirm', 'referral', 'founding-partner', 'cleanup']) {
      expect(serverCode).toContain(`"/api/${name}"`);
    }
  });

  it('keeps the site Worker free of a cron schedule', () => {
    // The daily clean-up is its own Worker (cron/wrangler.jsonc), so a deploy of
    // the site can never drop the schedule.
    expect(config.triggers?.crons ?? []).toEqual([]);
  });

  it('claims the marketing hostnames and nothing else', () => {
    // `app.mobilcab.com` is the CAD production app and still lives on Vercel,
    // reached through the wildcard CNAME. A wildcard route here would route the
    // whole app through this Worker, so only the two marketing hostnames may
    // ever appear.
    const patterns = (config.routes ?? []).map((route) => route.pattern).sort();
    expect(patterns).toEqual(['mobilcab.com', 'www.mobilcab.com']);
    for (const route of config.routes) expect(route.custom_domain).toBe(true);
  });

  it('schedules the daily clean-up in the dedicated cleanup Worker', () => {
    const cron = readJsonc(join(root, 'cron/wrangler.jsonc'));
    expect(cron.triggers.crons).toEqual(['0 3 * * *']);
    expect(cron.main).toBe('./worker.mjs');
  });

  it('declares no session KV namespace, since the site has no sessions', () => {
    expect(config.kv_namespaces).toEqual([]);
  });

  it('ships no local-test-mode code', () => {
    expect(serverCode).toContain('api.brevo.com');
    for (const marker of ['[brevo mock]', 'dev-only-secret', 'devConfirmUrl', 'lastConfirmUrl']) {
      expect(serverCode).not.toContain(marker);
    }
  });
});

describe('Cloudflare static files', () => {
  const headers = readFileSync(join(staticDir, '_headers'), 'utf8');
  const redirects = readFileSync(join(staticDir, '_redirects'), 'utf8');

  it('applies the security headers to every asset', () => {
    expect(headers).toMatch(/^\/\*$/m);
    for (const header of [
      "Content-Security-Policy: frame-ancestors 'none'",
      'X-Frame-Options: DENY',
      'X-Content-Type-Options: nosniff',
      'Referrer-Policy: strict-origin-when-cross-origin',
      'Cross-Origin-Opener-Policy: same-origin',
      'Strict-Transport-Security:',
    ]) {
      expect(headers).toContain(header);
    }
  });

  it('keeps the hashed assets cacheable forever', () => {
    expect(headers).toMatch(/^\/_astro\/\*$/m);
    expect(headers).toContain('Cache-Control: public, max-age=31536000, immutable');
  });

  it('redirects the root to /ro/ with a real 301', () => {
    expect(redirects).toMatch(/^\/\s+\/ro\/\s+301$/m);
  });

  it('does not ship a meta-refresh page at the root', () => {
    expect(existsSync(join(staticDir, 'index.html'))).toBe(false);
  });
});
