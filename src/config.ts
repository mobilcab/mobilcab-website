// The address shown on the privacy and FAQ pages. Set CONTACT_EMAIL_CONFIRMED to
// true once this mailbox really exists; production deploys are blocked until
// then (scripts/launch-check.mjs).
export const CONTACT_EMAIL = 'contact@mobilcab.com';
export const CONTACT_EMAIL_CONFIRMED = true;

// Soft technical cap (docs/DECISIONS.md: first 15; may raise). Counter hidden by default.
// FP = waitlist for first 2 months free on paid plans; closes at subscription launch; later buyers pay list.
export const FOUNDING_PARTNER_SPOTS = 15;
/** When false, the FP page does not show a remaining-spots counter. */
export const FOUNDING_PARTNER_SHOW_COUNTER = false;

// Referral (docs/DECISIONS.md): off until billing. Newsletter form no longer
// sends ?ref= (Neon path). Legacy ConfirmedPage /api/referral still gated here.
// Turning it on requires the full Privacy Policy published (src/site.ts).
export const REFERRAL_PROGRAM = false;
/** Confirmed invites for a guaranteed private-beta invite. */
export const REFERRAL_GOAL = 3;
/** Invites counted per person at most. */
export const REFERRAL_CAP = 5;

/** Public app URL (free access). Primary “use the app” CTA on Home / Pricing / Roadmap. */
export const APP_URL = 'https://app.mobilcab.com';

/**
 * Founding Partner opt-in in the app (docs/DECISIONS.md).
 * Site FP page explains the program; enrollment happens here — not via Brevo form.
 * Pass `lang` so the app opens the waitlist in the same language as the site CTA.
 */
export function foundingPartnerAppUrl(lang: 'ro' | 'en' = 'ro'): string {
  const url = new URL(APP_URL);
  url.searchParams.set('founding', '1');
  url.searchParams.set('lang', lang);
  return url.toString();
}

/** @deprecated Prefer `foundingPartnerAppUrl(lang)` so EN CTAs open the app in English. */
export const FOUNDING_PARTNER_URL = foundingPartnerAppUrl('ro');

// Used by the Brevo email templates (scripts/build-emails.mjs, `npm run emails`).
// Leave a value empty and the emails show a visible [COMPLETEAZĂ] marker instead.
export const EMAIL_SETTINGS = {
  /** Signature: "[name], fondatori Mobilcab". */
  founderName: 'Fineas & Ștefan',
  /** Sender identification required in marketing emails: company name and address. */
  companyLine: 'Mobilcab, Romania',
  /** Public site address, for links in the emails. */
  siteUrl: 'https://mobilcab.com',
  /** A demo video URL (e.g. the Demo page). Empty = the "see how it works" line is left out. */
  demoUrl: '',
};
