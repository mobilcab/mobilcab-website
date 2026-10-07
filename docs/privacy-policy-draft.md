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

## What the app does (not in this codebase)

Section 4 of the policy (account, projects, Stripe payments, AI assistant) is
written from the plans in the Marketing Plan and the Terms of Service, not from
code. Every point there needs confirming against the real app before launch.

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
   and the "no training on your projects" commitment (also in the Terms).

## Before publishing

- Fill in every **[COMPLETEAZĂ] / [FILL IN]**, resolve every **[VERIFICĂ] / [VERIFY]**
  and **[DE DECIS] / [TO DECIDE]**, and remove the draft notice at the top.
- Update `CONTACT_EMAIL` in `src/config.ts` to the same address used in the policy.
- Replace the temporary notice pages with the approved text (or move the preview
  pages to `/ro/confidentialitate/` and `/en/privacy/`).
- Publish the Terms of Service at the same time; they link to each other.
