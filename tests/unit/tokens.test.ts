// Confirmation links are the only proof of which address confirmed, so a forged,
// altered or expired link must never be accepted.
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('astro:env/server', () => ({ CONFIRM_SECRET: 'test-secret-that-is-long-enough-1234567890' }));

const { createConfirmToken, readConfirmToken } = await import('../../src/lib/tokens');

const encode = (data: unknown) =>
  btoa(JSON.stringify(data)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

afterEach(() => vi.useRealTimers());

describe('confirmation tokens', () => {
  it('round-trips the address and language', async () => {
    const token = await createConfirmToken('ion@atelier.ro', 'en');
    expect(await readConfirmToken(token)).toEqual({ email: 'ion@atelier.ro', lang: 'en' });
  });

  it('rejects a token whose address was swapped, even with a real signature', async () => {
    const [, signature] = (await createConfirmToken('ion@atelier.ro', 'ro')).split('.');
    const forged = `${encode({ e: 'someone@else.ro', l: 'ro', x: Date.now() + 1e9 })}.${signature}`;
    expect(await readConfirmToken(forged)).toBeNull();
  });

  it('rejects an altered signature', async () => {
    const token = await createConfirmToken('ion@atelier.ro', 'ro');
    const last = token.at(-1) === 'A' ? 'B' : 'A';
    expect(await readConfirmToken(`${token.slice(0, -1)}${last}`)).toBeNull();
  });

  it('rejects tokens after 7 days', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-01T12:00:00Z'));
    const token = await createConfirmToken('ion@atelier.ro', 'ro');

    vi.setSystemTime(new Date('2026-10-08T11:59:00Z'));
    expect(await readConfirmToken(token)).not.toBeNull();

    vi.setSystemTime(new Date('2026-10-08T12:01:00Z'));
    expect(await readConfirmToken(token)).toBeNull();
  });

  it('rejects garbage', async () => {
    for (const token of ['', '.', 'abc', 'abc.def', 'a.b.c', `${encode({ nope: 1 })}.x`]) {
      expect(await readConfirmToken(token), token).toBeNull();
    }
  });
});
