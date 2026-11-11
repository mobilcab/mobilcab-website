// Field rules for the Founding Partner reservation form, shared by the form
// script (client) and the endpoint (server).

export const RESERVATION_LIMITS = {
  name: { min: 2, max: 100 },
  workshop: { min: 0, max: 120 },
  city: { min: 2, max: 80 },
  // Same bounds as public.waitlist_requests.phone (6..30).
  phone: { min: 6, max: 30 },
} as const;

export type ReservationField = keyof typeof RESERVATION_LIMITS;

/** Collapses whitespace so "  Ion   Pop " and "Ion Pop" are the same. */
export const cleanText = (raw: unknown): string => (typeof raw === 'string' ? raw.replace(/\s+/g, ' ').trim() : '');

/** Digits plus the usual separators (+ ( ) . - space), at least 6 digits. */
export const isValidPhone = (value: string): boolean =>
  isValidField('phone', value) && /^\+?[\d\s().-]+$/.test(value) && value.replace(/\D/g, '').length >= 6;

export function isValidField(field: ReservationField, value: string): boolean {
  const { min, max } = RESERVATION_LIMITS[field];
  return value.length >= min && value.length <= max;
}
