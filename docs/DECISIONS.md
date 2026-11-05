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
| Number of Founding Partner spots | **First 15**; if demand is high we **raise the cap** and announce publicly. Soft technical cap in code (`FOUNDING_PARTNER_SPOTS`) may be higher. Marketing copy stays soft (see scarcity row) — do not hard-sell “15” on every page | "50" / "50–100" / "100"; CAD note that briefly said “no seat cap” (2026-11-04) |
| How long the Founding Partner price is locked | **20% off list for 12 months from paid activation**, then list price. **Public marketing shows the % only** until we set list RON | "for life"; fixed 49/549 RON without %; CAD Admin default 30% |
| What Basic includes at paid launch | **M1 + M2**: 3D design, cut list / workshop docs, sheet nesting, labels, client quote. **Not CNC** (M3+) and not recurring AI | Build Brief 4.3 Basic row that bundled CNC export |
| Founding Partner paid offer | Same **Basic (M1+M2) only** at **20% off list**, after SRL + checkout, for FP-waitlist people only. **No FP discount on Starter/Pro** for now. Later / non-FP buyers = list price. Referral discount (separate %) stacks after billing is live — see Referral | Fixed 49 RON/month / 549 RON/year; FP on Starter/Pro |
| When to form an SRL / open billing | **When we launch billing**, judged by **how many clients** we have then — not the old fixed 30 FP / 10 workshops gate. No Stripe/MoR / paid checkout until that call | Assumed day-one company; hard Interest-gate thresholds (30 / 10) |
| Legal operator until an SRL exists | **Natural persons (Ștefan and Fineas)** trading as Mobilcab; no CUI, registered office or Trade Register number on the site. Update Terms/Privacy as soon as the SRL is formed | Placeholder company fields in the legal drafts |
| Cancelling a yearly plan | **Stops renewal, no pro-rata refund** of the unused year, except the 14-day consumer withdrawal (GEO 34/2014) and the Refund Policy once billing is live | "cancel anytime" on yearly Founding Partner (Funnel Plan / Build Brief) |
| "Kitchen and bedroom" in headlines and hero copy | **Removed**: say "mobilă" / "furniture" | Launch Content Kit 1.1 hero text |
| Prices (currency) | **RON** when paid plans are published | The € table in Launch Content Kit 1.5 |
| Phase 2 rollout | **Each page launches separately** with the switch in `src/site.ts`; unpublished pages live at `/preview/…` (not indexed). The coming-soon page stays at `/ro/` until Home is published | Build Brief 4.1 "replaces the coming-soon page" |
| "Claim your Founding Partner spot" before checkout exists | **Join the FP waitlist without payment** (Brevo FP list). Discount is offered when paid Basic (M2) opens; payment only then, and only if they choose to subscribe | Funnel Plan 4, step 5a "→ payment via Stripe"; “reserve for access” wording |
| FAQ visits before vs. after sign-up (Build Brief 5, `faq_view_pre_signup` / `faq_view_post_signup`) | **Not split for now**: the FAQ sends `faq_open` with the question opened, and nothing is stored on the visitor's device, so the privacy text stays accurate. Splitting would need a "signed up" flag in the browser and a privacy-text update | Build Brief 5 event table |
| Referral rewards | **After billing is live**: referrer gets an **extra discount %** on paid plan (separate from the FP 20%), for invites that complete a **real in-app action** (not signup alone). **Max 3 rewarded invites** per referrer. Exact referral % TBD when billing opens. No cash, no buying FP spots, no public leaderboard | Marketing Plan 3c beta-queue / free-month rewards; “access not money” beta framing |
| How referral progress is shown | **Confirmed + activated invite count** toward the max of 3 rewarded (in app) | "move up the list" / queue-position wording |
| What counts as a referral | Invited person creates an account and completes a **first real action** in the app (e.g. save project or export); one referral per invitee; no self-referral; **at most 3 rewarded** per referrer. Double opt-in still applies to waitlist/email consent | “email confirm alone counts”; at most 5 counted |
| Interest gate (SRL + paid Basic) | **Superseded** by “when we launch billing, based on client count” (row above). Old 30 FP / 10 written-intent thresholds are historical only | Hard numeric gate as a standing rule |
| General waitlist vs FP waitlist | **FP waitlist** (Brevo FP list) = discount-eligible at paid Basic open. **General waitlist** = product news only, **no** FP discount. Free app users who never join the FP list pay **list price** if they subscribe later | Treating every free user as FP |
| Free-for-everyone duration | Until **billing launches**. Whether the FP waitlist **closes at that moment** is decided **then**, not now | Fixed public end-date before billing exists |
| Public FP scarcity copy | Soft: **“limited — we announce when we close”**. Terms may still say first 15 / we can raise the cap; marketing does not hammer the number | Public “first 15 only” on every CTA |
| AI on the free plan | **Zero** until AI ships. No trial quota and no monthly AI allowance on Gratuit before the feature exists | Build Brief 1-trial / Marketing Plan 5–10/month |
| Public milestone names | Use **product labels** on the site (e.g. Debitare / Atelier / CNC / Echipă / Abonamente / AI), not “M1/M2…” as the primary name. Internal docs may keep M-codes as aliases | Marketing that leads with M1/M2 jargon |
| Plan/Home app CTA button | **„Încearcă gratuit”** / **“Try it free”** — lead-in text must **not** repeat the button wording | Duplicate `final.or` + `hero.ctaSecondary` copy |

## Open questions

Not decided yet. Move into the table above when fixed.

1. **Unreliable workshop internet (FAQ).** Confirm real app behaviour before
   writing the FAQ answer (Build Brief 4.6) — revisit later.
2. **Basic list price in RON** — set when we publish paid Basic; until then
   marketing shows **discount % only**.
3. **Exact referral discount %** (on top of FP 20%) — set when billing opens.
4. **Whether FP waitlist closes** at billing launch — decide at that moment.

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
6. [x] Open product questions from 2026-11-05 locked (list price + referral %
      still TBD until billing — OK to show % only on the site).

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
