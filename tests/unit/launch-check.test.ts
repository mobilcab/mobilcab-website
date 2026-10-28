// The launch-readiness check (scripts/launch-check.mjs), run against a copy of
// the project in a temporary folder so each test can break one thing.
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error -- plain JavaScript module without type declarations
import { runLaunchChecks } from '../../scripts/launch-check.mjs';

const project = join(import.meta.dirname, '../..');
let root: string;

const ready = {
  BREVO_API_KEY: 'k',
  BREVO_LIST_ID: '1',
  BREVO_CONFIRM_TEMPLATE_ID_RO: '2',
  BREVO_CONFIRM_TEMPLATE_ID_EN: '3',
  CONFIRM_SECRET: 'x'.repeat(40),
  CRON_SECRET: 'y'.repeat(40),
  SITE_URL: 'https://mobilcab.com',
  PUBLIC_PLAUSIBLE_DOMAIN: 'mobilcab.com',
};

const edit = (rel: string, change: (text: string) => string) => {
  const file = join(root, rel);
  writeFileSync(file, change(readFileSync(file, 'utf8')));
};
const publish = (page: string) => edit('src/site.ts', (s) => s.replace(new RegExp(`^(\\s+${page}): false,`, 'm'), '$1: true,'));
const check = (env: Record<string, string> = ready) => runLaunchChecks({ root, env }) as { errors: string[]; warnings: string[] };

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'mobilcab-launch-'));
  for (const dir of ['src/config.ts', 'src/site.ts', 'src/content', 'src/data', 'emails']) {
    cpSync(join(project, dir), join(root, dir), { recursive: true });
  }
  edit('src/config.ts', (s) => s.replace('CONTACT_EMAIL_CONFIRMED = false', 'CONTACT_EMAIL_CONFIRMED = true'));
  // Email templates as if EMAIL_SETTINGS were filled in.
  for (const name of ['waitlist-ro', 'waitlist-en', 'confirm-ro', 'confirm-en', 'founding-partner-ro', 'founding-partner-en']) {
    edit(`emails/${name}.html`, (s) => s.replaceAll('[COMPLETEAZĂ]', 'Ion Pop').replaceAll('[FILL IN]', 'Ion Pop'));
  }
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe('launch check', () => {
  it('passes when everything is in place', () => {
    expect(check()).toEqual({ errors: [], warnings: [] });
  });

  it('reports every missing setting', () => {
    const { errors } = check({});
    for (const name of ['BREVO_API_KEY', 'BREVO_LIST_ID', 'BREVO_CONFIRM_TEMPLATE_ID_RO', 'CONFIRM_SECRET', 'CRON_SECRET']) {
      expect(errors.some((e) => e.startsWith(name)), name).toBe(true);
    }
  });

  it('rejects a short CONFIRM_SECRET', () => {
    expect(check({ ...ready, CONFIRM_SECRET: 'short' }).errors).toEqual([expect.stringContaining('shorter than 32')]);
  });

  it('blocks an unconfirmed contact email', () => {
    edit('src/config.ts', (s) => s.replace('CONTACT_EMAIL_CONFIRMED = true', 'CONTACT_EMAIL_CONFIRMED = false'));
    expect(check().errors).toEqual([expect.stringContaining('CONTACT_EMAIL')]);
  });

  it('blocks published legal pages that still have draft markers', () => {
    expect(check().errors).toEqual([]);

    edit('src/content/legal/privacy.ro.md', (s) => `${s}\n[COMPLETEAZĂ]\n`);
    expect(check().errors).toEqual([expect.stringContaining('privacy.ro.md')]);

    publish('refund');
    expect(check().errors.some((e) => e.includes('privacy.ro.md'))).toBe(true);
    expect(check().errors.some((e) => e.includes('refund.'))).toBe(false);
  });

  it('requires the Founding Partner list once that page is published', () => {
    publish('foundingPartner');
    expect(check().errors).toEqual([expect.stringContaining('BREVO_FP_LIST_ID')]);
    expect(check({ ...ready, BREVO_FP_LIST_ID: '9' }).errors).toEqual([]);
  });

  it('blocks a published blog post that still has its review note, but not a draft', () => {
    publish('blog');
    expect(check().errors).toEqual([]);

    edit('src/content/blog/ro/cutlist-cnc-fara-calcule-manuale.md', (s) => s.replace('published: false', 'published: true'));
    expect(check().errors.map((e) => e.split(' ')[0])).toEqual([
      'src/content/blog/ro/cutlist-cnc-fara-calcule-manuale.md',
      'src/content/blog/ro/cutlist-cnc-fara-calcule-manuale.md',
    ]);
  });

  it('only warns about a Demo page without videos and placeholder emails', () => {
    publish('demo');
    edit('emails/waitlist-ro.html', (s) => s.replace('Stefan si Fineas', '[COMPLETEAZĂ]'));
    const { errors, warnings } = check();
    expect(errors).toEqual([]);
    expect(warnings).toEqual([expect.stringContaining('no videos'), expect.stringContaining('waitlist-ro.html')]);
  });
});
