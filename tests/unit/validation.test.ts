// The field rules shared by the forms (in the browser) and the endpoints (on the server).
import { describe, expect, it } from 'vitest';
import { EMAIL_MAX_LENGTH, isValidEmail, normalizeEmail } from '../../src/lib/email';
import { isReferralCode, newReferralCode } from '../../src/lib/referral';
import { cleanText, isValidField } from '../../src/lib/reservation';

describe('email', () => {
  it('accepts ordinary addresses', () => {
    for (const email of ['ion@atelier.ro', 'ion.pop+mobila@gmail.com', 'a@b.co']) expect(isValidEmail(email)).toBe(true);
  });

  it('rejects malformed addresses', () => {
    for (const email of ['', 'ion', 'ion@', '@atelier.ro', 'ion@atelier', 'ion pop@atelier.ro', 'ion@atelier..ro', 'ion@@atelier.ro']) {
      expect(isValidEmail(email), email).toBe(false);
    }
  });

  it('rejects addresses longer than the limit', () => {
    expect(isValidEmail(`${'a'.repeat(EMAIL_MAX_LENGTH)}@x.ro`)).toBe(false);
  });

  it('normalises case and surrounding spaces, so duplicates are recognised', () => {
    expect(normalizeEmail('  Ion.Pop@Atelier.RO ')).toBe('ion.pop@atelier.ro');
  });
});

describe('Founding Partner form fields', () => {
  it('collapses whitespace and ignores non-text input', () => {
    expect(cleanText('  Ion   Pop \n')).toBe('Ion Pop');
    expect(cleanText(42)).toBe('');
    expect(cleanText(undefined)).toBe('');
  });

  it('requires a name and a city, but not a workshop name', () => {
    expect(isValidField('name', 'I')).toBe(false);
    expect(isValidField('name', 'Ion')).toBe(true);
    expect(isValidField('city', '')).toBe(false);
    expect(isValidField('city', 'Cluj')).toBe(true);
    expect(isValidField('workshop', '')).toBe(true);
  });

  it('rejects overlong values', () => {
    expect(isValidField('name', 'x'.repeat(101))).toBe(false);
    expect(isValidField('workshop', 'x'.repeat(121))).toBe(false);
    expect(isValidField('city', 'x'.repeat(81))).toBe(false);
  });
});

describe('invite codes', () => {
  it('generates codes that pass validation', () => {
    for (let i = 0; i < 200; i++) expect(isReferralCode(newReferralCode())).toBe(true);
  });

  it("doesn't repeat codes in practice", () => {
    const codes = new Set(Array.from({ length: 2000 }, newReferralCode));
    expect(codes.size).toBe(2000);
  });

  it('rejects anything that is not a code', () => {
    for (const value of ['', 'short', 'k7Q2xMa9X', 'k7Q2xMa!', 'k7Q2 xMa', 'k7Q2xMa0', null, 12345678, undefined]) {
      expect(isReferralCode(value), String(value)).toBe(false);
    }
  });
});
