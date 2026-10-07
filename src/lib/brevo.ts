import {
  BREVO_API_KEY,
  BREVO_CONFIRM_TEMPLATE_ID_EN,
  BREVO_CONFIRM_TEMPLATE_ID_RO,
  BREVO_FP_LIST_ID,
  BREVO_LIST_ID,
  BREVO_LIST_ID_EN,
} from 'astro:env/server';
import type { Lang } from '../i18n';

const API = 'https://api.brevo.com/v3';

// Local test mode: `npm run dev` without a key talks to brevo-mock.ts instead.
// The ternary is on import.meta.env.DEV directly (not inside a function) so the
// production build can see `mock` is undefined and drops brevo-mock.ts entirely.
const mock = import.meta.env.DEV
  ? () => {
      console.warn('[brevo] No BREVO_API_KEY set: using the local test mode, nothing is sent to Brevo.');
      return import('./brevo-mock');
    }
  : undefined;

const useMock = () => mock !== undefined && !BREVO_API_KEY;
const loadMock = () => mock!();

function requireKey(): string {
  if (!BREVO_API_KEY) throw new Error('BREVO_API_KEY must be set');
  return BREVO_API_KEY;
}

function brevo(path: string, init: { method?: string; body?: unknown } = {}) {
  return fetch(`${API}${path}`, {
    method: init.method ?? 'GET',
    headers: {
      'api-key': requireKey(),
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    signal: AbortSignal.timeout(8000),
  });
}

async function fail(res: Response): Promise<never> {
  const body: { code?: string; message?: string } = await res.json().catch(() => ({}));
  throw new Error(`Brevo responded ${res.status}: ${body.code ?? ''} ${body.message ?? ''}`.trim());
}

// --- Waitlist with double opt-in (coming-soon page and "join free") ---------
//
// 1. requestSignup: the contact is created in Brevo *without* a list, and a
//    confirmation email is sent. Nobody is on the waitlist yet.
// 2. confirmSignup (from the link in that email): the contact is added to the
//    waitlist list, which triggers the welcome email automation, and, if they
//    came through someone's invite link, that person's REFERRALS goes up.
//
// Contact attributes used (create them in Brevo as described in README.md):
// REFCODE (text), REFERRED_BY (text), REFERRALS (number), CONFIRM_SENT_AT (text),
// LANGUAGE (text). REFCODE is also stored as the contact's ext_id, to look the
// inviter up by code.

const waitlistListId = (lang: Lang) => {
  if (!BREVO_LIST_ID) throw new Error('BREVO_LIST_ID must be set');
  return Number(lang === 'en' && BREVO_LIST_ID_EN ? BREVO_LIST_ID_EN : BREVO_LIST_ID);
};
const allWaitlistIds = () => [BREVO_LIST_ID, BREVO_LIST_ID_EN].filter(Boolean).map(Number);

/** Confirmation emails to the same address at most this often (anti-abuse). */
const RESEND_AFTER_MS = 10 * 60 * 1000;

interface Contact {
  email: string;
  ext_id?: string;
  listIds?: number[];
  attributes?: Record<string, unknown>;
}

async function getContact(identifier: string, type?: 'ext_id'): Promise<Contact | null> {
  const query = type ? `?identifierType=${type}` : '';
  const res = await brevo(`/contacts/${encodeURIComponent(identifier)}${query}`);
  if (res.status === 404) return null;
  if (!res.ok) return fail(res);
  return res.json();
}

export type SignupResult = 'pending' | 'already';

export interface SignupRequest {
  email: string;
  lang: Lang;
  /** The inviter's code, if they came through an invite link. */
  referredBy?: string;
  /** Builds the confirmation link for a token. */
  confirmUrl: (token: string) => string;
  /** Signs a confirmation token for this address. */
  makeToken: () => Promise<string>;
  /** A fresh invite code for this person. */
  newCode: () => string;
}

export async function requestSignup(r: SignupRequest): Promise<SignupResult> {
  if (useMock()) return (await loadMock()).mockRequestSignup(r);

  const existing = await getContact(r.email);
  if (existing?.listIds?.some((id) => allWaitlistIds().includes(id))) return 'already';

  const sentAt = Date.parse(String(existing?.attributes?.CONFIRM_SENT_AT ?? ''));
  if (Number.isFinite(sentAt) && Date.now() - sentAt < RESEND_AFTER_MS) return 'pending';

  const now = new Date().toISOString();
  if (existing) {
    // Known contact (e.g. a Founding Partner reservation, or an unconfirmed
    // sign-up): keep their code and who invited them; just note the resend.
    const res = await brevo(`/contacts/${encodeURIComponent(r.email)}`, {
      method: 'PUT',
      body: { attributes: { CONFIRM_SENT_AT: now, LANGUAGE: r.lang } },
    });
    if (!res.ok) return fail(res);
  } else {
    const code = r.newCode();
    const res = await brevo('/contacts', {
      method: 'POST',
      body: {
        email: r.email,
        ext_id: code,
        attributes: { REFCODE: code, REFERRED_BY: r.referredBy ?? '', REFERRALS: 0, CONFIRM_SENT_AT: now, LANGUAGE: r.lang },
        updateEnabled: false,
      },
    });
    if (res.status !== 201 && res.status !== 204) return fail(res);
  }

  await sendConfirmation(r.email, r.lang, r.confirmUrl(await r.makeToken()));
  return 'pending';
}

async function sendConfirmation(email: string, lang: Lang, url: string) {
  const templateId = Number(lang === 'en' ? BREVO_CONFIRM_TEMPLATE_ID_EN || BREVO_CONFIRM_TEMPLATE_ID_RO : BREVO_CONFIRM_TEMPLATE_ID_RO);
  if (!templateId) throw new Error('BREVO_CONFIRM_TEMPLATE_ID_RO must be set');
  const res = await brevo('/smtp/email', { method: 'POST', body: { to: [{ email }], templateId, params: { CONFIRM_URL: url } } });
  if (!res.ok) return fail(res);
}

export interface ConfirmOptions {
  /** Count the invite for whoever referred this person (the referral program is on). */
  countReferral: boolean;
  referralCap: number;
  newCode: () => string;
}

export interface ConfirmResult {
  /** The person's own invite code. */
  code: string;
  /** False when the address was already confirmed (the link was opened again). */
  fresh: boolean;
}

/** Puts a confirmed address on the waitlist, or returns null if the contact is gone. */
export async function confirmSignup(email: string, lang: Lang, o: ConfirmOptions): Promise<ConfirmResult | null> {
  if (useMock()) return (await loadMock()).mockConfirmSignup(email, o);

  const contact = await getContact(email);
  if (!contact) return null;

  let code = typeof contact.attributes?.REFCODE === 'string' && contact.attributes.REFCODE ? contact.attributes.REFCODE : '';
  if (!code) {
    // Contacts created by the Founding Partner form have no code yet.
    code = o.newCode();
    const res = await brevo(`/contacts/${encodeURIComponent(email)}`, {
      method: 'PUT',
      body: { ext_id: code, attributes: { REFCODE: code } },
    });
    if (!res.ok) return fail(res);
  }

  // Clicking the link twice must not count the invite twice.
  if (contact.listIds?.some((id) => allWaitlistIds().includes(id))) return { code, fresh: false };

  const res = await brevo(`/contacts/lists/${waitlistListId(lang)}/contacts/add`, { method: 'POST', body: { emails: [email] } });
  if (!res.ok) return fail(res);

  const referredBy = contact.attributes?.REFERRED_BY;
  if (o.countReferral && typeof referredBy === 'string' && referredBy && referredBy !== code) {
    const inviter = await getContact(referredBy, 'ext_id');
    const count = Number(inviter?.attributes?.REFERRALS ?? 0);
    if (inviter && inviter.email !== email && count < o.referralCap) {
      const update = await brevo(`/contacts/${encodeURIComponent(inviter.email)}`, {
        method: 'PUT',
        body: { attributes: { REFERRALS: count + 1 } },
      });
      if (!update.ok) return fail(update);
    }
  }
  return { code, fresh: true };
}

export interface CleanupResult {
  /** Contacts looked at. */
  checked: number;
  /** Unconfirmed sign-ups older than the limit. */
  matched: number;
  /** Actually deleted (0 on a dry run). */
  deleted: number;
}

/**
 * Deletes sign-ups that were never confirmed, as the privacy policy promises.
 * Only contacts in no list at all, with a confirmation email (CONFIRM_SENT_AT)
 * older than the limit, are deleted: confirmed people, Founding Partner
 * reservations and contacts added by hand are never touched.
 */
export async function cleanupUnconfirmed(olderThanMs: number, dryRun: boolean): Promise<CleanupResult> {
  if (useMock()) return (await loadMock()).mockCleanupUnconfirmed(olderThanMs, dryRun);

  const cutoff = Date.now() - olderThanMs;
  const stale: string[] = [];
  let checked = 0;
  const pageSize = 500;

  for (let offset = 0; ; offset += pageSize) {
    const res = await brevo(`/contacts?limit=${pageSize}&offset=${offset}`);
    if (!res.ok) return fail(res);
    const page: { contacts?: Contact[] } = await res.json();
    const contacts = page.contacts ?? [];
    checked += contacts.length;
    for (const c of contacts) {
      const sentAt = Date.parse(String(c.attributes?.CONFIRM_SENT_AT ?? ''));
      if ((c.listIds ?? []).length === 0 && Number.isFinite(sentAt) && sentAt < cutoff) stale.push(c.email);
    }
    if (contacts.length < pageSize) break;
  }

  let deleted = 0;
  if (!dryRun) {
    for (const email of stale) {
      const res = await brevo(`/contacts/${encodeURIComponent(email)}`, { method: 'DELETE' });
      if (res.ok || res.status === 404) deleted += 1;
      else console.error('[cleanup] could not delete a contact', res.status);
    }
  }
  return { checked, matched: stale.length, deleted };
}

/** Confirmed invites for an invite code, or null if the code is unknown. */
export async function referralCount(code: string): Promise<number | null> {
  if (useMock()) return (await loadMock()).mockReferralCount(code);
  const contact = await getContact(code, 'ext_id');
  return contact ? Number(contact.attributes?.REFERRALS ?? 0) : null;
}

// --- Founding Partner reservations ------------------------------------------

export interface Reservation {
  email: string;
  name: string;
  workshop: string;
  city: string;
  lang: Lang;
}

export type ReserveResult = 'reserved' | 'already' | 'full';

function fpListId(): number {
  if (!BREVO_FP_LIST_ID) throw new Error('BREVO_FP_LIST_ID must be set');
  return Number(BREVO_FP_LIST_ID);
}

/** Number of reserved Founding Partner spots (contacts in the reservation list). */
export async function countReservations(): Promise<number> {
  if (useMock()) return (await loadMock()).mockCountReservations();

  const res = await brevo(`/contacts/lists/${fpListId()}`);
  if (!res.ok) return fail(res);
  const list: { uniqueSubscribers?: number; totalSubscribers?: number } = await res.json();
  return list.uniqueSubscribers ?? list.totalSubscribers ?? 0;
}

/**
 * Adds the person to the reservation list, or reports that they're already on
 * it or that every spot is taken. Someone already on the waitlist is added to
 * the reservation list too (and their details updated), not turned away.
 *
 * The WORKSHOP, CITY and LANGUAGE contact attributes must exist in Brevo
 * (Contacts → Settings → Contact attributes); FIRSTNAME exists by default.
 */
export async function reserveSpot(r: Reservation, totalSpots: number): Promise<ReserveResult> {
  if (useMock()) return (await loadMock()).mockReserveSpot(r.email, totalSpots);

  const listId = fpListId();

  const existing = await brevo(`/contacts/${encodeURIComponent(r.email)}`);
  if (existing.ok) {
    const contact: { listIds?: number[] } = await existing.json();
    if (contact.listIds?.includes(listId)) return 'already';
  } else if (existing.status !== 404) {
    return fail(existing);
  }

  if ((await countReservations()) >= totalSpots) return 'full';

  const res = await brevo('/contacts', {
    method: 'POST',
    body: {
      email: r.email,
      attributes: { FIRSTNAME: r.name, WORKSHOP: r.workshop, CITY: r.city, LANGUAGE: r.lang },
      listIds: [listId],
      updateEnabled: true,
    },
  });
  if (res.status === 201 || res.status === 204) return 'reserved';
  return fail(res);
}
