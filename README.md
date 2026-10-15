# Mobilcab website

Phase 1: a bilingual coming-soon page with an email waitlist. The spec is in
[docs/Mobilcab_Website_Build_Brief.md](docs/Mobilcab_Website_Build_Brief.md).

Stack: Astro 7 + Tailwind CSS 4, deployed to Vercel. Every page is static HTML.
The only server code is `/api/subscribe`, which adds the email to a Brevo list.
The only client JS is the small form handler; the language switch is plain links.

| Path | What |
|---|---|
| `/` | Redirects to `/ro/` |
| `/ro/`, `/en/` | Coming-soon page |
| `/ro/roadmap/`, `/en/roadmap/` | Product roadmap (stages for workshops) |
| `/ro/confidentialitate/`, `/en/privacy/` | Temporary privacy note |
| `POST /api/subscribe` | Waitlist sign-up (Brevo) |

Copy lives in `src/i18n/ro.json` and `src/i18n/en.json`.

The social share images (`public/og-ro.png`, `public/og-en.png`) are built from the
headline and value prop. After changing either, run `npm run og` (uses your
installed Edge or Chrome) and commit the new PNGs.

## Setup

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

## Brevo

1. Create a list for the waitlist (Contacts → Lists) and note its numeric ID.
   Optionally create a second list for English sign-ups.
2. Create an API key (SMTP & API → API Keys).
3. Create these contact attributes (Contacts → Settings → Contact attributes):
   `REFCODE` (text), `REFERRED_BY` (text), `REFERRALS` (number),
   `CONFIRM_SENT_AT` (text), `LANGUAGE` (text).
4. Set `BREVO_API_KEY`, `BREVO_LIST_ID` and, optionally, `BREVO_LIST_ID_EN`.
5. Emails: the templates (including the two confirmation emails, whose IDs go
   in `BREVO_CONFIRM_TEMPLATE_ID_RO` / `_EN`) and step-by-step setup are in
   [emails/README.md](emails/README.md).
6. Set `CONFIRM_SECRET` to a long random string.

**Sign-ups use double opt-in.** The form creates the contact in Brevo without a
list and sends a confirmation email. Clicking its link (`/api/confirm`) adds the
person to the waitlist list, which triggers the welcome email, and lands them on
`/ro/confirmat/`. Links are signed with `CONFIRM_SECRET` and expire after 7 days;
the email is resent at most every 10 minutes. Confirmed addresses get the
"already on the list" message. Unconfirmed contacts stay in Brevo with no list,
and are deleted automatically after 30 days, as the privacy policy says (see
"Daily clean-up" below).

**Invite program** (`REFERRAL_PROGRAM` in `src/config.ts`, off until month -4;
it requires the full Privacy Policy to be published). Each person gets an invite
link (`/ro/?ref=<code>`), shown on the confirmed page and in the welcome email.
An invite counts when the invited person confirms; each address once, no
self-invites, at most `REFERRAL_CAP` (5) per person. Rewards are given by hand:
in Brevo, filter on `REFERRALS` (≥ 1 = ahead in the beta queue, ≥ 3 =
guaranteed beta invite). Invite codes are looked up through the contact's
`ext_id` [verify this works in your Brevo account with one test invite].

**Founding Partner reservations (Phase 2 preview):** the form at
`/preview/ro/founding-partner/` adds people to a separate list, with no payment
until Stripe exists. Set it up with:

1. Create a "Founding Partner reservations" list and set `BREVO_FP_LIST_ID`.
2. Create three text contact attributes (Contacts → Settings → Contact
   attributes): `WORKSHOP`, `CITY`, `LANGUAGE`. The name goes into the default
   `FIRSTNAME` attribute. Without these attributes, reservations fail.
3. The "X din 100 locuri rămase" counter is the number of contacts in that list
   (cached for a minute). Reservations stop at `FOUNDING_PARTNER_SPOTS` in
   `src/config.ts`. Removing someone from the list frees their spot.

**Local test mode:** with `npm run dev` and no `BREVO_API_KEY` set, the form talks
to a stand-in instead of Brevo (`src/lib/brevo-mock.ts`), so every state can be
tried without an account:

- a new address shows "check your email"; no email is sent, so a "Test mode:
  open the confirmation link" link appears under the message (the link is also
  printed in the dev server log)
- after confirming, the same address shows "already on the list" (until the dev
  server restarts)
- an address starting with `fail@` shows the server-error message
- on the Founding Partner form, the same rules apply, and an address starting
  with `full@` shows the "all spots taken" message

Test mode never runs in production builds; there, a missing key is an error.

## Demo videos

The three demo videos appear on the Home page and on the Demo page
(`/preview/ro/cum-functioneaza/`). Once a video is on YouTube, add its ID (the
part after `v=` in the URL) to `src/data/demoVideos.ts`. Until then, its slot
shows "Clip în curând".

Each video loads as a thumbnail only; YouTube's player (from the
privacy-enhanced `youtube-nocookie.com`) loads when someone presses play. Both
YouTube hosts are already allowed in the CSP.

## Blog

Posts are Markdown files in `src/content/blog/<lang>/<slug>.md`; the file name
becomes the address (`/ro/blog/<slug>/`). Frontmatter:

```yaml
title: "…"
description: "…"   # shown on the blog index and in search results
date: "2026-10-06" # YYYY-MM-DD
published: false
```

A post is public only when the blog (`blog: true` in `src/site.ts`) **and** the
post (`published: true`) are both published. Until then it's at
`/preview/<lang>/blog/<slug>/`, with a draft badge, so it can be reviewed
without going public. The three drafts start with a note listing what to check
before publishing; delete that note when you publish.

Every post ends with a call-to-action box. Clicks on it send the
`blog_to_signup` Plausible event (with the post's slug), plus `cta_click`.

Button clicks everywhere else (any element with `data-cta`, including the
header menu) are tracked once, site-wide, by `src/components/CtaTracking.astro`.

## Plausible

1. Add the site in Plausible and set `PUBLIC_PLAUSIBLE_DOMAIN` (read at build time).
2. Add a custom-event goal named `Waitlist Signup`. It fires only for new
   sign-ups and carries a `lang` property. Plausible then shows the
   visits → sign-ups conversion rate.

## Deploying to Vercel

1. Import the project in Vercel (framework preset: Astro).
2. Add the environment variables above, plus `SITE_URL` once the domain is final.
3. In Project Settings → Functions, set the region to Frankfurt (`fra1`) so the
   sign-up function runs in the EU.

## SEO (Build Brief 7)

- `/sitemap.xml` and `/robots.txt` are generated (`src/pages/sitemap.xml.ts`,
  `src/pages/robots.txt.ts`). The sitemap lists only public addresses, with
  Romanian/English alternates, plus published blog posts.
- Structured data (`src/lib/structuredData.ts`): Organization and WebSite on
  the home / coming-soon page; SoftwareApplication with the RON price range
  once `productPublic` is true; BlogPosting on published posts. Nothing on
  preview pages.
- After the first deploy: submit `https://<domain>/sitemap.xml` in Google
  Search Console, check the structured data with Google's Rich Results Test,
  and run PageSpeed Insights (the brief's 90+ release gate).

## Security headers

- A Content Security Policy is added to every page by Astro (`security.csp` in
  `astro.config.mjs`). It only allows scripts from this site and Plausible.
  **When you add any outside service** (a video embed, a chat widget, Stripe in
  Phase 2), add its domain there or the browser will block it.
- The CSP only applies to built pages, not `npm run dev`, so check new
  integrations with a production build.
- The other headers (no framing, nosniff, referrer and permissions policy, HSTS)
  are in `src/integrations/security-headers.mjs`.

## Tests

```bash
npm test             # unit tests, a few seconds
npm run test:build   # builds the site, then checks the built output
npm run test:all     # both
```

Run `npm run test:all` before every deploy, and after changing anything in
`src/site.ts`, `src/lib/` or `src/pages/api/`.

**Unit tests** (`tests/unit/`, Vitest):

- `validation`: the email, Founding Partner field and invite-code rules.
- `tokens`: confirmation links work, and forged, altered or expired ones (after
  7 days) are rejected.
- `site`: the launch switch: what's built where, public pages never link to
  unpublished ones, publishing moves a page, and blog drafts stay in preview.
- `brevo`: the real Brevo code against an in-memory Brevo (`fake-brevo.ts`):
  double opt-in, the 10-minute resend limit, invite counting (only after
  confirming, once per address, capped at 5, no self-invites), the daily
  clean-up (deletes only old unconfirmed sign-ups), Founding Partner
  reservations.
- `endpoints`: the sign-up, confirmation and clean-up endpoints as a browser and
  Vercel call them: server-side validation, honeypot, signed links, the cron
  secret.
- `launch-check`: the launch-readiness check, on a temporary copy of the project.

**Built-site tests** (`tests/build/`): no public page links to a preview;
previews are `noindex` with no canonical link; every inline script is in the
page's CSP; no inline `style` attributes; the sitemap lists only public,
indexable, existing pages; security headers come first; every API route and the
daily clean-up are registered; no local-test-mode code ships.

## Launch-readiness check

```bash
npm run check-launch
```

Lists everything that isn't ready for the public site, using the values in
`.env`. The same check runs on every build:

- **Production deploys on Vercel stop** on any problem: a missing Brevo key,
  list, confirmation template, `CONFIRM_SECRET` or `CRON_SECRET`;
  `CONTACT_EMAIL_CONFIRMED` still false in `src/config.ts`; a published Privacy
  Policy or Terms that still has `[COMPLETEAZĂ]`/`[VERIFICĂ]`/`[DE DECIS]`
  markers or its draft notice; a published blog post with its review note or
  `[VERIFICĂ]` markers.
- **Warnings** (shown, but not blocking): no Plausible domain, no `SITE_URL`, no
  English confirmation template, a published Demo page without videos, email
  templates with placeholders.
- Local builds and Vercel preview deploys only print a one-line summary.

## Daily clean-up

`/api/cleanup` deletes sign-ups that were never confirmed, 30 days after the
confirmation email, as the privacy policy promises. It runs every day at 03:00
UTC as a Vercel Cron Job (registered in `src/integrations/vercel-crons.mjs`),
which authenticates with `CRON_SECRET`; other callers are refused.

It only deletes contacts that are in **no list** and have a `CONFIRM_SENT_AT`
older than 30 days: confirmed sign-ups, Founding Partner reservations and
contacts added by hand are never touched. Results are in the Vercel logs.

- To see what it would delete without deleting anything, call
  `/api/cleanup?dryRun=1` with the `Authorization: Bearer <CRON_SECRET>` header.
- In local test mode, `/api/cleanup?days=0` treats every unconfirmed sign-up as
  old (the `days` override only works in dev).
- After the first deploy, check the job appears under the project's Settings →
  Cron Jobs in Vercel.

## Launching pages

Every page is listed in `src/site.ts` with `published: true` or `false`.

- **Unpublished** pages are built at `/preview/…` (e.g. `/preview/ro/preturi/`):
  not indexed, with a "preview" banner, and never linked from public pages.
- **Published** pages are built at their real address (e.g. `/ro/preturi/`),
  indexable, and appear in the header menu and footer of every page.
- While Home and Privacy are unpublished, their real addresses show the
  coming-soon page and the temporary privacy notice.

To launch a page, set it to `true` and deploy. Links, menus, the language
switch, canonical/hreflang tags and "don't index" all follow automatically. The
build stops if the Founding Partner page is published before the full Privacy
Policy, since that form collects more than the temporary notice covers.

`productPublic` in the same file is separate: set it to `true` at launch
(month 0), when the app itself is available. Only then does the Home page
describe Mobilcab to search engines as a software product with prices.

Suggested order (Funnel Plan 6): `home` at month -4; `foundingPartner` and
`demo` at months -3 to -2 (with `privacy` first); `faq` at month -2; `pricing`
and `terms` at month -1.

## Before going live

- Replace `CONTACT_EMAIL` in `src/config.ts` with a real mailbox.
- The privacy page is a placeholder until the full policy is written (Phase 2, Section 4.7).
- Before the Founding Partner page goes public, the privacy text must also cover
  what that form collects: name, workshop name and city, not just the email.
