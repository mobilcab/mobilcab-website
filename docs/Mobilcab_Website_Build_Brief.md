# Mobilcab — Website Build Brief
### For use in Claude Code. Build in two phases: Coming Soon now, full funnel later.

This brief consolidates everything from the marketing plan, launch content kit, and website funnel plan into one buildable spec. Bring `Mobilcab_Marketing_Plan.md`, `Mobilcab_Launch_Content_Kit.md`, and `Mobilcab_Website_Funnel_Plan.md` into the Claude Code project folder too — this brief embeds the essentials, but the full video scripts, complete FAQ copy, and SEO blog post bodies live in those files.

---

## 0. Kickoff Prompt (paste this into Claude Code to start)

```
I'm building the marketing website for Mobilcab, a cloud-based CAD app for
kitchen/bedroom cabinet design, targeting independent carpenters in Romania
first, expanding across Europe later. Build this in two phases — only build
Phase 1 right now; Phase 2 comes later once I say so.

PHASE 1 (build now): A single "coming soon" page — bilingual (Romanian
default, English toggle), with just an email waitlist capture, a one-line
value prop, and a short description. No pricing, no pages, no navigation
beyond a language switch. Mobile-first — the audience often browses from a
phone or tablet on a workshop floor, sometimes on weak wifi, so keep the
page extremely lightweight and fast.

Tech stack: Astro + Tailwind CSS, deployed to Vercel. Use Astro specifically
because it ships minimal JS by default — performance matters more here than
interactivity. Only use a client-side island (React or vanilla JS) for the
language toggle and the form submission handler.

Email capture: wire the form to [Brevo/Mailchimp — see Section 1 below,
confirm which one before building], not a custom backend — I don't want to
maintain a database for this yet.

Full design direction, copy, and Phase 2 page specs are in the rest of this
brief (Mobilcab_Website_Build_Brief.md) — read it before starting, and ask
me before building anything from Phase 2.
```

---

## 1. Tech Stack & Setup

- **Framework: Astro + Tailwind CSS.** Chosen specifically for performance — Astro ships zero JS by default and only hydrates the small interactive pieces (language toggle, email form, later the pricing page's tier selector). This matters because the audience may be on weak workshop wifi; a heavy React/Next.js bundle is the wrong tradeoff here. (If you're already more comfortable in Next.js, that works too — just be deliberate about code-splitting and avoid shipping a large JS bundle for what's mostly static content.)
- **i18n:** folder-based locale routing (`/ro/...` default, `/en/...`), simple JSON dictionaries per locale. No heavy i18n library needed at this scale.
- **Hosting:** Vercel free tier — automatic HTTPS, easy custom domain, simple deploys from Code tab.
- **Email capture / waitlist (Phase 1):** use an actual email marketing tool, not a custom database, so confirmation emails (Launch Content Kit Section 4) and later newsletters (Retention Playbook, Marketing Plan Section 6a) work out of the box. **Brevo** (EU-based, strong free tier, GDPR-friendly by default) is the recommended pick over Mailchimp given the GDPR/EU-data requirements already established — confirm this choice before building the integration.
- **Analytics:** **Plausible** or **Fathom** — EU-based, cookie-consent-free, lightweight. Avoid Google Analytics here; it needs a cookie consent banner under GDPR (Marketing Plan Section 4b) and adds unnecessary JS weight for exactly the performance-sensitive audience this site serves.
- **Payments (Phase 2 only, not now):** Stripe, charging in RON, using Stripe Billing for subscriptions (Marketing Plan Section 4b).
- **Domain:** register the actual domain now if not already done (e.g., `mobilcab.ro`), even though only the coming-soon page goes live.

---

## 2. Phase 1 — Coming Soon Page (build this first, nothing else)

**Goal:** capture emails during the quiet month -6 foundation phase (Marketing Plan Section 3c) — deliberately minimal, no product mentions beyond the core value prop, no pricing, no Founding Partner offer yet (that launches month -4).

**Content (Romanian, primary):**
- Headline: *"Mobilcab — proiectare mobilă de bucătărie și dormitor, direct din browser."*
- One-line value prop: *"Fără instalare. Lucrezi pe laptop, tabletă sau telefon."*
- Short description (2–3 sentences): a plain-language teaser, no AI/CNC feature claims yet — those get earned once the Home page and demo videos exist in Phase 2. Something like: *"Construim un instrument de proiectare pentru tâmplari și ateliere de mobilă — simplu, rapid, și accesibil. Lasă-ți emailul ca să fii primul care află când lansăm."*
- Email input + submit button: *"Anunță-mă la lansare"*
- Small GDPR consent checkbox: *"Sunt de acord să primesc actualizări prin email. [Vezi politica de confidențialitate]"* — link can point to a placeholder privacy note for now; the full ToS/Privacy Policy is a Phase 2 / Section 4b deliverable, not needed to launch this page.
- Success state after submit: *"Mulțumim! Te anunțăm imediat ce lansăm."*

**English toggle:** mirrors the above — headline, value prop, description, form, consent, success state.

**Functional requirements:**
- Client-side + server-side email format validation.
- Honeypot field or lightweight bot protection on the form (no need for a full CAPTCHA at this volume).
- "Already subscribed" state if the same email submits twice.
- No referral mechanic yet — that's intentionally deferred to Phase 2 / month -4 (Funnel Plan Section 6), don't build it now even though it's described in the Funnel Plan.

**Design for this page specifically:** extremely restrained — logo/wordmark, headline, one paragraph, one form, nothing else. This is the simplest possible version of funnel Stage 2–3 (Landing page → Waitlist signup), not a preview of the final site.

**Analytics to wire up even at this stage:** page visit count, form submission count, conversion rate between the two (Funnel Plan Section 5) — this is the first real data point on whether the value prop lands before any money is spent.

---

## 3. Design Direction (applies to this page now, and all of Phase 2 later)

**Tone:** professional and trustworthy, not flashy. This audience (Marketing Plan Section 2) is skeptical of marketing hype and values directness. Avoid the generic "SaaS gradient hero with floating 3D shapes" look — it reads as impersonal and undermines the "built by someone who gets this trade" positioning (Section 3c).

**Visual direction to lean into instead:** something that nods to the craft itself without being kitsch — clean geometric sans-serif typography, a grid-based layout with generous whitespace (echoing technical/blueprint drawing conventions, which subtly reinforces "this is a precision tool"), a restrained color palette: neutral grays/off-whites as the base, with one warm accent (a muted amber or wood-tone) used sparingly for CTAs and highlights — not a loud multi-color brand palette.

**Performance as a design constraint, not an afterthought:** no large hero video autoplay, no heavy animation libraries, optimize all images (WebP, properly sized), lazy-load anything below the fold. This isn't just good practice — it directly serves the "verify before cutting, works even on workshop wifi" trust story the whole plan is built around.

**Mobile-first, genuinely:** design and build the mobile layout first, then expand up to desktop — don't design desktop-first and squeeze it down. A meaningful share of this audience will see the site on a phone or tablet.

---

## 4. Phase 2 — Full Funnel Site (build only after Phase 1 is live — do not start yet)

Sequenced per Website Funnel Plan Section 6. Build in this order, not all at once:

### 4.1 Home / Landing Page (month -4)
Replaces the coming-soon page. Structure: Hero → Problem → Solution/Features → Demo → Pricing teaser → FAQ teaser → Final CTA (Launch Content Kit Section 1). **Two CTAs in the hero**, Founding Partner visually primary:
- Primary button: *"Devino Founding Partner"* / *"Become a Founding Partner"*
- Secondary link: *"Sau alătură-te gratuit"* / *"Or join free"*

Full bilingual hero/problem/solution copy already exists in Launch Content Kit Section 1 — pull directly from that file rather than rewriting.

### 4.2 Founding Partner Program Page (month -3 to -2)
Dedicated page, not a pricing-table row (Funnel Plan Section 3.2). Needs:
- Co-creation framing, not "beta tester" framing
- What's included: 12-month locked pricing, roadmap input, name credit, private feedback group, early feature access
- The real offer: **49 RON/month or 549 RON/year** (Basic, Founding Partner pricing), capped at first 50–100 signups
- A live, real counter: *"X din 50 locuri Founding Partner rămase"*
- Honest paragraph on the AI-tier tradeoff: Basic includes a one-time AI trial during onboarding only, not ongoing AI-assist
- CTA: *"Rezervă-ți locul de Founding Partner"*

This page's social-proof section (real testimonials) can't be built with real content until the private beta (month -3) produces them — build the section's structure now, populate it later.

### 4.3 Pricing Page (month -1, finalized last)
Full tier table, prices in RON (not EUR, not USD — Marketing Plan Section 3a addendum):

| Tier | Price | AI requests/month |
|---|---|---|
| Free | 0 RON | One-time onboarding trial only |
| Basic | 49 RON/lună (549 RON/an, Founding Partner) | One-time onboarding trial only |
| Starter | 99 RON/lună | 50 |
| Pro | 179 RON/lună | 150 |
| Studio | 289 RON/lună | 400 |

Callout box above the table pointing back to the Founding Partner page. "Cancel anytime" next to every paid tier.

### 4.4 Demo / How It Works Page (month -3 to -2)
Hosts the three demo videos (Launch Content Kit Section 2 — full scripts there) with a short written caption per video pulling out the "aha moment" in text. Built as its own page, separate from the Home embed, so it can be linked directly from Facebook posts and YouTube descriptions.

### 4.5 Blog / Resources (month -2)
Three SEO posts (outlines in Launch Content Kit Section 5) — publish early enough for Google indexing before launch traffic. Each ends with a soft CTA to the Founding Partner page.

### 4.6 FAQ / Support Page (month -2)
Starter set in Launch Content Kit Section 1.6, expanded with:
- What happens on unreliable workshop internet? (needs an honest, specific technical answer — confirm the real offline/caching behavior before writing this)
- Is the AI-assist output guaranteed accurate? (plain-language version of the liability point — Marketing Plan Section 4b)
- Basic vs. other tiers — what's actually different?
- What happens when my Founding Partner year ends?

### 4.7 Legal Pages (month -1)
- Privacy Policy — GDPR-compliant (Section 4b)
- Terms of Service — includes the AI-assist liability clause, drafted with a Romanian lawyer, with an explicit acknowledgment checkbox at signup, not just a buried link

---

## 5. Funnel Analytics Events to Implement (Phase 2)

| Event | Fires on |
|---|---|
| `landing_scroll_depth` | Visitor reaches pricing/demo section of Home page |
| `cta_click` | Click on "Become a Founding Partner" vs. "Join free" — tag which one |
| `fp_signup_started` / `fp_signup_completed` | Founding Partner form start vs. finish — isolates drop-off |
| `blog_to_signup` | Blog post visit followed by a waitlist/Founding Partner click |
| `faq_view_pre_signup` / `faq_view_post_signup` | Distinguishes objection-driven pre-signup FAQ traffic from post-signup support lookups |

---

## 6. What's Already Written vs. Still Needed

**Already written (pull directly, don't rewrite):**
- Hero/problem/solution copy, bilingual — Launch Content Kit Section 1
- FAQ starter set — Launch Content Kit Section 1.6
- Three demo video scripts — Launch Content Kit Section 2
- Facebook founder-story post, waitlist confirmation email — Launch Content Kit Sections 3–4
- SEO blog post outlines — Launch Content Kit Section 5

**Still needed before Phase 2 can fully launch:**
- Actual demo video recordings (scripts exist, footage doesn't)
- Founding Partner page full copy (outline above, needs final writing)
- Real testimonials (blocked on private beta, month -3)
- ToS AI-liability clause (needs a Romanian lawyer, Section 4b)
- Final confirmed RON pricing (pending real beta/group feedback per Marketing Plan Section 3a's caveat)

---

## 7. SEO & Technical Checklist (Phase 2)

- Bilingual meta tags, Open Graph tags, and `hreflang` for `/ro` and `/en`
- `sitemap.xml`, `robots.txt`
- Structured data (`SoftwareApplication` schema) once the product is public
- Cookie/GDPR consent banner if any non-essential cookies are added later (Plausible/Fathom typically don't require one — verify before adding anything else)
- Target good Lighthouse scores (90+) given the performance-sensitive audience — treat this as a release gate, not a nice-to-have
