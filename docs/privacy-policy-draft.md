# Mobilcab — Privacy Policy: notes for legal review

> **Status: draft, not published, not legal advice.** The policy text itself is in
> `src/content/legal/privacy.ro.md` (Romanian, primary) and `privacy.en.md`. The
> preview pages `/preview/ro/confidentialitate/` and `/preview/en/privacy/` render
> those files directly. The live site keeps its short temporary notice
> (`src/pages/ro/confidentialitate.astro`, `src/pages/en/privacy.astro`) until the
> full policy is approved.
>
> Markers in the text: **[COMPLETEAZĂ] / [FILL IN]** = information only the founder
> has; **[VERIFICĂ] / [VERIFY]** = to check with the lawyer or against a provider's
> current terms; **[DE DECIS] / [TO DECIDE]** = an open decision in `docs/DECISIONS.md`.

## What the website does

| What | Where it goes | Code reference | Live today? |
|---|---|---|---|
| Waitlist: email + consent, confirmed by email (double opt-in) | Brevo contact, added to the waitlist list only after confirming (separate English list optional) | `src/pages/api/subscribe.ts`, `src/pages/api/confirm.ts`, `src/lib/brevo.ts` | Yes |
| Invite program: own invite code, inviter's code, count of confirmed invites | Brevo contact attributes `REFCODE`, `REFERRED_BY`, `REFERRALS` | `src/lib/brevo.ts`, `src/pages/api/referral.ts` | No (switched off, `REFERRAL_PROGRAM`) |
| Founding Partner reservation: name, email, workshop (optional), city, language + consent | A separate Brevo list, as contact attributes | `src/pages/api/founding-partner.ts`, `src/lib/brevo.ts` | No (preview only) |
| Page visits and funnel events (button clicks, sections reached, FAQ questions opened, sign-ups) | Plausible: no cookies, aggregate only | `src/layouts/Base.astro`, page scripts | Yes (when configured) |
| Demo videos | YouTube thumbnail with the page; the `youtube-nocookie.com` player only after pressing play | `src/components/VideoPlayer.astro` | No (preview only, no videos yet) |
| Technical request data (IP, user agent, URL, time) | Vercel hosting logs | — | Yes |

- **No cookies** and nothing in `localStorage` from the site itself. The FAQ
  deliberately doesn't remember whether a visitor signed up (`docs/DECISIONS.md`).
- The visitor's IP address is **not** sent to Brevo: the browser talks to our
  server function, which then calls Brevo.
- Both forms require the consent checkbox, checked in the browser and again on
  the server.

## What the app does (checked in `mobilcab-cad` on 2026-10-27, ClickUp CU-1amhxucmurv)

Section 4 of the policy is now written from the app's code (`mobilcab-cad`,
`develop`), not from plans. Re-check it before publishing. What the code shows:

| What | Where it goes | Code reference (mobilcab-cad) |
|---|---|---|
| Account: email, password (hashed by Supabase Auth), optional full name; session in `localStorage` or `sessionStorage` | Supabase, project `mobilcab-cad-prod` (`eu-west-1`, Ireland) | `src/app/services/auth.service.ts` |
| Projects (cloud) and project draft (`mobilcab_project` in `localStorage`) | Supabase; the browser | `src/app/services/project.service.ts` |
| Presets and settings | Supabase | `user_presets`, `user_settings` |
| Problem report: automatic technical context (app, user, device, project, recent commands and errors) + opt-in 3D capture / whole `.mcab` | Edge Function `report-problem` -> ClickUp task | `src/app/services/problem-report.service.ts`, `supabase/functions/report-problem/` |
| Transactional emails (Founding Partner waitlist, invite codes) | Brevo, from the Edge Function `send-app-notification` | `supabase/functions/send-app-notification/` |
| Self-service export and account deletion | Export built in the browser; deletion by Edge Function `delete-account` (removes the `auth.users` row, the rest cascades) | `src/app/services/account-data.service.ts`, `supabase/functions/delete-account/` |

Facts that differ from the earlier draft:

- **No AI assistant exists in the app.** The policy keeps the "reserved right to
  train on anonymised data" paragraph only as a decision to confirm; the opt-out it
  mentions does not exist yet. Remove it if the decision is not to reserve it.
- **Payments: Paddle**, not Stripe. Not live yet.
- **No third-party analytics in the app** (no gtag, PostHog, Sentry, Plausible). The
  **website** uses Plausible (optional, `PUBLIC_PLAUSIBLE_DOMAIN`) **and**
  `@vercel/analytics` (`Base.astro`); the earlier draft mentioned only Plausible.
- **Account deletion is immediate** in the live database; whether backups keep the
  data for up to 30 days is to be confirmed with Supabase.
- **ClickUp tasks from reports are not deleted** with the account.
- **Not in code yet** (so not described as live): phone number and CUI on the
  Founding Partner request, `consent_at`, and an AI opt-out.

## Questions for the lawyer

1. **Proof of consent: now double opt-in.** Waitlist sign-ups must confirm by
   clicking a signed link in an email before they're added to the list (the
   confirmation time is recorded by Brevo when they're added). Is that, plus the
   consent checkbox wording, sufficient? Unconfirmed contacts sit in Brevo with
   no list and are deleted automatically 30 days after the confirmation email,
   by a daily scheduled job (`src/pages/api/cleanup.ts`).
1a. **The invite program** (when switched on): stores each person's invite code,
   the code of whoever invited them, and a count of confirmed invites. The
   inviter only sees the count. Is consent at sign-up the right basis, or
   legitimate interest?
2. **Retention periods**: waitlist 24 months after the last email (or if the
   product doesn't launch); Founding Partner reservations 6 months after access
   opens if the person doesn't continue; accounts after closure (to fill in);
   invoices per tax law. Are these acceptable?
3. **Legal basis for reservations**: consent plus pre-contractual steps
   (Article 6(1)(a) and (b)). Is (b) appropriate for a free, non-binding reservation?
4. **Brevo email tracking.** Brevo tracks opens and clicks by default. Keep it
   (and disclose it, as the draft does), or turn it off?
5. **YouTube embeds.** Is the click-to-load approach with `youtube-nocookie.com`
   enough without a consent banner, given YouTube may store data after play?
6. **Vercel as a US provider.** Confirm the transfer mechanism (EU–US Data
   Privacy Framework and/or Standard Contractual Clauses) and whether setting
   the function region to Frankfurt (`fra1`) is worth stating.
7. **Law 506/2004** (electronic communications) alongside GDPR for marketing
   emails: confirm the wording.
8. **AI provider**: which one, where it processes data, how long it keeps it,
   and the "no training on your projects" commitment (also in the Terms). No AI
   feature exists in the app today; is the reserved-right clause worth keeping?
9. **Problem reports.** Legitimate interest for the automatic context (email,
   device, project name, recent commands), consent for the opt-in capture and project
   file. ClickUp stores them (region and DPA to confirm). Retention period, and
   whether deleting an account should also delete its ClickUp tasks.
10. **Supabase and ClickUp** as subprocessors: DPA and transfer basis (Supabase
   region is Ireland; both vendors are US companies).
11. **Cookie banner:** the app and site use no tracking cookies and no third-party
   analytics in the app, so no banner. The website's two analytics tools are
   cookieless; confirm this holds without consent.

## Before publishing

- Fill in every **[COMPLETEAZĂ] / [FILL IN]**, resolve every **[VERIFICĂ] / [VERIFY]**
  and **[DE DECIS] / [TO DECIDE]**, and remove the draft notice at the top.
- Update `CONTACT_EMAIL` in `src/config.ts` to the same address used in the policy.
- Replace the temporary notice pages with the approved text (or move the preview
  pages to `/ro/confidentialitate/` and `/en/privacy/`).
- Publish the Terms of Service at the same time; they link to each other.
