# Decisions that override the planning documents

The planning documents in this folder were written at different times and
disagree in places. Where they do, these decisions win. Copy taken from the
documents is adjusted to match.

| Topic | Decision | Overrides |
|---|---|---|
| Early-adopter offer name | **Founding Partner** | "Founding Workshop" (Launch Content Kit 1.1, 1.5, 1.6, 4) |
| Free access before paid plans | **App is free for everyone** until paid Basic opens (with M2). Free use does **not** by itself grant the FP discount | Marketing Plan private-beta-only access; waitlist-as-gate to the product |
| Who is a Founding Partner | Anyone who **opts in on the FP waitlist** (name, email, workshop, city → Brevo FP list). Not automatic for every free user | Funnel Plan “claim spot = pay”; “beta tester” framing |
| When the FP discount applies | When we **open paid Basic with M2** (design + cut list + nesting + labels + quote). People on the FP waitlist may buy Basic at **discount vs list**. Anyone who wants paid Basic **after** that window / without an FP waitlist place pays **full list price** | Vague “when we open payment”; access-before-everyone framing |
| Founding Partner before SRL | **Free waitlist only**: no payment at sign-up; no public spot counter with a fixed N. Payment only after SRL + checkout exist and M2 paid Basic is open | Funnel Plan payment-at-claim; Build Brief locked price on the page |
| Number of Founding Partner spots | **First 15**, with public announcement if extended. Soft technical cap in code (`FOUNDING_PARTNER_SPOTS`) may be higher; do not invent a fixed N in marketing beyond what Terms say | "50" / "50–100" / "100" (Build Brief 4.2, Funnel Plan 3.2, 3.3) |
| How long the Founding Partner price is locked | **20% off list for 12 months from paid activation**, then list price. Exact list RON amounts TBD until paid Basic opens | "for life"; fixed 49/549 RON without % |
| What Basic includes at paid launch | **M1 + M2**: 3D design, cut list / workshop docs, sheet nesting, labels, client quote. **Not CNC** (M3+) and not recurring AI | Build Brief 4.3 Basic row that bundled CNC export |
| Founding Partner paid offer | Same **Basic (M1+M2)** at **20% off list**, after SRL + checkout, for FP-waitlist people only. Later / non-FP buyers = list price | Fixed 49 RON/month / 549 RON/year on marketing pages |
| When to form an SRL | **After clear purchase interest** (see Interest gate below). No SRL, no Stripe/MoR, no paid checkout until then | Assumed day-one company in Marketing Plan / Funnel Plan |
| Legal operator until an SRL exists | **Natural persons (Ștefan and Fineas)** trading as Mobilcab; no CUI, registered office or Trade Register number on the site. Update Terms/Privacy as soon as the SRL is formed | Placeholder company fields in the legal drafts |
| Cancelling a yearly plan | **Stops renewal, no pro-rata refund** of the unused year, except the 14-day consumer withdrawal (GEO 34/2014) and the Refund Policy once billing is live | "cancel anytime" on yearly Founding Partner (Funnel Plan / Build Brief) |
| "Kitchen and bedroom" in headlines and hero copy | **Removed**: say "mobilă" / "furniture" | Launch Content Kit 1.1 hero text |
| Prices (currency) | **RON** when paid plans are published | The € table in Launch Content Kit 1.5 |
| Phase 2 rollout | **Each page launches separately** with the switch in `src/site.ts`; unpublished pages live at `/preview/…` (not indexed). The coming-soon page stays at `/ro/` until Home is published | Build Brief 4.1 "replaces the coming-soon page" |
| "Claim your Founding Partner spot" before checkout exists | **Join the FP waitlist without payment** (Brevo FP list). Discount is offered when paid Basic (M2) opens; payment only then, and only if they choose to subscribe | Funnel Plan 4, step 5a "→ payment via Stripe"; “reserve for access” wording |
| FAQ visits before vs. after sign-up (Build Brief 5, `faq_view_pre_signup` / `faq_view_post_signup`) | **Not split for now**: the FAQ sends `faq_open` with the question opened, and nothing is stored on the visitor's device, so the privacy text stays accurate. Splitting would need a "signed up" flag in the browser and a privacy-text update | Build Brief 5 event table |
| Referral rewards (Marketing Plan 3c "invite others, move up the list") | **Access, not money**: 1 confirmed invite = ahead in the private-beta queue; 3 = a guaranteed private-beta invite. No cash, no extra discounts, no buying Founding Partner spots, no public leaderboard. After launch: one free month for both sides (Marketing Plan 5.3), built in the app | Marketing Plan 3c, 5.3, 5.4 |
| How referral progress is shown | **Confirmed-invite count, not a queue position** ("2 confirmed — 1 more for a guaranteed beta invite") | "move up the list" wording |
| What counts as a referral | Only an invited person who **confirms their email (double opt-in)**; each address once; no self-referral; at most 5 counted per person. Double opt-in applies to every waitlist sign-up, which also answers the lawyer's proof-of-consent question | — |
| Interest gate (SRL + paid Basic) | Open SRL and paid checkout when **either** (≥ **30** completed Founding Partner waitlist sign-ups on the FP Brevo list) **or** (≥ **10** workshops reply in writing that they would pay the announced Basic list price). Whichever comes first. Plain product/newsletter waitlist emails without an FP opt-in do **not** count. Revisit the thresholds after the first serious review | — |
| General waitlist vs FP waitlist | **FP waitlist** (Brevo FP list) = discount-eligible at M2 paid open. **General waitlist** = product news only, **no** FP discount. Free app users who never join the FP list pay **list price** if they subscribe later | Treating every free user as FP |

## Open questions

Not decided yet. Move into the table above when fixed.

1. **AI assistant on the free plan.** One trial during onboarding only (Build
   Brief 4.3 tier table), or 5–10 AI uses per month (Marketing Plan 3b)? The
   Marketing Plan suggests asking 5–10 carpenters before fixing the free-plan
   limits.
2. **Founding Partner pricing on Starter and Pro.** Still open: FP is Basic-only
   for Phase 2 unless we decide otherwise.
3. **Unreliable workshop internet (FAQ).** Confirm real app behaviour before
   writing the FAQ answer (Build Brief 4.6).
4. **Basic list price in RON** (the 20% FP discount applies to that number).
5. **How long the free-for-everyone period lasts** before paid Basic opens
   (public wording), and whether the FP waitlist closes at the same moment.
6. **Public soft copy for limited FP waitlist** — Terms say first 15; marketing
   may stay soft (“limited — we announce when we close”) without repeating N.

## Go-live flip (do not flip until ready)

Copy and CTAs for free app + FP waitlist → M2 discount are in the repo. **Keep
`published.*` and `productPublic` false** until this list is done. Then flip and
deploy in one go.

### Before flipping switches in `src/site.ts`

1. [ ] `https://app.mobilcab.com` is reachable and creates accounts (APP_URL).
2. [ ] Align published Terms/Privacy with this file (operator, FP 15 / 20% /
      12 months); lawyer review done where needed.
3. [ ] Brevo: waitlist list + FP list (`BREVO_FP_LIST_ID`); confirm templates;
      paste regenerated `emails/founding-partner-*.html` and `waitlist-*.html`.
4. [ ] Env on Vercel/Cloudflare: `BREVO_*`, `CONFIRM_SECRET`, optionally
      analytics domain and `BREVO_CONFIRM_TEMPLATE_ID_EN`.
5. [ ] Smoke on `/preview/…`: Home, FP form, Pricing, FAQ, confirm email flow.
6. [ ] Decide open questions 4–6 (list price can stay “TBD” on the page).

### Flip order (then deploy)

1. `privacy: true` (required before FP — enforced in `src/site.ts`)
2. `terms: true` (recommended same deploy)
3. `foundingPartner: true`
4. `home: true` (replaces coming-soon stand-in)
5. `pricing: true`, `faq: true` (and `demo` / `blog` when content is ready)
6. `productPublic: true` only when the app is truly public for SEO schema

### After deploy

1. [ ] Re-test production waitlist + FP forms end-to-end.
2. [ ] Confirm automations in Brevo fire the new subjects/bodies.
3. [ ] Coming-soon is gone from `/ro/`; roadmap still correct.
