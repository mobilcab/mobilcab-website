// Structured data (schema.org JSON-LD) for search engines (Build Brief 7).
// Only facts that are true today: no ratings, reviews or invented details.

import { tiers } from '../data/pricing';
import type { Lang } from '../i18n';
import type { Post } from './blog';

type Thing = Record<string, unknown>;

const organization = (site: URL): Thing => ({
  '@type': 'Organization',
  '@id': new URL('/#organization', site).href,
  name: 'Mobilcab',
  url: site.href,
});

/** Home and coming-soon pages: who runs the site, and the site itself. */
export const homeData = (site: URL, lang: Lang): Thing[] => [
  { '@context': 'https://schema.org', ...organization(site) },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Mobilcab',
    url: site.href,
    inLanguage: lang === 'ro' ? 'ro-RO' : 'en',
    publisher: { '@id': new URL('/#organization', site).href },
  },
];

/** Once the product is public: the app, with its price range in RON. */
export const softwareData = (site: URL, lang: Lang, description: string): Thing => {
  const prices = tiers.map((t) => t.monthly);
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Mobilcab',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web browser',
    description,
    url: new URL(lang === 'ro' ? '/ro/' : '/en/', site).href,
    inLanguage: ['ro-RO', 'en'],
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'RON',
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: tiers.length,
    },
    publisher: { '@id': new URL('/#organization', site).href },
  };
};

/** A published blog post. */
export const postData = (site: URL, post: Post, url: string): Thing => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.description,
  datePublished: post.date.toISOString().slice(0, 10),
  inLanguage: post.lang === 'ro' ? 'ro-RO' : 'en',
  mainEntityOfPage: url,
  author: organization(site),
  publisher: { '@id': new URL('/#organization', site).href },
  image: new URL(`/og-${post.lang}.png`, site).href,
});
