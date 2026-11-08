// Plan tiers. Labels live in the page translation files; numbers live here.
// Phase 1 (docs/DECISIONS.md): app free for everyone; FP waitlist for 20% off
// when paid plans open with M2. List prices in RON are unpublished until billing
// — marketing shows FP_DISCOUNT_PERCENT only. Later / non-FP buyers pay list.
// Future AI / CNC tiers stay out of site marketing until they ship.

/** Founding Partner discount off list when billing opens (locked 6 months). */
export const FP_DISCOUNT_PERCENT = 20;

export interface Tier {
  key: 'free' | 'basic';
  /** RON per month when published; null until list prices are set. */
  monthly: number | null;
  /** Founding Partner yearly price in RON, when published. */
  foundingPartnerYearly?: number;
  /** Highlight this tier on the Pricing page (e.g. Basic / FP path). */
  highlight?: boolean;
}

export const tiers: Tier[] = [
  { key: 'free', monthly: 0 },
  // Basic = M1+M2 at paid launch. List RON TBD.
  { key: 'basic', monthly: null, highlight: true },
];

/** Free + Basic — shown on Pricing and FAQ. */
export const coreTiers = tiers;
