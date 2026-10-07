// Launch-readiness check: catches anything that would break or embarrass a
// public deploy (missing keys, placeholder text, lawyer-draft legal pages).
//
//   npm run check-launch        run it now, with the values from .env
//
// It also runs on every build (src/integrations/launch-check.mjs): production
// deploys on Vercel stop on any error; other builds only print a summary.
//
// Reads src/config.ts and src/site.ts as text, so it needs no TypeScript tooling.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const MARKERS = /\[(COMPLETEAZĂ|VERIFICĂ|DE DECIS|FILL IN|VERIFY|TO DECIDE)[^\]]*\]/;

/** @returns {{ errors: string[], warnings: string[] }} */
export function runLaunchChecks({ root, env }) {
  const errors = [];
  const warnings = [];
  const read = (rel) => readFileSync(join(root, rel), 'utf8');

  const config = read('src/config.ts');
  const site = read('src/site.ts');
  const published = Object.fromEntries(
    [...(site.match(/export const published[^{]*\{([\s\S]*?)\};/)?.[1] ?? '').matchAll(/^\s*(\w+): (true|false),/gm)].map((m) => [
      m[1],
      m[2] === 'true',
    ]),
  );
  const flag = (src, name) => new RegExp(`export const ${name} = true;`).test(src);
  const referrals = flag(config, 'REFERRAL_PROGRAM');

  // --- Settings the site needs to work --------------------------------------
  const required = {
    BREVO_API_KEY: 'sign-ups go nowhere',
    BREVO_LIST_ID: 'sign-ups go nowhere',
    BREVO_CONFIRM_TEMPLATE_ID_RO: 'no confirmation email is sent, so nobody can confirm',
    CONFIRM_SECRET: 'confirmation links cannot be signed',
    CRON_SECRET: 'the daily clean-up of unconfirmed sign-ups is refused',
  };
  if (published.foundingPartner) required.BREVO_FP_LIST_ID = 'Founding Partner reservations fail';
  for (const [name, effect] of Object.entries(required)) {
    if (!env[name]) errors.push(`${name} is not set: ${effect}.`);
  }
  if (env.CONFIRM_SECRET && env.CONFIRM_SECRET.length < 32) {
    errors.push('CONFIRM_SECRET is shorter than 32 characters; use a long random string.');
  }
  if (!env.SITE_URL) warnings.push('SITE_URL is not set; links and the sitemap use https://mobilcab.ro.');
  if (!env.PUBLIC_PLAUSIBLE_DOMAIN) warnings.push('PUBLIC_PLAUSIBLE_DOMAIN is not set: no visit or sign-up statistics.');
  if (!env.BREVO_CONFIRM_TEMPLATE_ID_EN) warnings.push('BREVO_CONFIRM_TEMPLATE_ID_EN is not set: English sign-ups get the Romanian confirmation email.');

  // --- Placeholders ---------------------------------------------------------
  if (!flag(config, 'CONTACT_EMAIL_CONFIRMED')) {
    errors.push('CONTACT_EMAIL in src/config.ts is not confirmed as a real mailbox (set CONTACT_EMAIL_CONFIRMED = true).');
  }

  // Published legal pages must be the approved text, not the draft.
  for (const page of ['terms', 'privacy']) {
    if (!published[page]) continue;
    for (const lang of ['ro', 'en']) {
      const file = `src/content/legal/${page}.${lang}.md`;
      const text = read(file);
      if (MARKERS.test(text)) errors.push(`${file} is published but still has [COMPLETEAZĂ]/[VERIFICĂ]/[DE DECIS] markers.`);
      if (/Draft (pentru revizuirea juridică|for legal review)/.test(text)) errors.push(`${file} is published but still has the draft notice at the top.`);
    }
  }

  // Published blog posts must have had their review notes removed.
  if (published.blog) {
    const blogDir = join(root, 'src/content/blog');
    for (const lang of existsSync(blogDir) ? readdirSync(blogDir) : []) {
      for (const name of readdirSync(join(blogDir, lang)).filter((f) => f.endsWith('.md'))) {
        const file = `src/content/blog/${lang}/${name}`;
        const text = read(file);
        if (!/^published:\s*true/m.test(text)) continue;
        if (/Ciornă pentru fondator|Draft for the founder/.test(text)) errors.push(`${file} is published but still starts with the founder's review note.`);
        if (MARKERS.test(text)) errors.push(`${file} is published but still has [VERIFICĂ] markers.`);
      }
    }
  }

  if (published.demo && !/youtubeId: \{ ro: '/.test(read('src/data/demoVideos.ts'))) {
    warnings.push('The Demo page is published but has no videos yet (src/data/demoVideos.ts).');
  }

  // The emails aren't deployed with the site, but they're pasted into Brevo from emails/.
  const emailDir = join(root, 'emails');
  const draftEmails = existsSync(emailDir)
    ? readdirSync(emailDir).filter((f) => f.endsWith('.html') && /\[(COMPLETEAZĂ|FILL IN)\]/.test(readFileSync(join(emailDir, f), 'utf8')))
    : [];
  if (draftEmails.length) {
    warnings.push(`Email templates still have placeholders (${draftEmails.join(', ')}): fill in EMAIL_SETTINGS in src/config.ts and run npm run emails.`);
  }
  if (referrals && !/REFCODE/.test(existsSync(join(emailDir, 'waitlist-ro.html')) ? readFileSync(join(emailDir, 'waitlist-ro.html'), 'utf8') : '')) {
    warnings.push('REFERRAL_PROGRAM is on but the welcome email has no invite link: run npm run emails and re-paste it in Brevo.');
  }

  return { errors, warnings };
}

/** Minimal .env reader for running the check by hand. */
function loadDotEnv(root) {
  const file = join(root, '.env');
  if (!existsSync(file)) return {};
  return Object.fromEntries(
    readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/))
      .filter(Boolean)
      .map((m) => [m[1], m[2].replace(/^(['"])(.*)\1$/, '$2')]),
  );
}

// Run directly: `npm run check-launch`.
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const { errors, warnings } = runLaunchChecks({ root, env: { ...loadDotEnv(root), ...process.env } });
  for (const e of errors) console.log(`✗ ${e}`);
  for (const w of warnings) console.log(`! ${w}`);
  console.log(errors.length ? `\n${errors.length} problem(s) would stop a production deploy.` : '\nReady: nothing would stop a production deploy.');
  process.exit(errors.length ? 1 : 0);
}
