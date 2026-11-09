# Brevo email templates

| File | Sent when | Subject |
|---|---|---|
| `confirm-ro.html` / `confirm-en.html` | Right after a waitlist sign-up, by the site (double opt-in) | Confirmă-ți înscrierea la Mobilcab / Confirm your Mobilcab sign-up |
| `waitlist-ro.html` / `waitlist-en.html` | Someone confirms their sign-up (added to the waitlist list) | Ești pe listă! Iată ce urmează 🛠️ / You're on the list! Here's what happens next 🛠️ |
| `founding-partner-ro.html` / `founding-partner-en.html` | Someone joins the Founding Partner waitlist | Ești pe lista Founding Partner 🛠️ / You're on the Founding Partner waitlist 🛠️ |

The HTML files are **generated**: edit the copy in `scripts/build-emails.mjs`,
fill in `EMAIL_SETTINGS` in `src/config.ts`, then run:

```bash
npm run emails
```

## Before importing

Fill in `EMAIL_SETTINGS` in `src/config.ts` and rebuild. Until then the emails
contain visible **[COMPLETEAZĂ] / [FILL IN]** markers:

- `founderName`: your name, for the signature.
- `companyLine`: company name and address. Marketing emails must identify the
  sender (see `docs/privacy-policy-draft.md`).
- `demoUrl` (optional): once the demo videos exist, a link to them adds a "see
  how it works" line to the waitlist email.

## Setting them up in Brevo

1. **Templates:** Campaigns → Templates → New template → "Paste your code".
   Paste one file, and set the subject (it's also in a comment at the top of
   each file). Repeat for all six.
1a. **Confirmation emails** (`confirm-ro`, `confirm-en`) are sent by the site
   through Brevo's transactional API, not by an automation. Make them
   transactional templates, activate them, and put their numeric IDs in
   `BREVO_CONFIRM_TEMPLATE_ID_RO` / `_EN`. The confirmation link is
   `{{ params.CONFIRM_URL }}`. They have no unsubscribe link, since they're not
   marketing emails.
2. **Waitlist automation:** Automations → "Contact added to a list" → choose the
   waitlist list → send `waitlist-ro`. If you use a separate English list
   (`BREVO_LIST_ID_EN`), make a second automation for it with `waitlist-en`.
3. **Founding Partner automation:** "Contact added to a list" → the FP waitlist
   (`BREVO_FP_LIST_ID`) → a condition on the `LANGUAGE` attribute: `en`
   gets `founding-partner-en`, everything else `founding-partner-ro`.
4. Send yourself a test of each before switching the automations on.

[VERIFY in Brevo] The templates use Brevo's template syntax:
`{{ contact.FIRSTNAME }}` for the name (Founding Partner emails only; the
waitlist doesn't collect names) and `{{ unsubscribe }}` for the unsubscribe
link. Check both render in Brevo's preview; if Brevo's syntax differs, change
them in `scripts/build-emails.mjs`.

**Invite block:** while `REFERRAL_PROGRAM` is on in `src/config.ts`, `npm run
emails` adds the person's invite link and a "see your invites" button to the
welcome email, using `{{ contact.REFCODE }}`. Rebuild and re-paste the waitlist
templates when you switch the program on.

## What changed from Launch Content Kit Section 4

The waitlist email follows the Kit's text, with these changes:

- **"Founding Workshop" → "Founding Partner"**, per `docs/DECISIONS.md`.
- **The general waitlist isn't Founding Partner.** News only — no FP discount.
  The email points people to the separate FP waitlist for a discount on the
  Basic plan when the paid Basic plan opens (no fixed N / 12-month
  lock in copy). Later / non-FP subscribers pay list price.
- **App free until the paid Basic plan.** Copy no longer frames the
  waitlist as “first access”; it frames news + the path to paid plans.
- **The demo video link** only appears once `demoUrl` is set.
- **Added a footer**: why they're receiving the email, the sender's company
  line, and an unsubscribe link.

The Founding Partner email covers the FP waitlist (the Kit predates the form).
It restates: free waitlist now; discount on the paid Basic plan when
subscriptions open (amounts TBD); later subscribers pay list; nothing owed
until then; founder-led onboarding of the first project per Marketing Plan 5.4.
Remove that line if you won't offer it.
