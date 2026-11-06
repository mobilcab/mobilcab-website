# Decisions that override the planning documents

The planning documents in this folder were written at different times and
disagree in places. Where they do, these decisions win. Copy taken from the
documents is adjusted to match.

**Aligned with CAD** [`docs/plans/m1-public-free-fp.md`](https://github.com/mobilcab/mobilcab-cad/blob/develop/docs/plans/m1-public-free-fp.md)
(2026-11-06 Fineas / Ștefan).

| Topic | Decision | Overrides |
|---|---|---|
| Early-adopter offer name | **Founding Partner** | "Founding Workshop" (Launch Content Kit 1.1, 1.5, 1.6, 4) |
| Free access before paid plans | **App is free for everyone** until billing opens (M2). Free use does **not** by itself grant the FP discount. Gratuit has **gates** (cutlist first 10 rows on screen; **3 downloads/account** total for CSV + exports + local `.mcab`; cloud save always free). Nesting / labels / CNC / AI / cloud render / team **not in M1** | Marketing Plan private-beta-only; waitlist-as-gate; unlimited free export |
| Who is a Founding Partner | Workshop that **opts in** (app and/or site → `app.mobilcab.com/?founding=1`), **approved manually** (Fineas + Ștefan), with **firm proof**. Not automatic for every free user | Funnel Plan “claim spot = pay”; “every free user is FP” |
| FP on M1 (before billing) | **Free** (no money): unlimited cutlist/export within M1; feedback **contract** (20‑min kickoff call, 1 real project/month to cutlist, monthly 5‑question form). **Demote:** reminder at 60 days with no feedback → back to Gratuit at **90 days** (projects kept; seat freed). Soft perks: recognition + early-access preview slices | “FP = paid Basic from day one”; no feedback obligations |
| When the FP discount applies | When **billing opens (M2)**: FP who continue **must pay**; **20% off list**, **locked 6 months** from first payment, on paid plans **Atelier / Producție / CNC**. Non‑FP / after window = list price | Vague “when we open payment”; **12‑month** lock; Basic/Starter/Pro/Studio naming on site |
| Founding Partner before SRL | **Free program only** until billing: no payment at sign-up. Checkout only in **app** after SRL + billing live | Funnel Plan payment-at-claim; checkout on website |
| Number of Founding Partner spots | **First 15**; raise cap + announce if demand is high. Soft copy: “limited — we announce when we close”. Public counter **X of 15** reads **approved apps from the app**, not Brevo | "50" / "100"; Brevo as seat counter |
| How long the Founding Partner price is locked | **20% off list for 6 months from paid activation**, then list. Marketing shows **% only** until list RON is set | "for life"; **12 months**; fixed 49/549 RON without % |
| Paid plan names at billing | **Atelier / Producție / CNC** (app scheme, RON). Site Pricing may show them **informatively**. **No** Basic / Starter / Pro / Studio as live paid tiers on site | Website `pricing.ts` Basic/Starter/Pro/Studio; CAD EUR table |
| What ships in M1 vs later | M1: design + cutlist (gated on Gratuit). Nesting / labels / quote / CNC / AI / team = later milestones — discuss separately | Build Brief Basic row bundling CNC |
| Site vs app | Site = **informative** (Pricing, FAQ, FP, Roadmap, Terms). **All payments / checkout in app** (`app.mobilcab.com`). CTAs: „Creează cont gratuit” / „Încearcă gratuit” / „Devino Founding Partner” → app | Checkout or plan purchase on mobilcab.com |
| Waitlist / coming-soon | Coming-soon + waitlist forms → **„Creează cont gratuit”**. Brevo general list = **newsletter** only (not access gate). Existing Brevo signups get email with app link + FP invite | Waitlist as product gate; `/ro/` forever as only entry |
| FP form on site | Submits into **app** (`?founding=1`); not a separate paid reserve in Brevo | Brevo-only FP reservation as the product path |
| When to form an SRL / open billing | **When we launch billing**, by **client count** then — not a fixed 30 FP / 10 workshops gate | Assumed day-one company; hard Interest-gate thresholds |
| Legal operator until an SRL exists | **Natural persons (Ștefan and Fineas)** trading as Mobilcab; update Terms/Privacy when SRL exists. Terms need an **FP section** (benefits, feedback duties, demote 90d, pay at M2) | Placeholder company fields; Terms without FP |
| Cancelling a yearly plan | **Stops renewal, no pro-rata refund** of the unused year, except 14-day withdrawal (GEO 34/2014) and Refund Policy once billing is live | "cancel anytime" on yearly FP |
| "Kitchen and bedroom" in headlines | **Removed**: say "mobilă" / "furniture" | Launch Content Kit 1.1 hero text |
| Prices (currency) | **RON** when paid plans are published | € table in Launch Content Kit 1.5 |
| Phase 2 rollout | **Each page launches separately** via `src/site.ts`; unpublished at `/preview/…`. Coming-soon at `/ro/` until Home is published | Build Brief 4.1 "replaces the coming-soon page" overnight |
| FAQ pre vs post sign-up split | **Not split for now**: `faq_open` only | Build Brief 5 split events |
| Referral | **Off until M2 / billing live**. Then: **15% off first paid month** for referrer; max **3** rewarded invites; invitee must complete a **real in-app action** (not signup alone). No cash, no buying FP seats, no public leaderboard. `REFERRAL_PROGRAM = false` at M1 launch | Marketing Plan beta-queue rewards; “3 invites = FP seat” as M1 reward; referral UI on M1 |
| How referral progress is shown | **After M2**: confirmed + activated invite count toward max 3 (in app) | "move up the list" wording |
| What counts as a referral | Account + **first real action**; one referral per invitee; no self-referral; max 3 rewarded | “email confirm alone counts” |
| Interest gate (SRL + paid) | **Superseded** by “when we launch billing, based on client count” | Hard numeric gate as standing rule |
| General waitlist vs FP | **FP** = program / discount-eligible at billing. **General list** = newsletter, **no** FP discount. Free users who never join FP pay **list** later | Every free user as FP |
| Free-for-everyone duration | Until **billing launches**. Whether FP **closes then** is decided **then** | Fixed public end-date before billing |
| Public FP scarcity copy | Soft: **“limited — we announce when we close”** | Public “first 15 only” on every CTA |
| AI on the free plan | **Zero** until AI ships | Build Brief trial AI quotas |
| Public milestone names | **Product labels** (Debitare / Atelier / CNC / …), not M1/M2 as primary | Marketing that leads with M-codes |
| Plan/Home app CTA | **„Încearcă gratuit”** / **“Try it free”** — lead-in must **not** repeat the button | Duplicate `final.or` + `hero.ctaSecondary` |
| CNC trial | **7-day CNC trial off** until payments start | Always-on 7-day CNC trial for new accounts |

## Open questions

Not decided yet. Move into the table above when fixed.

1. **Unreliable workshop internet (FAQ).** Confirm real app behaviour before
   writing the FAQ answer (Build Brief 4.6) — revisit later.
2. **List prices in RON** for Atelier / Producție / CNC — set when we publish
   paid plans; until then marketing shows **discount % only**.
3. **Whether FP 20% + referral 15% stack** — decide with commercial policy at billing.
4. **Whether FP waitlist closes** at billing launch — decide at that moment.

## Go-live flip (do not flip until ready)

Copy and CTAs for free app + FP → M2 paid discount are in the repo. **Keep
`published.*` and `productPublic` false** until this list is done. Then flip and
deploy in one go.

### Before flipping switches in `src/site.ts`

1. [ ] `https://app.mobilcab.com` is reachable and creates accounts (APP_URL).
2. [ ] Align published Terms/Privacy with this file (operator, FP 15 / 20% /
      **6 months**, feedback + demote 90d, pay at M2); lawyer review where needed.
3. [ ] Brevo: general list = newsletter; FP path → app `?founding=1`; confirm
      templates; paste regenerated email HTML if needed.
4. [ ] Env on Cloudflare: `BREVO_*`, `CONFIRM_SECRET`, analytics as needed.
5. [ ] Smoke on `/preview/…`: Home, FP → app, Pricing (Gratuit + FP + Atelier /
      Producție / CNC informative), FAQ, confirm email flow.
6. [x] Product questions locked 2026-11-06 with CAD `m1-public-free-fp.md`
      (list RON + stack FP/referral still TBD at billing — OK to show % only).

### Flip order (then deploy)

1. `privacy: true` (required before FP — enforced in `src/site.ts`)
2. `terms: true` (recommended same deploy)
3. `foundingPartner: true`
4. `home: true` (replaces coming-soon stand-in)
5. `pricing: true`, `faq: true` (and `demo` / `blog` when content is ready)
6. `productPublic: true` only when the app is truly public for SEO schema

### After deploy

1. [ ] Re-test production CTAs → app + FP form end-to-end.
2. [ ] Confirm newsletter automations (not access-gate waitlist).
3. [ ] Coming-soon is gone from `/ro/`; roadmap still correct.
