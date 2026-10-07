// The address shown on the privacy and FAQ pages. Set CONTACT_EMAIL_CONFIRMED to
// true once this mailbox really exists; production deploys are blocked until
// then (scripts/launch-check.mjs).
export const CONTACT_EMAIL = 'contact@mobilcab.com';
export const CONTACT_EMAIL_CONFIRMED = false;

// Founding Partner spots (docs/DECISIONS.md). Reservations stop at this number.
export const FOUNDING_PARTNER_SPOTS = 100;

// The referral program (docs/DECISIONS.md): invite links, invite counts and the
// "share your link" block. Planned for month -4 (Marketing Plan 3c). While
// false, sign-ups still use double opt-in, and ?ref= links are ignored.
// Turning it on requires the full Privacy Policy to be published (src/site.ts).
export const REFERRAL_PROGRAM = false;
/** Confirmed invites for a guaranteed private-beta invite. */
export const REFERRAL_GOAL = 3;
/** Invites counted per person at most. */
export const REFERRAL_CAP = 5;

// Used by the Brevo email templates (scripts/build-emails.mjs, `npm run emails`).
// Leave a value empty and the emails show a visible [COMPLETEAZĂ] marker instead.
export const EMAIL_SETTINGS = {
  /** Signature: "[name], fondatori Mobilcab". */
  founderName: 'Stefan si Fineas',
  /** Sender identification required in marketing emails: company name and address. */
  companyLine: 'Mobilcab, Romania',
  /** Public site address, for links in the emails. */
  siteUrl: 'https://mobilcab.com',
  /** A demo video URL (e.g. the Demo page). Empty = the "see how it works" line is left out. */
  demoUrl: '',
};
