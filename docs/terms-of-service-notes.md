# Mobilcab — Terms of Service: notes for legal review

> **Status: draft, not published, not legal advice.** The Terms text itself is in
> `src/content/legal/terms.ro.md` (Romanian, primary) and `terms.en.md`. The
> preview pages `/preview/ro/termeni/` and `/preview/en/terms/` render those files
> directly, so edits to the files show up on the pages. Build Brief 4.7 requires the
> AI-assist liability clause to be drafted with a Romanian lawyer; this draft is a
> starting point for that conversation.

## What the draft is based on

| Section | Source |
|---|---|
| 7. AI assistant: advisory only, user verifies before cutting, no guarantee of manufacturability, explicit acknowledgment | Marketing Plan 4b, points 1 and 3 |
| 8. Liability: "as is", cap at fees paid in the prior 12 months | Marketing Plan 4b, point 2 |
| 4–5. Plans in RON, Stripe, monthly renewal, cancel anytime | Build Brief 4.3, Marketing Plan 3a–3b, 4b |
| 6. Founding Partner: 100 spots, 12-month price lock, free reservation | `docs/DECISIONS.md` |

## Questions for the lawyer

1. **Consumers vs. businesses.** Most users will be workshops (SRL/PFA), but the
   free plan is open to anyone. Do we need a consumer version of some clauses
   (right of withdrawal under GEO 34/2014, jurisdiction, mandatory ANPC / ADR
   information), or can the service be limited to professional users?
2. **The liability cap and the indirect-loss exclusion** (section 8): are they
   enforceable as written under Romanian law, for both B2B and B2C users?
3. **The acknowledgment checkbox** (section 7.5): should it be shown at account
   creation, at the first export, or both? It belongs in the app's sign-up flow,
   not the marketing site's waitlist or reservation forms, which create no
   account.
4. **Founding Partner reservations** are free and non-binding (section 6). Is
   any wording needed so a reservation isn't read as a purchase commitment?
5. **VAT wording** on prices while below the VAT registration threshold
   (Marketing Plan 4b), and e-Factura for invoices.
6. **AI provider and project data** (section 9): which provider, where data is
   processed, how long it's kept, and whether projects may be used for training.
   This also has to appear in the Privacy Policy.
7. **Account sharing**: one person or one workshop per account?
8. **Project export on account closure** (section 12): formats and how long
   data stays available after closing.

## Business decisions still open (`docs/DECISIONS.md`)

- **Open question 3:** yearly plan cancellation — refund or non-renewal (section 5).
- **Open question 4:** what the app does on a dropped connection (section 11).
- **Open question 5:** what happens when the Founding Partner year ends (section 6).
- When the 12-month Founding Partner lock starts — first payment? (section 6).
- Whether the "no training on your projects" commitment stands (section 9).

## Before publishing

- Fill in every **[COMPLETEAZĂ] / [FILL IN]**, resolve every **[VERIFICĂ] / [VERIFY]**
  and **[DE DECIS] / [TO DECIDE]**, and remove the draft notice at the top.
- Publish the final Privacy Policy at the same time; the Terms link to it.
- Add a "Termeni" / "Terms" link to the site footer (`src/components/SiteFooter.astro`).
