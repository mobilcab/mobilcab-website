// Plan tiers. Labels live in the page translation files; numbers live here.
// docs/DECISIONS.md (2026-11-09): pre-billing = Gratuit full Debitare;
// at billing = Gratuit (3 downloads) + paid Debitare (unlimited). Higher
// plans (Atelier → CNC → Producție → AI) ship later. FP = 20% / 6 months.

/** Founding Partner discount off list when billing opens (locked 6 months). */
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
