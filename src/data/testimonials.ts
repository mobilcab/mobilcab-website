// Real quotes from Founding Partners, added once the private beta produces them
// (Build Brief 4.2, Funnel Plan 3.1). The section stays hidden while a list is
// empty. Never add placeholder or invented quotes here.

import type { Lang } from '../i18n';

export interface Testimonial {
  quote: string;
  name: string;
  workshop: string;
  city: string;
}

export const testimonials: Record<Lang, Testimonial[]> = {
  ro: [],
  en: [],
};
