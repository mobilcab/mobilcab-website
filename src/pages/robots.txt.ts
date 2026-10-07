// robots.txt, generated so the sitemap line carries the site's full address.
// Preview pages aren't blocked here: they carry `noindex` instead, which only
// works if crawlers are allowed to read them (and no public page links to them).
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('robots.txt needs `site` in astro.config.mjs');
  const body = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${new URL('/sitemap.xml', site).href}
`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
