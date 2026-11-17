# Decisions that override the planning documents

The planning documents in this folder were written at different times and
disagree in places. Where they do, these decisions win. Copy taken from the
documents is adjusted to match.

**Aligned with CAD** [`docs/plans/m1-public-free-fp.md`](https://github.com/mobilcab/mobilcab-cad/blob/develop/docs/plans/m1-public-free-fp.md)
(2026-11-06), **updated 2026-11-09** (plan ladder: Gratuit → Debitare → Atelier → CNC → Producție → AI; FP closes at billing).
**Offer update 2026-11-17:** FP benefit on RO and EN is **first 2 months free** / **primele 2 luni gratuite** (Debitare / Cut list anchored under one sheet of particle board / melamine board per month) — replaces the former **20% / 6 months** copy.

| Topic | Decision | Overrides |
|---|---|---|
| Early-adopter offer name | **Founding Partner** (RO: **Partener Fondator**) | "Founding Workshop" |
| Product stages (Roadmap) | **M1 Debitare** → **M2 Nesting + etichete + ofertă** → **M3 Export CNC** → **M4 Echipă** → **M5 AI + randări**. M-codes only on Roadmap + FAQ etape | Old M5=subscriptions; marketing that leads with M-codes elsewhere |
| Plan ladder (paid) | Each paid plan = everything below + one unlock. **Gratuit** → **Debitare** → **Atelier** → **CNC** → **Producție** → **AI**. No “Basic” / Starter / Pro / Studio | Basic = nesting bundle; Atelier/Producție/CNC as day-one paid set |
| Pre-billing (now) | **Gratuit only:** full Debitare (3D + cutlist), **unlimited** exports. Nesting / labels / quote / CNC / team / AI **not** in product yet | Gated Gratuit before billing; paid Debitare before billing |
| At billing open | **FP waitlist closes** (no new FP). **Gratuit** = Debitare + **3 downloads/account**. **Debitare (paid)** = same Debitare product, **unlimited** exports. Pricing live cards: **Gratuit + Debitare** only. **Atelier / CNC / Producție / AI** = “în curând” until each ships | Billing opens together with nesting; Basic = M1+M2 features |
| Later paid plans (when each ships) | **Atelier** = Debitare + nesting + etichete + ofertă. **CNC** = Atelier + export CNC. **Producție** = CNC + echipă/partajare. **AI** = Producție + AI + randări | Selling empty higher tiers at billing; CNC plan before export exists |
| Who is a Founding Partner | Workshop that **opts in** (app and/or site → `app.mobilcab.com/?intent=founding-partner`), **confirmed quickly** from workshop name + **CUI** (no document upload). Not automatic for every free user | “Every free user is FP”; old “firm proof” / file upload |
| FP before billing | Same full free product as everyone (no extra unlock). FP = **first 2 months free later** (RO) + soft perks. Feedback expected. **Demote** unused seats: reminder 60d → free seat at **90d** (projects kept) | “FP = unlimited vs gated Gratuit”; FP paid from day one |
| FP benefit (RO site) | **Primele 2 luni gratuite** on the chosen paid plan at billing (starts with Debitare; higher plans if available). Marketing anchor: Debitare **under the cost of one sheet of particle board (PAL) per month**. After 2 free months = list. List RON amounts still TBD | Old **20% off list / 6 months**; 12-month lock; discount only on “Basic”; FP stays open after billing |
| FP benefit (EN site) | Same as RO: **first 2 months free**; Cut list **less than one sheet of melamine board / month** | Old **20% off list / 6 months** |
| FP enrollment window | **Only before billing.** When billing opens, **FP closes** — no new seats | “Decide later whether FP closes”; open FP after paid launch |
| Founding Partner before SRL | Free program only until billing; checkout only in **app** after SRL + billing | Payment at FP claim on website |
| Number of Founding Partner spots | **First 15**; may raise + announce. Soft public copy: “limited — we announce when we close”. Counter (if shown) = approved apps | "50" / "100"; config 500 as public promise |
| Site vs app | Site informative. **Checkout in app.** CTAs → app / FP | Checkout on mobilcab.com |
| Waitlist / coming-soon | General Brevo list = **newsletter** only (no FP discount). FP = separate program | Waitlist as product gate |
| When to form SRL / open billing | When we launch billing, by client count then | Hard interest-gate numbers as standing rule |
| Legal operator until SRL | **Fineas & Ștefan** as natural persons trading as Mobilcab; update Terms/Privacy when SRL exists. Terms: FP benefits, feedback, demote 90d, close at billing, paid **Debitare** first | Placeholder company; Terms without FP rules |
| Cancelling yearly | Stops renewal; **no** pro-rata refund except 14-day withdrawal + Refund Policy when billing live | “Cancel anytime” implying year refund |
| Prices | **RON** when paid plans published | € tables in old kits |
| Phase 2 rollout | Per-page via `src/site.ts`; unpublished at `/preview/…` | Overnight full replace |
| Referral | **Off** until billing live. Then 15% off first paid month; max 3; real in-app action | Referral as M1 FP seat reward |
| General waitlist vs FP | FP = discount-eligible (if enrolled before close). Newsletter = no discount | Every free user as FP |
| Device for now | **Laptop + browser.** Tablet/phone later — don’t claim them in Terms/marketing | “All devices” / phone in Terms §2 |
| Public milestone wording | Product labels primary. Elsewhere: **„când deschidem abonamentele”** — never bare **M2**. Don’t equate billing with nesting (Atelier) | “Subscriptions open = nesting ships” as the only story |
| Plan/Home app CTA | **„Încearcă gratuit”** / **“Try it free”** | Duplicate CTA lead-ins |
| CNC trial | **Off** until payments start | Always-on 7-day CNC trial |
| AI on Gratuit | **Zero** until AI plan ships | Free AI quotas |
| Site demo videos (Home + Cum funcționează) | Trio M1 only: **design → cutlist → save** ([`docs/demo-videos-m1.md`](./demo-videos-m1.md)). No AI-assist or CNC in these three slots | Launch Content Kit §2 old AI / CNC scripts; Funnel Plan “AI-assist + CNC export” |

## Open questions

1. **Unreliable workshop internet (FAQ).** Confirm app behaviour before writing the answer.
2. **List prices in RON** for Debitare / Atelier / CNC / Producție / AI — set when each is published; until then RO markets **2 free months + PAL price anchor**; EN still **%** for FP.
3. **Whether FP free months + referral 15% stack** — decide at billing.
4. **Align EN site** with RO “2 months free” offer when ready.

## Go-live flip (do not flip until ready)

### Before flipping switches in `src/site.ts`

1. [ ] `https://app.mobilcab.com` is reachable and creates accounts (APP_URL).
2. [ ] Align published Terms/Privacy with this file (operator, FP 15 /
      **RO+EN: 2 months free**, FP **closes at billing**,
      full free until billing, gates on Gratuit only at subscriptions, paid
      **Debitare** first, feedback + demote 90d, laptop-only); lawyer review
      where needed.
3. [x] Brevo: newsletter vs FP; FP → app `?founding=1` (site CTAs + FP page; legacy `/api/founding-partner` kept until demolish).
4. [ ] Env on Cloudflare: `BREVO_*`, `CONFIRM_SECRET`, analytics as needed.
5. [ ] Smoke on `/preview/…`: Home, FP → app, Pricing (**Gratuit + Debitare** +
      coming-soon higher plans), FAQ, confirm email flow.
6. [x] Commercial ladder locked 2026-11-09 (this file).

### Flip order (then deploy)

1. `privacy: true` (required before FP — enforced in `src/site.ts`)
2. `terms: true` (recommended same deploy)
3. `foundingPartner: true`
4. `home: true`
5. `pricing: true`, `faq: true` (and `demo` / `blog` when content is ready)
6. `productPublic: true` only when the app is truly public for SEO schema

### After deploy

1. [ ] Re-test production CTAs → app + FP (`?founding=1`) end-to-end.
2. [ ] Confirm newsletter automations (not access-gate waitlist).
3. [ ] Coming-soon is gone from `/ro/`; roadmap still correct.
