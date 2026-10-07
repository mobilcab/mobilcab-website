// Signed, expiring tokens for the email-confirmation link, so double opt-in
// needs no database: the link itself proves which address it was sent to.
// Signed with CONFIRM_SECRET (HMAC-SHA256, Web Crypto).

import { CONFIRM_SECRET } from 'astro:env/server';
import type { Lang } from '../i18n';

const VALID_FOR_MS = 7 * 24 * 60 * 60 * 1000;
const encoder = new TextEncoder();

function secret(): string {
  if (CONFIRM_SECRET) return CONFIRM_SECRET;
  // Local development only; production builds strip this branch.
  if (import.meta.env.DEV) return 'dev-only-secret';
  throw new Error('CONFIRM_SECRET must be set');
}

const toBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromBase64Url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toBase64Url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(payload))));
}

export async function createConfirmToken(email: string, lang: Lang): Promise<string> {
  const payload = toBase64Url(encoder.encode(JSON.stringify({ e: email, l: lang, x: Date.now() + VALID_FOR_MS })));
  return `${payload}.${await sign(payload)}`;
}

/** The address and language the token was issued for, or null if it's forged or expired. */
export async function readConfirmToken(token: string): Promise<{ email: string; lang: Lang } | null> {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  // Constant-time comparison of the signatures.
  const expected = await sign(payload);
  if (expected.length !== signature.length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  if (diff !== 0) return null;

  try {
    const data: { e?: unknown; l?: unknown; x?: unknown } = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    if (typeof data.e !== 'string' || typeof data.x !== 'number' || data.x < Date.now()) return null;
    return { email: data.e, lang: data.l === 'en' ? 'en' : 'ro' };
  } catch {
    return null;
  }
}
