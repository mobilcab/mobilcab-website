// Plan tiers in RON (Build Brief 4.3, Marketing Plan 3a). The single source for
// every page that shows prices: FAQ now, the Pricing page later. Labels live in
// the page translation files; only the numbers live here.
// Final prices are confirmed at month -1 (Build Brief Section 6).

export interface Tier {
  key: 'free' | 'basic' | 'starter' | 'pro' | 'studio';
  /** RON per month. */
  monthly: number;
  /** Founding Partner yearly price in RON, where one exists. */
  foundingPartnerYearly?: number;
  /** AI-assist requests per month; 0 = only the one-time onboarding trial. */
  aiPerMonth: number;
}

export const tiers: Tier[] = [
  { key: 'free', monthly: 0, aiPerMonth: 0 },
  { key: 'basic', monthly: 49, foundingPartnerYearly: 549, aiPerMonth: 0 },
  { key: 'starter', monthly: 99, aiPerMonth: 50 },
  { key: 'pro', monthly: 179, aiPerMonth: 150 },
  { key: 'studio', monthly: 289, aiPerMonth: 400 },
];
