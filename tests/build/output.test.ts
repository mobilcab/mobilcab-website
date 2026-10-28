// Checks the built site in .vercel/output (run with `npm run test:build`, which
// builds first). These are the checks that matter most before a deploy: no
// public page exposes a preview, previews aren't indexed, the CSP covers every
// script, and test-mode code never ships.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

const output = join(import.meta.dirname, '../../.vercel/output');
const staticDir = join(output, 'static');

if (!existsSync(staticDir)) throw new Error('No build output: run `npm run test:build` (it builds first).');

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

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
    expect(pages.map((p) => p.url)).toEqual(
      expect.arrayContaining(['/ro/', '/en/', '/ro/confidentialitate/', '/ro/termeni/', '/404.html']),
    );
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

describe('Vercel config and server code', () => {
  const config = JSON.parse(readFileSync(join(output, 'config.json'), 'utf8'));

  it('applies the security headers before every other route', () => {
    expect(config.routes[0]).toMatchObject({ src: '^/(.*)$', continue: true });
    expect(config.routes[0].headers).toMatchObject({
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "frame-ancestors 'none'",
    });
  });

  it('routes every API endpoint', () => {
    const routes = config.routes.map((r: { src?: string }) => r.src ?? '').join('\n');
    for (const name of ['subscribe', 'confirm', 'referral', 'founding-partner', 'cleanup']) expect(routes).toContain(`/api/${name}`);
  });

  it('schedules the daily clean-up', () => {
    expect(config.crons).toEqual([{ path: '/api/cleanup', schedule: '0 3 * * *' }]);
  });

  it('ships no local-test-mode code', () => {
    const code = walk(join(output, 'functions'))
      .filter((f) => /\.(m?js)$/.test(f))
      .map((f) => readFileSync(f, 'utf8'))
      .join('\n');
    expect(code).toContain('api.brevo.com');
    for (const marker of ['[brevo mock]', 'dev-only-secret', 'devConfirmUrl', 'lastConfirmUrl']) expect(code).not.toContain(marker);
  });
});
