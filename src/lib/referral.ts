// Personal invite codes, e.g. mobilcab.ro/ro/?ref=k7Q2xMa9. Random and
// unguessable, and they contain nothing about the person. Shared by the form
// script (client) and the endpoints (server).

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
const LENGTH = 8;
const PATTERN = new RegExp(`^[${ALPHABET}]{${LENGTH}}$`);

export const isReferralCode = (value: unknown): value is string => typeof value === 'string' && PATTERN.test(value);

export function newReferralCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(LENGTH));
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
}
