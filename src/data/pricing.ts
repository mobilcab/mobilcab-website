// Plan tiers in RON. Labels live in the page translation files; numbers live here.
// Phase 1 (docs/DECISIONS.md): app free for everyone; FP waitlist for discount when
// paid Basic opens with M2. Amounts below are indicative for layout/FAQ only until
// SRL + checkout. Later / non-FP buyers pay list; no FP yearly figure until lock
// duration and discount are decided.

export interface Tier {
  key: 'free' | 'basic' | 'starter' | 'pro' | 'studio';
  /** RON per month (indicative until paid launch). */
  monthly: number;
  /** Founding Partner yearly price in RON, when published. */
  foundingPartnerYearly?: number;
  /** Highlight this tier on the Pricing page (e.g. Basic / FP path). */
  highlight?: boolean;
  /** AI-assist requests per month; 0 = only the one-time onboarding trial. */
  aiPerMonth: number;
}

export const tiers: Tier[] = [
  { key: 'free', monthly: 0, aiPerMonth: 0 },
  // Basic = M1+M2 at paid launch; CNC (M3+) is not included. FP waitlist discount TBD.
  { key: 'basic', monthly: 49, highlight: true, aiPerMonth: 0 },
  { key: 'starter', monthly: 99, aiPerMonth: 50 },
  { key: 'pro', monthly: 179, aiPerMonth: 150 },
  { key: 'studio', monthly: 289, aiPerMonth: 400 },
];
