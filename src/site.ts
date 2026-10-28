// The launch switch. Every page of the site is listed here, with its public
// address and whether it's published.
//
//   published: false -> built at /preview/<address> only: not indexed, shows a
//                       "preview" banner, and never linked from public pages.
//   published: true  -> built at its real address: indexable, in menus.
//
// To launch a page, set it to true and deploy. Home and Privacy have a
// stand-in at their real address while unpublished (the coming-soon page and
// the temporary privacy notice), so those addresses never 404.
// See "Launching pages" in README.md.

import { REFERRAL_PROGRAM } from './config';
import { useHomeTranslations, type Lang } from './i18n';

export type PageKey =
  | 'home'
  | 'foundingPartner'
  | 'demo'
  | 'roadmap'
  | 'pricing'
  | 'faq'
  | 'blog'
  | 'terms'
  | 'privacy'
  | 'refund';

export const published: Record<PageKey, boolean> = {
  home: false,
  foundingPartner: false,
  demo: false,
  // Public during waitlist: shows what ships when, without promising dates.
  roadmap: true,
  pricing: false,
  faq: false,
  // The blog's index page. Each post also has its own `published` flag (src/content/blog/).
  blog: false,
  terms: true,
  privacy: true,
  // Paddle requires this at billing live (CU-1amhxucn004). Draft is in preview until then.
  refund: false,
};

/**
 * Whether the product itself is publicly available (launch, month 0). Only then
 * does the Home page describe Mobilcab to search engines as a software product
 * with prices (Build Brief 7: `SoftwareApplication` "once the product is public").
 * Separate from `home`, which goes live months earlier.
 */
export const productPublic = false;

/** Public addresses. Preview addresses are the same with /preview in front. */
export const livePaths: Record<PageKey, Record<Lang, string>> = {
  home: { ro: '/ro/', en: '/en/' },
  foundingPartner: { ro: '/ro/founding-partner/', en: '/en/founding-partner/' },
  demo: { ro: '/ro/cum-functioneaza/', en: '/en/how-it-works/' },
  roadmap: { ro: '/ro/roadmap/', en: '/en/roadmap/' },
  pricing: { ro: '/ro/preturi/', en: '/en/pricing/' },
  faq: { ro: '/ro/intrebari/', en: '/en/faq/' },
  blog: { ro: '/ro/blog/', en: '/en/blog/' },
  terms: { ro: '/ro/termeni/', en: '/en/terms/' },
  privacy: { ro: '/ro/confidentialitate/', en: '/en/privacy/' },
  refund: { ro: '/ro/rambursare/', en: '/en/refund/' },
};

/**
 * Where the waitlist confirmation link lands (and the invite-progress page the
 * welcome email links to). Always available, outside the launch switch, since
 * the sign-up form needs it from day one; not indexed.
 */
export const confirmedPaths: Record<Lang, string> = { ro: '/ro/confirmat/', en: '/en/confirmed/' };

/** Pages with a stand-in at their real address while unpublished. */
export const hasStandIn = (key: PageKey) => key === 'home' || key === 'privacy';

export const previewPath = (key: PageKey, lang: Lang) => `/preview${livePaths[key][lang]}`;

/** Where the page itself is built. */
export const pathFor = (key: PageKey, lang: Lang) => (published[key] ? livePaths[key][lang] : previewPath(key, lang));

export const pathsFor = (key: PageKey): Record<Lang, string> => ({ ro: pathFor(key, 'ro'), en: pathFor(key, 'en') });

/**
 * Where a link to `key` should point, from a page that is itself a preview or
 * public. Returns null when the link would expose an unpublished page on a
 * public page, so callers can leave it out.
 */
export function linkFor(key: PageKey, lang: Lang, fromPreview: boolean): string | null {
  if (published[key] || fromPreview) return pathFor(key, lang);
  return hasStandIn(key) ? livePaths[key][lang] : null;
}

/**
 * The "join free" link: the waitlist form on the Home page, or on the
 * coming-soon page while Home isn't published (both carry the same anchor).
 */
export const joinFreeHref = (lang: Lang, fromPreview: boolean) =>
  `${linkFor('home', lang, fromPreview)}#${useHomeTranslations(lang).anchors.join}`;

// The Founding Partner form collects name, workshop and city, which only the
// full Privacy Policy covers (the temporary notice doesn't). Stop the build
// rather than publish it without one.
if (published.foundingPartner && !published.privacy) {
  throw new Error('src/site.ts: publish the full Privacy Policy (privacy: true) before the Founding Partner page.');
}

// The referral program stores who invited whom, which the temporary notice doesn't cover either.
if (REFERRAL_PROGRAM && !published.privacy) {
  throw new Error('src/config.ts: publish the full Privacy Policy (privacy: true in src/site.ts) before turning on REFERRAL_PROGRAM.');
}
