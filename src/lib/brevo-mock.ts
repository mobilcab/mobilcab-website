// Stand-in for Brevo during `npm run dev` when no API key is set, so every form
// state can be tried locally. Only loaded when import.meta.env.DEV is true, so
// it is not part of production builds. State resets when the dev server restarts.
//
// Waitlist (double opt-in):
//   a new address          -> "pending"; no email is sent: the confirmation link
//                             is printed in the dev server log instead
//   opening that link      -> on the waitlist; counts the invite, if any
//   a confirmed address    -> "already"
//   /api/cleanup?days=0    -> deletes all unconfirmed sign-ups (days only works in dev)
//   an address starting with "fail@" -> server error
//
// Founding Partner reservations:
//   any new address        -> "reserved" (counter goes down by one)
//   the same address again -> "already"
//   an address starting with "fail@" -> server error
//   an address starting with "full@" -> "all spots taken"

import type { CleanupResult, ConfirmOptions, ConfirmResult, ReserveResult, SignupRequest, SignupResult } from './brevo';

interface MockContact {
  code: string;
  referredBy: string;
  referrals: number;
  confirmed: boolean;
  /** When the confirmation email was "sent". */
  sentAt: number;
}

const contacts = new Map<string, MockContact>();
const reservations = new Set<string>();

/** The last confirmation link per address, so the API can hand it to the page in dev. */
export const lastConfirmUrl = new Map<string, string>();

// Long enough to see the "sending" state on the button.
const pause = () => new Promise((resolve) => setTimeout(resolve, 700));

export async function mockRequestSignup(r: SignupRequest): Promise<SignupResult> {
  await pause();
  if (r.email.startsWith('fail@')) throw new Error('[brevo mock] simulated failure');
  const existing = contacts.get(r.email);
  if (existing?.confirmed) return 'already';
  if (existing) existing.sentAt = Date.now();
  else contacts.set(r.email, { code: r.newCode(), referredBy: r.referredBy ?? '', referrals: 0, confirmed: false, sentAt: Date.now() });
  const url = r.confirmUrl(await r.makeToken());
  lastConfirmUrl.set(r.email, url);
  console.warn(`[brevo mock] confirmation link for ${r.email}: ${url}`);
  return 'pending';
}

export async function mockConfirmSignup(email: string, o: ConfirmOptions): Promise<ConfirmResult | null> {
  const contact = contacts.get(email);
  if (!contact) return null;
  if (contact.confirmed) return { code: contact.code, fresh: false };
  contact.confirmed = true;
  if (o.countReferral && contact.referredBy && contact.referredBy !== contact.code) {
    const inviter = [...contacts.entries()].find(([, c]) => c.code === contact.referredBy);
    if (inviter && inviter[0] !== email && inviter[1].referrals < o.referralCap) inviter[1].referrals += 1;
  }
  return { code: contact.code, fresh: true };
}

export async function mockReferralCount(code: string): Promise<number | null> {
  return [...contacts.values()].find((c) => c.code === code)?.referrals ?? null;
}

export async function mockCleanupUnconfirmed(olderThanMs: number, dryRun: boolean): Promise<CleanupResult> {
  const cutoff = Date.now() - olderThanMs;
  const checked = contacts.size;
  const stale = [...contacts.entries()].filter(([, c]) => !c.confirmed && c.sentAt < cutoff).map(([email]) => email);
  if (!dryRun) for (const email of stale) contacts.delete(email);
  return { checked, matched: stale.length, deleted: dryRun ? 0 : stale.length };
}

export async function mockCountReservations(): Promise<number> {
  return reservations.size;
}

export async function mockReserveSpot(email: string, totalSpots: number): Promise<ReserveResult> {
  await pause();
  if (email.startsWith('fail@')) throw new Error('[brevo mock] simulated failure');
  if (email.startsWith('full@')) return 'full';
  if (reservations.has(email)) return 'already';
  if (reservations.size >= totalSpots) return 'full';
  reservations.add(email);
  return 'reserved';
}
