// sitemap.xml (Build Brief 7), generated from the launch switch in src/site.ts:
// only public addresses are listed. Pages that exist in both languages carry
// hreflang alternates; blog posts are listed in their own language only.
import type { APIRoute } from 'astro';
import { languages, type Lang } from '../i18n';
import { isPostPublic, postPath, posts } from '../lib/blog';
import { hasStandIn, livePaths, published, type PageKey } from '../site';

const escapeXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('sitemap.xml needs `site` in astro.config.mjs');
  const abs = (path: string) => escapeXml(new URL(path, site).href);

  // A page's real address is public when it's published, or shows a stand-in
  // (the coming-soon page, the temporary privacy notice).
  const publicKeys = (Object.keys(livePaths) as PageKey[]).filter((key) => published[key] || hasStandIn(key));

  const pageEntries = publicKeys.flatMap((key) =>
    languages.map((lang) => {
      const alternates = languages
        .map((l: Lang) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(livePaths[key][l])}"/>`)
        .join('\n');
      return `  <url>\n    <loc>${abs(livePaths[key][lang])}</loc>\n${alternates}\n  </url>`;
    }),
  );

  const postEntries = posts
    .filter(isPostPublic)
    .map(
      (post) =>
        `  <url>\n    <loc>${abs(postPath(post))}</loc>\n    <lastmod>${post.date.toISOString().slice(0, 10)}</lastmod>\n  </url>`,
    );

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...pageEntries, ...postEntries].join('\n')}
</urlset>
`;

  // text/xml is the type Google's sitemap docs cite most often; charset helps
  // picky parsers. (Vercel may still serve a static file without the charset.)
  return new Response(body, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
};
