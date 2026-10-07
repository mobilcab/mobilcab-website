// Shared by the form script (client) and the subscribe endpoint (server),
// so both sides apply exactly the same rule.

export const EMAIL_MAX_LENGTH = 254;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return email.length <= EMAIL_MAX_LENGTH && EMAIL_PATTERN.test(email);
}
