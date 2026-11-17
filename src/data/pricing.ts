// Plan tiers. Labels live in the page translation files; numbers live here.
// docs/DECISIONS.md (2026-11-09): pre-billing = Gratuit full Debitare;
// at paid launch = Gratuit (3 downloads) + paid Debitare (unlimited). Higher
// plans (Atelier → CNC → Producție → AI) ship later.
// Marketing offer (RO + EN): first 2 months free for Founding Partners.

/** Legacy percent placeholder for older FAQ strings; current i18n uses “2 months free”. */
export const FP_DISCOUNT_PERCENT = 20;

export interface Tier {
  key: 'free' | 'debitare';
  /** RON per month when published; null until list prices are set. */
  monthly: number | null;
  /** Founding Partner yearly price in RON, when published. */
  foundingPartnerYearly?: number;
  /** Highlight this tier on the Pricing page (FP path → paid Debitare). */
  highlight?: boolean;
}

export const tiers: Tier[] = [
  { key: 'free', monthly: 0 },
  // Paid Debitare at billing — same product as Free Debitare, unlimited exports.
  { key: 'debitare', monthly: null, highlight: true },
];

/** Live Pricing cards until higher plans ship: Gratuit + Debitare. */
export const coreTiers = tiers;
