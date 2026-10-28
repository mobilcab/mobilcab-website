# Decisions that override the planning documents

The planning documents in this folder were written at different times and
disagree in places. Where they do, these decisions win. Copy taken from the
documents is adjusted to match.

| Topic | Decision | Overrides |
|---|---|---|
| Early-adopter offer name | **Founding Partner** | "Founding Workshop" (Launch Content Kit 1.1, 1.5, 1.6, 4) |
| Number of Founding Partner spots | **100** | "50" / "50–100" (Build Brief 4.2, Funnel Plan 3.2, 3.3) |
| How long the Founding Partner price is locked | **12 months** | "for life" (Funnel Plan 3.3 pricing callout) |
| "Kitchen and bedroom" in headlines and hero copy | **Removed**: say "mobilă" / "furniture" | Launch Content Kit 1.1 hero text |
| Prices | **RON, per the tier table in Build Brief 4.3** | The € table in Launch Content Kit 1.5 |
| Phase 2 rollout | **Each page launches separately** with the switch in `src/site.ts`; unpublished pages live at `/preview/…` (not indexed). The coming-soon page stays at `/ro/` until Home is published | Build Brief 4.1 "replaces the coming-soon page" |
| "Claim your Founding Partner spot" before Stripe exists | **Reservation without payment**: name, email, workshop, city go to a separate Brevo list; the spot counter counts that list; reservations stop at 100; payment happens when access opens | Funnel Plan 4, step 5a "→ payment via Stripe" (until Stripe is set up) |
| FAQ visits before vs. after sign-up (Build Brief 5, `faq_view_pre_signup` / `faq_view_post_signup`) | **Not split for now**: the FAQ sends `faq_open` with the question opened, and nothing is stored on the visitor's device, so the privacy text stays accurate. Splitting would need a "signed up" flag in the browser and a privacy-text update | Build Brief 5 event table |
| Referral rewards (Marketing Plan 3c "invite others, move up the list") | **Access, not money**: 1 confirmed invite = ahead in the private-beta queue; 3 = a guaranteed private-beta invite. No cash, no extra discounts, no buying Founding Partner spots, no public leaderboard. After launch: one free month for both sides (Marketing Plan 5.3), built in the app | Marketing Plan 3c, 5.3, 5.4 |
| How referral progress is shown | **Confirmed-invite count, not a queue position** ("2 confirmed — 1 more for a guaranteed beta invite") | "move up the list" wording |
| What counts as a referral | Only an invited person who **confirms their email (double opt-in)**; each address once; no self-referral; at most 5 counted per person. Double opt-in applies to every waitlist sign-up, which also answers the lawyer's proof-of-consent question | — |
| Legal operator until an SRL exists | **Natural persons (Ștefan and Fineas)** trading as Mobilcab; no CUI, registered office or Trade Register number on the site. Update Terms/Privacy as soon as the SRL is formed | Placeholder company fields in the legal drafts |
| Cancelling a yearly plan | **Stops renewal, no pro-rata refund** of the unused year, except the 14-day consumer withdrawal (GEO 34/2014) and the Refund Policy once billing is live | "cancel anytime" on yearly Founding Partner (Funnel Plan / Build Brief) |

## Open questions

Not decided yet. The Founding Partner page (Build Brief 4.2) and the pricing
page (4.3) need answers to these before their copy is final. When one is
decided, move it into the table above.

1. **AI assistant on the free plan.** One trial during onboarding only (Build
   Brief 4.3 tier table), or 5–10 AI uses per month (Marketing Plan 3b)? The
   Marketing Plan suggests asking 5–10 carpenters before fixing the free-plan
   limits.
2. **Founding Partner pricing on Starter and Pro.** The Funnel Plan (3.2) says
   Founding Partners can also choose Starter or Pro "at Founding Partner
   pricing", but no price is given. Is there a Founding Partner price for those
   tiers, and what is it? Or is Founding Partner Basic-only?
3. **Unreliable workshop internet (FAQ).** What does the app actually do when
   the connection drops: keep working and sync later, keep unsaved changes
   until it reconnects, or need a constant connection? The Build Brief (4.6)
   says to confirm the real behaviour before writing this answer, so it's left
   out of the FAQ until then.
4. **When the Founding Partner year ends (FAQ).** Does the price stay at
   49 RON/month (549 RON/year), or move to the then-current list price (with
   renewal reminders 30 and 7 days before, Marketing Plan 6a)? Left out of the
   FAQ until decided.
