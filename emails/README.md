# Brevo email templates

| File | Sent when | Subject |
|---|---|---|
| `confirm-ro.html` / `confirm-en.html` | Right after a waitlist sign-up, by the site (double opt-in) | Confirmă-ți înscrierea la Mobilcab / Confirm your Mobilcab sign-up |
| `waitlist-ro.html` / `waitlist-en.html` | Someone confirms their sign-up (added to the waitlist list) | Ești pe listă! Iată ce urmează 🛠️ / You're on the list! Here's what happens next 🛠️ |
| `founding-partner-ro.html` / `founding-partner-en.html` | Someone reserves a Founding Partner spot | Locul tău de Founding Partner e rezervat 🛠️ / Your Founding Partner spot is reserved 🛠️ |

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
3. **Founding Partner automation:** "Contact added to a list" → the reservation
   list (`BREVO_FP_LIST_ID`) → a condition on the `LANGUAGE` attribute: `en`
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
- **The waitlist isn't a Founding Partner spot.** The Kit says signing up among
  the first 100 gets the special price; now that needs a separate reservation.
  The email says the first 100 workshops will get Founding Partner pricing and
  that the subscriber hears first when spots open.
- **"Îți trimit acces beta în următoarele [X] zile"** became "Te anunț personal
  când deschidem accesul…", since no date is set and a placeholder must never
  be sent.
- **The demo video link** only appears once `demoUrl` is set.
- **Added a footer**: why they're receiving the email, the sender's company
  line, and an unsubscribe link.

The Founding Partner email is new (the Kit predates the reservation form). It
restates the offer as decided (Basic, 49 RON/month or 549 RON/year, locked 12
months, nothing to pay until access), and offers founder-led onboarding of the
first project, per Marketing Plan 5.4. Remove that line if you won't offer it.
