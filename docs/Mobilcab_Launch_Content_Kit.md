# Mobilcab — Launch Content Kit
### Landing Page Copy · Demo Video Scripts · Facebook Launch Post · Waitlist Email

> **Superseded for website copy (2026-11-09).** Use live i18n + [`docs/DECISIONS.md`](./DECISIONS.md).
> Do not paste kitchen/bedroom, tablet/phone, or “cutlist for CNC in one click” as current product
> claims. CNC is a later stage/plan.
>
> **Demo video scripts (§2):** superseded **2026-11-13** by [`docs/demo-videos-m1.md`](./demo-videos-m1.md)
> (trio M1: design → cutlist → save). Ignore the old AI-assist / CNC export scripts below if they
> reappear in git history; the live site already uses the M1 trio.

---

## 1. Landing Page Copy

Structure: **Hero → Problem → Solution/Features → Demo → Pricing → Social Proof (placeholder) → FAQ → Final CTA**

### 1.1 Hero Section

**RO**
> **De la idee la panou, direct din browser.**
> Mobilcab e un CAD pentru mobilă de bucătărie și dormitor care rulează în browser — pe laptop, tabletă sau telefon. Fără instalări, fără licențe complicate. Proiectezi, iar cutlist-ul e pregătit pentru CNC într-un click.
>
> [**Intră în lista de așteptare — acces beta gratuit**] (CTA button)
> *Primii 100 producători de mobilă primesc preț "Founding Workshop" — blocat 12 luni.*

**EN**
> **From idea to panel, straight from your browser.**
> Mobilcab is a cloud-based CAD for kitchen and bedroom cabinets — works on laptop, tablet, or phone. No installs, no license servers. Design it, and your cutlist is CNC-ready in one click.
>
> [**Join the beta waitlist — free access**]
> *The first 100 workshops get "Founding Workshop" pricing — locked for 12 months.*

---

### 1.2 Problem Section

**RO**
> **Sună familiar?**
> - Programe CAD greoaie, instalate doar pe un calculator din atelier
> - Licențe scumpe pentru funcții pe care le folosești rar
> - Ore pierdute făcând manual cutlist-ul pentru CNC
> - Nu poți arăta clientului un design live, direct de pe telefon, la fața locului

**EN**
> **Sound familiar?**
> - Heavy CAD software installed on one single workshop computer
> - Expensive licenses for features you barely use
> - Hours lost manually building the cutlist for your CNC
> - No easy way to show a live design to a client on-site, from your phone

---

### 1.3 Solution / Features Section

**RO — Trei motive pentru care Mobilcab e diferit:**

1. **100% în browser.** Fără instalare, fără server de licențe. Deschizi orice device — laptop, tabletă, telefon — și lucrezi.
2. **Asistent AI la proiectare.** Sugerează layout-uri de panouri și îți semnalează erorile înainte să ajungă la pânza de tăiere.
3. **Cutlist & export CNC într-un click.** De la design la fișierul de tăiere, fără pași manuali intermediari.

**EN — Three reasons Mobilcab is different:**

1. **100% browser-based.** No install, no license server. Open it on any device — laptop, tablet, phone.
2. **AI design assistant.** Suggests panel layouts and flags errors before they reach the saw.
3. **One-click cutlist & CNC export.** From design to cutting file, no manual steps in between.

---

### 1.4 Demo Section

**RO:** *"Vezi cum se face un dulap de colț în bucătărie în sub 10 minute."* → [embed demo video 1]

**EN:** *"Watch how a corner kitchen cabinet comes together in under 10 minutes."* → [embed demo video 1]

---

### 1.5 Pricing Section

**RO**
| Plan | Preț | Ce include |
|---|---|---|
| **Gratuit** | 0 € | Proiectare de bază, export cutlist cu watermark |
| **Founding Workshop** *(primii 100)* | Preț introductiv, blocat 12 luni | AI-assist complet, export CNC/cutlist fără watermark, sincronizare pe toate device-urile |
| **Pro** *(preț standard, disponibil după beta)* | — | Toate funcțiile, fără limitări |

*Notă: prețurile exacte vor fi confirmate la finalul perioadei beta — cei din lista de așteptare sunt primii notificați.*

**EN** — mirror table in English, same structure.

---

### 1.6 FAQ Section (placeholder starter set — expand as real questions come in from beta testers)

**RO**
- *Trebuie să instalez ceva?* Nu, Mobilcab rulează direct din browser.
- *Funcționează pe tabletă?* Da, e optimizat pentru laptop, tabletă și telefon.
- *Pot exporta direct pentru CNC-ul meu?* Da — exportul de cutlist e pregătit pentru fluxul standard CNC.
- *Cât costă?* Planul gratuit e disponibil oricând; primii 100 utilizatori primesc preț special "Founding Workshop."

**EN** — mirror in English.

---

### 1.7 Final CTA

**RO:** *"Fii printre primii producători de mobilă din România care proiectează direct din browser. Intră în lista de așteptare."* [CTA button]

**EN:** *"Be among the first workshops in Romania designing straight from the browser. Join the waitlist."*

---

## 2. Demo Video Scripts (M1)

> **Canonical brief:** [`docs/demo-videos-m1.md`](./demo-videos-m1.md).
> Live keys in `src/data/demoVideos.ts`: `design` → `cutlist` → `save`.
> Do **not** record AI-assist or CNC export for these three slots (later roadmap / plans).

Keep each video **60–90 seconds**, screen-recorded, simple voiceover. Same sample project on all three.

### 2.1 Video 1 — `design` — Proiectare 3D

**Goal:** Ease and speed for someone who has never seen the app. Corner kitchen cabinet, browser only.

> **Hook:** „Îți arăt cum proiectezi un dulap de colț de bucătărie, direct din browser — fără instalare.”
> **Body:** Open app → project with corner cabinet → change one dimension (panels adjust) → short door/drawer if time.
> **Close:** „Asta e baza: proiectare 3D pe laptop. Următorul pas e lista de debitare.”

CAD regie: E01 / E08 (compressed). Full scripts in `mobilcab-cad` `docs/tutorials/`.

### 2.2 Video 2 — `cutlist` — Listă de debitare

**Goal:** Workshop value of M1 — parts list from the same 3D project, no manual panel math. **Not** CNC.

> **Hook:** „Din același proiect deschid Debitare.”
> **Body:** Tray **Debitare** → table with parts, sizes, quantities, materials. Say nesting/CNC come later on the roadmap.
> **Close:** „Acum ai proiectare plus debitare.”

CAD regie: **E09b** (Debitare) in the M1 curriculum — required for this marketing clip.

### 2.3 Video 3 — `save` — Salvare și export

**Goal:** Cloud continuity + CSV / `.mcab` when needed. No “one-click CNC file” claim.

> **Hook:** „Proiectul rămâne în cloud: îl redeschizi pe laptop, tot din browser.”
> **Body:** Cloud save → export cut list CSV and/or **Proiect ▾** → **Save Local** / **Export As** (`.mcab`). Unlimited exports now; Free limits only at billing.
> **Close:** Founding Partner or try the app free — link in description.

CAD regie: E09 + E12 (compressed).

---

## 3. Facebook Founder-Story Launch Post

**Important:** Post this only *after* 2–3 weeks of genuine, non-promotional participation in the target Facebook groups (per the marketing plan). This should read as a workshop owner sharing something useful, not an ad.

### 3.1 Romanian version (primary — this is your actual launch audience)

> Salut tuturor 👋
>
> De câteva luni lucrez la ceva ce cred că multor producători de mobilă din grupul ăsta le-ar prinde bine, așa că vreau să vă spun povestea, nu doar să dau un link.
>
> Am tot văzut (și am trecut și eu prin asta) — programe CAD instalate pe un singur calculator din atelier, licențe complicate, și ore pierdute făcând manual cutlist-ul pentru CNC. Așa că am construit Mobilcab — un program de proiectare mobilă (bucătării, dormitoare) care rulează direct din browser, pe laptop, tabletă sau telefon. Fără instalare.
>
> Are și un asistent care te ajută la proiectare și îți prinde erorile înainte să ajungă la pânza de tăiere, plus export de cutlist direct pentru CNC, într-un click.
>
> E în beta acum, și caut exact producători de mobilă ca voi să-l testeze și să-mi spună sincer ce nu merge. Primii care se înscriu primesc preț special, blocat pentru un an.
>
> Nu vând nimic aici — vreau părerea voastră. Cine e curios, las link în comentarii. 🙏

### 3.2 English version (for future non-Romanian trade groups)

> Hey everyone 👋
>
> I've been working on something for the past few months that I think a lot of workshop owners here would find useful, so I want to share the story, not just drop a link.
>
> Like a lot of you, I kept running into the same problems — CAD software locked to one computer in the shop, complicated licenses, and hours lost manually building the cutlist for the CNC. So I built Mobilcab — a cabinet design tool for kitchens and bedrooms that runs straight from your browser, on laptop, tablet, or phone. No installs.
>
> It also has an assistant that helps with layout and catches errors before they hit the saw, plus one-click cutlist export ready for CNC.
>
> It's in beta right now, and I'm specifically looking for workshop owners to test it and tell me honestly what doesn't work. First people to sign up get special pricing, locked in for a year.
>
> Not selling anything here — genuinely want feedback. Link in the comments for anyone curious. 🙏

---

## 4. Waitlist Confirmation Email

Sent immediately after someone joins the waitlist — sets expectations and keeps them warm until beta access opens.

### 4.1 Romanian version

**Subiect:** Ești pe listă! Iată ce urmează 🛠️

> Salut,
>
> Mulțumesc că te-ai înscris pe lista de așteptare Mobilcab!
>
> Ești oficial în grupul celor care testează prima variantă a programului — și, dacă te înscrii printre primii 100, primești preț special "Founding Workshop," blocat 12 luni.
>
> **Ce urmează:**
> 1. Îți trimit acces beta în următoarele [X] zile
> 2. Îți arăt un ghid rapid de 10 minute ca să faci primul tău proiect
> 3. Îți cer sincer părerea — ce merge, ce nu, ce ai vrea să vezi

> Până atunci, poți vedea cum funcționează aici: [link video demo]
>
> Pe curând,
> [Numele tău], fondator Mobilcab

### 4.2 English version

**Subject:** You're on the list! Here's what happens next 🛠️

> Hi,
>
> Thanks for joining the Mobilcab waitlist!
>
> You're officially in the group testing the first version of the app — and if you're among the first 100 to sign up, you'll get special "Founding Workshop" pricing, locked in for 12 months.
>
> **What happens next:**
> 1. I'll send you beta access within the next [X] days
> 2. A quick 10-minute guide to help you build your first project
> 3. I'll genuinely ask for your feedback — what works, what doesn't, what you'd want to see

> In the meantime, here's a quick look at how it works: [demo video link]
>
> Talk soon,
> [Your name], Mobilcab founder

---

## 5. SEO Blog Post Outlines (Romanian long-tail keywords)

Quick outlines so these can be written fast — each should be 600–900 words, practical and non-salesy, with a soft CTA to the waitlist at the end.

1. **"Program proiectare mobilă gratuit — ce opțiuni ai în 2026"**
   - Overview of free/low-cost cabinet design tool options in Romania
   - Honest pros/cons of each, including desktop-only limitations
   - Where Mobilcab fits, without hard-selling

2. **"Cum faci cutlist pentru CNC fără să calculezi manual"**
   - Walk through the manual process pain points
   - Show how automated cutlist export solves each one
   - Screenshot-driven, practical tone

3. **"Polyboard vs. alternative cloud-based: ce se schimbă când proiectezi din browser"**
   - Factual comparison of desktop-locked vs. browser-based workflow
   - Focus on real workflow differences (multi-device, no license server, collaboration)
   - Fair to competitors — build trust, not hype

---

## Notes on Using This Kit

- All Romanian copy should be reviewed by a native speaker before publishing — trade-specific terminology (tâmplărie, CNC, cutlist conventions) varies by region and it's worth getting it exactly right for credibility with a skeptical trade audience.
- Keep the Facebook post's non-promotional framing intact — the plan only works if it reads as authentic, not templated.
- Reuse the same sample cabinet project across the landing page demo and all three videos for visual consistency and faster production.
