// The real Brevo code (src/lib/brevo.ts) against an in-memory Brevo: double
// opt-in, the resend limit, the invite-counting rules, the daily clean-up and
// Founding Partner reservations.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeBrevo } from './fake-brevo';

const WAITLIST = 11;
const WAITLIST_EN = 12;
const FP_LIST = 13;

vi.mock('astro:env/server', () => ({
  BREVO_API_KEY: 'test-key', // a key is set, so the local test mode stays off
  BREVO_LIST_ID: '11',
  BREVO_LIST_ID_EN: '12',
  BREVO_FP_LIST_ID: '13',
  BREVO_CONFIRM_TEMPLATE_ID_RO: '101',
  BREVO_CONFIRM_TEMPLATE_ID_EN: '102',
}));

const { cleanupUnconfirmed, confirmSignup, countReservations, referralCount, requestSignup, reserveSpot } = await import(
  '../../src/lib/brevo'
);
const { newReferralCode } = await import('../../src/lib/referral');

let brevo: FakeBrevo;
const DAY = 24 * 60 * 60 * 1000;

beforeEach(() => {
  brevo = new FakeBrevo();
  vi.stubGlobal('fetch', brevo.fetch);
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-07T09:00:00Z'));
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

const signup = (email: string, opts: { lang?: 'ro' | 'en'; referredBy?: string } = {}) =>
  requestSignup({
    email,
    lang: opts.lang ?? 'ro',
    referredBy: opts.referredBy,
    confirmUrl: (token) => `https://mobilcab.com/api/confirm?t=${token}`,
    makeToken: async () => `token-for-${email}`,
    newCode: newReferralCode,
  });

const confirm = (email: string, opts: { lang?: 'ro' | 'en'; countReferral?: boolean } = {}) =>
  confirmSignup(email, opts.lang ?? 'ro', { countReferral: opts.countReferral ?? true, referralCap: 5, newCode: newReferralCode });

/** Signs up and confirms, returning the person's invite code. */
const join = async (email: string, referredBy?: string) => {
  await signup(email, { referredBy });
  return (await confirm(email))!.code;
};

describe('double opt-in', () => {
  it('creates the contact in no list and sends one confirmation email', async () => {
    expect(await signup('ion@atelier.ro')).toBe('pending');
    const contact = brevo.get('ion@atelier.ro')!;
    expect(contact.listIds.size).toBe(0);
    expect(contact.ext_id).toBe(contact.attributes.REFCODE);
    expect(contact.attributes).toMatchObject({ REFERRALS: 0, REFERRED_BY: '', LANGUAGE: 'ro' });
    expect(brevo.sent).toEqual([
      { to: 'ion@atelier.ro', templateId: 101, params: { CONFIRM_URL: 'https://mobilcab.com/api/confirm?t=token-for-ion@atelier.ro' } },
    ]);
  });

  it('uses the English template and list for English sign-ups', async () => {
    await signup('jane@shop.uk', { lang: 'en' });
    expect(brevo.sent[0]!.templateId).toBe(102);
    await confirm('jane@shop.uk', { lang: 'en' });
    expect([...brevo.get('jane@shop.uk')!.listIds]).toEqual([WAITLIST_EN]);
  });

  it('adds the contact to the waitlist only when the link is opened', async () => {
    await signup('ion@atelier.ro');
    const result = await confirm('ion@atelier.ro');
    expect(result).toEqual({ code: brevo.get('ion@atelier.ro')!.attributes.REFCODE, fresh: true });
    expect([...brevo.get('ion@atelier.ro')!.listIds]).toEqual([WAITLIST]);
  });

  it('reports a second click on the link as not fresh', async () => {
    await signup('ion@atelier.ro');
    await confirm('ion@atelier.ro');
    expect((await confirm('ion@atelier.ro'))!.fresh).toBe(false);
  });

  it('says "already" to a confirmed address, without sending anything', async () => {
    await join('ion@atelier.ro');
    brevo.sent = [];
    expect(await signup('ion@atelier.ro')).toBe('already');
    expect(brevo.sent).toEqual([]);
  });

  it('returns null when the contact no longer exists (e.g. cleaned up)', async () => {
    expect(await confirm('gone@atelier.ro')).toBeNull();
  });

  it('gives a Founding Partner contact an invite code when they confirm the waitlist', async () => {
    brevo.seed('fp@atelier.ro', { lists: [FP_LIST], attributes: { FIRSTNAME: 'Ion' } });
    expect(await signup('fp@atelier.ro')).toBe('pending');
    const result = await confirm('fp@atelier.ro');
    const contact = brevo.get('fp@atelier.ro')!;
    expect(result!.code).toBe(contact.attributes.REFCODE);
    expect(contact.ext_id).toBe(result!.code);
    expect([...contact.listIds].sort()).toEqual([WAITLIST, FP_LIST]);
    expect(contact.attributes.FIRSTNAME).toBe('Ion');
  });
});

describe('resend limit', () => {
  it('sends at most one confirmation email per address every 10 minutes', async () => {
    await signup('ion@atelier.ro');
    vi.setSystemTime(new Date('2026-10-07T09:09:00Z'));
    expect(await signup('ion@atelier.ro')).toBe('pending');
    expect(brevo.sent).toHaveLength(1);

    vi.setSystemTime(new Date('2026-10-07T09:11:00Z'));
    expect(await signup('ion@atelier.ro')).toBe('pending');
    expect(brevo.sent).toHaveLength(2);
  });

  it('keeps the original invite code and inviter when resending', async () => {
    const alice = await join('alice@atelier.ro');
    await signup('bob@atelier.ro', { referredBy: alice });
    const code = brevo.get('bob@atelier.ro')!.attributes.REFCODE;
    vi.setSystemTime(new Date('2026-10-07T10:00:00Z'));
    await signup('bob@atelier.ro', { referredBy: 'SomeOne23' });
    expect(brevo.get('bob@atelier.ro')!.attributes).toMatchObject({ REFCODE: code, REFERRED_BY: alice });
  });
});

describe('invite counting', () => {
  it('counts an invite only once the invited person confirms', async () => {
    const alice = await join('alice@atelier.ro');
    await signup('bob@atelier.ro', { referredBy: alice });
    expect(await referralCount(alice)).toBe(0);
    await confirm('bob@atelier.ro');
    expect(await referralCount(alice)).toBe(1);
  });

  it('counts each address once, however often the link is opened', async () => {
    const alice = await join('alice@atelier.ro');
    await signup('bob@atelier.ro', { referredBy: alice });
    await confirm('bob@atelier.ro');
    await confirm('bob@atelier.ro');
    expect(await referralCount(alice)).toBe(1);
  });

  it('stops counting at the cap', async () => {
    const alice = await join('alice@atelier.ro');
    for (let i = 1; i <= 7; i++) await join(`friend${i}@atelier.ro`, alice);
    expect(await referralCount(alice)).toBe(5);
  });

  it('never counts a self-invite', async () => {
    await signup('alice@atelier.ro');
    const code = String(brevo.get('alice@atelier.ro')!.attributes.REFCODE);
    brevo.get('alice@atelier.ro')!.attributes.REFERRED_BY = code;
    await confirm('alice@atelier.ro');
    expect(await referralCount(code)).toBe(0);
  });

  it('ignores invites while the program is off', async () => {
    const alice = await join('alice@atelier.ro');
    await signup('bob@atelier.ro', { referredBy: alice });
    await confirm('bob@atelier.ro', { countReferral: false });
    expect(await referralCount(alice)).toBe(0);
  });

  it('ignores unknown invite codes without failing the confirmation', async () => {
    await signup('bob@atelier.ro', { referredBy: 'Nobody234' });
    expect((await confirm('bob@atelier.ro'))!.fresh).toBe(true);
  });

  it('reports unknown codes as null', async () => {
    expect(await referralCount('Nobody234')).toBeNull();
  });
});

describe('daily clean-up', () => {
  beforeEach(() => {
    const sent = (daysAgo: number) => new Date(Date.now() - daysAgo * DAY).toISOString();
    brevo.seed('old-unconfirmed@x.ro', { attributes: { CONFIRM_SENT_AT: sent(35) } });
    brevo.seed('young-unconfirmed@x.ro', { attributes: { CONFIRM_SENT_AT: sent(5) } });
    brevo.seed('old-confirmed@x.ro', { lists: [WAITLIST], attributes: { CONFIRM_SENT_AT: sent(200) } });
    brevo.seed('old-reservation@x.ro', { lists: [FP_LIST], attributes: { CONFIRM_SENT_AT: sent(90) } });
    brevo.seed('added-by-hand@x.ro');
  });

  it('deletes only unconfirmed sign-ups older than the limit', async () => {
    const result = await cleanupUnconfirmed(30 * DAY, false);
    expect(brevo.deleted).toEqual(['old-unconfirmed@x.ro']);
    expect(result).toEqual({ checked: 5, matched: 1, deleted: 1 });
    for (const kept of ['young-unconfirmed@x.ro', 'old-confirmed@x.ro', 'old-reservation@x.ro', 'added-by-hand@x.ro']) {
      expect(brevo.get(kept), kept).toBeDefined();
    }
  });

  it('deletes nothing on a dry run', async () => {
    expect(await cleanupUnconfirmed(30 * DAY, true)).toEqual({ checked: 5, matched: 1, deleted: 0 });
    expect(brevo.deleted).toEqual([]);
  });

  it('pages through more contacts than fit in one request', async () => {
    for (let i = 0; i < 1200; i++) brevo.seed(`bulk${i}@x.ro`, { attributes: { CONFIRM_SENT_AT: new Date(Date.now() - 40 * DAY).toISOString() } });
    const result = await cleanupUnconfirmed(30 * DAY, true);
    expect(result.checked).toBe(1205);
    expect(result.matched).toBe(1201);
  });
});

describe('Founding Partner reservations', () => {
  const reservation = (email: string) => ({ email, name: 'Ion Pop', workshop: '', city: 'Cluj', lang: 'ro' as const });

  it('reserves, recognises a repeat, and stops at the cap', async () => {
    expect(await reserveSpot(reservation('a@x.ro'), 2)).toBe('reserved');
    expect(await reserveSpot(reservation('a@x.ro'), 2)).toBe('already');
    expect(await reserveSpot(reservation('b@x.ro'), 2)).toBe('reserved');
    expect(await reserveSpot(reservation('c@x.ro'), 2)).toBe('full');
    expect(await countReservations()).toBe(2);
  });

  it('stores the details and keeps an existing waitlist membership', async () => {
    await join('a@x.ro');
    await reserveSpot({ email: 'a@x.ro', name: 'Ion Pop', workshop: 'Atelier Pop', city: 'Cluj', lang: 'en' }, 100);
    const contact = brevo.get('a@x.ro')!;
    expect([...contact.listIds].sort()).toEqual([WAITLIST, FP_LIST]);
    expect(contact.attributes).toMatchObject({ FIRSTNAME: 'Ion Pop', WORKSHOP: 'Atelier Pop', CITY: 'Cluj', LANGUAGE: 'en' });
  });
});
