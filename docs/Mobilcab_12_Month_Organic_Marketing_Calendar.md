# Mobilcab — 12-Month Organic Marketing Calendar
### Week by week, platform by platform: October 2026 → October 2027

Built from `Mobilcab_Marketing_Plan.md` (Sections 2, 3c, 5, 6a, 7, 9, 11), the
Launch Content Kit, and `docs/DECISIONS.md`. Organic only: no paid ads (the plan
starts paid tests only once monthly profit reaches about €150–210, Marketing
Plan Section 9).

---

## 0. How to read this

**Dates.** Week 1 = Monday 12 October 2026 = **month -6**. Launch = **week 27**
(Monday 12 April 2027). Each week also has a launch-relative label (L−26 … L+25),
so if launch moves, shift every date by the same number of weeks and the plan
still holds.

**Phases.**

| Weeks | Dates | Phase | Weekly time |
|---|---|---|---|
| 1–4 | 12 Oct – 8 Nov 2026 | Month -6: quiet foundation | 10–12 h |
| 5–8 | 9 Nov – 6 Dec | Month -5: genuine trust-building | 10–12 h |
| 9–13 | 7 Dec – 10 Jan 2027 | Month -4: first soft mentions, referral launch (holidays in weeks 11–12) | 8–12 h |
| 14–17 | 11 Jan – 7 Feb | Month -3: private beta | 12–14 h |
| 18–22 | 8 Feb – 14 Mar | Month -2: proof building (videos, blog, testimonials) | 12 h |
| 23–26 | 15 Mar – 11 Apr | Month -1: countdown | 12–14 h |
| 27–30 | 12 Apr – 9 May | Launch month | ~20 h |
| 31–39 | 10 May – 11 Jul | Phase 1: Romania beta growth | 8–10 h |
| 40–52 | 12 Jul – 10 Oct | Phase 2: growth + designers/manufacturers | 8–10 h |

Weekly times follow Marketing Plan Section 11. **If time runs short, cut in this
order: blog first, then social posting. Never cut Facebook group presence or
customer support** (Section 11).

**Honest scale.** The market is a few thousand businesses (4,290 registered
furniture makers plus sole traders, Section 2). "Reaching as many as possible"
here means reaching most of *that* market over 12–24 months, through three
separate routes, because each reaches people the others don't:

1. **Facebook groups**: the online, active part of the trade.
2. **Associations and trade shows**: the offline-first part, often older
   carpenters who aren't in any group (Section 2, limit 2).
3. **Search** (blog + YouTube): people actively looking for a tool right now.

Plus two multipliers: **word of mouth through the referral program**, and the
**anchor customer** (Section 5.4).

---

## 1. Platforms and their job

| Platform | Job | Cadence (from when) | Notes |
|---|---|---|---|
| **Facebook groups** (5–10 tâmplari / mobilă la comandă / CNC lemn groups) | The main engine. Trust first, then product | Answers from week 5; own posts rarely | Read each group's rules; ask admins before any project mention; no links unless allowed (put them in comments) |
| **Facebook Page** (Mobilcab) | Home base people check after seeing you in a group | Created week 1; 1 post / 1–2 weeks from week 5; weekly from week 9; 2/week after launch | Empty pages look abandoned: the early posts are for later visitors, not reach |
| **YouTube** | Searchable proof: demos and tutorials | Created week 1; first video week 6; demos weeks 18–21; ~1 every 2 weeks after | Romanian titles with the words people search ("cum fac cutlist CNC") |
| **Blog** (mobilcab.ro/ro/blog) | Google traffic from people looking for tools | 3 posts weeks 18–20 (drafts exist); 1/month after launch | Indexing takes weeks, which is why they go out at month -2 |
| **Email** (Brevo) | Keeps the waitlist warm; launch announcement | Monthly "jurnal de construcție" from week 10; weekly in the last 3 weeks before launch | Only to confirmed sign-ups (double opt-in) |
| **WhatsApp** | Word of mouth between carpenters | From week 13 (invite links have a WhatsApp button) | Never message people who haven't asked |
| **Associations, trade shows, workshop visits** | The offline slice of the market | First contact week 6; visits monthly | APMR and regional wood clusters (Section 5.1) |
| **LinkedIn** | Designers, architects, manufacturers (Phase 2) | From week 40 | Not before: one audience at a time (Section 11, "message dilution") |
| **Instagram / TikTok** | Not this year, unless there's spare time | — | Section 4.3: "pick two, not five". At most, repost the YouTube demos from week 40 |

**Group etiquette** (the whole plan depends on it):

- Give value at least 9 times for every 1 mention of Mobilcab.
- Answer the question asked, fully, even when the honest answer isn't Mobilcab.
- Never paste the same post in every group on the same day. Adapt it, and space it out.
- Post links in a comment, not the post, if the group allows them at all.
- If an admin says no, accept it: being banned costs a whole slice of a small market.

---

## 2. The website, week by week

The launch switch (`src/site.ts`) and settings mean each website step is one
small change plus a deploy. Run `npm run test:all` and `npm run check-launch`
before each deploy.

| Week | Website step | Needs first |
|---|---|---|
| 1 | **Deploy the coming-soon page** | Git + GitHub, Vercel account, domain, Brevo setup (README), Plausible |
| 13 | `home: true`, `privacy: true`, `REFERRAL_PROGRAM = true`; rebuild + re-paste emails | Lawyer-approved Privacy Policy (send drafts in week 2, approval by week 12) |
| 16 | `foundingPartner: true` | `BREVO_FP_LIST_ID`; decide open questions 2–3 in DECISIONS.md |
| 18 | `blog: true` + first post `published: true` | Competitor facts verified (the [VERIFICĂ] markers) |
| 20 | `demo: true`, video IDs in `src/data/demoVideos.ts` | The three recorded videos |
| 21 | `faq: true`; real quotes in `src/data/testimonials.ts` | Answers to open questions 4–5; testers' written permission |
| 23 | `pricing: true`, `terms: true` | Final prices; lawyer-approved Terms |
| 27 | `productPublic = true`; Founding Partner payments live | **Stripe payments are not built yet**: plan that development before week 23 |

---

## 3. Week by week

Only channels with something to do that week are listed.

### Month -6 — Quiet foundation (weeks 1–4)

No product mentions anywhere public (Section 3c).

**Week 1 · 12 Oct · L−26**
- **Website:** deploy the coming-soon page (see Section 2).
- **Facebook Page + YouTube:** create both. Profile only: name, logo (the wordmark), cover, a one-line description, link to mobilcab.ro. No posts yet.
- **Admin:** start SRL registration, Stripe account and e-Factura-ready invoicing (Section 4b).
- **Research:** search Facebook for "tâmplari", "mobilă la comandă", "CNC lemn", "proiectare mobilă"; list 10–15 groups with member counts and how active they are.

**Week 2 · 19 Oct · L−25**
- **Facebook groups:** join the 5–10 best groups. Read every group's rules; note which allow links or project mentions.
- **Start a "question log"** (a simple spreadsheet): every question carpenters ask in the groups, word for word. It becomes your FAQ, blog topics and video ideas for the whole year.
- **Legal:** send the Privacy Policy and Terms drafts (`docs/`) to the lawyer. The Privacy Policy must be approved by week 12.

**Week 3 · 26 Oct · L−24**
- **Facebook groups:** observe only. Note the tone, the recurring pain points, and **who the respected voices are**: the people others tag for advice. They're your anchor-customer candidates (Section 5.4).
- **Content bank:** write 8–10 genuinely useful tips from your own trade knowledge (see Section 5). These feed the Page from week 5.

**Week 4 · 2 Nov · L−23**
- **Research offline:** find contacts for APMR and regional wood clusters; look up 2027 dates for BIFE-SIM and regional furniture/wood fairs [VERIFY the dates]. Put them in the calendar.
- **Monthly review** (30 min): waitlist sign-ups and confirmation rate in Brevo and Plausible. Expect small numbers, since nothing has been promoted. That's fine.

### Month -5 — Genuine trust-building (weeks 5–8)

Help people. Zero self-promotion (Section 3c).

**Every week in month -5:**
- **Facebook groups (2–3 h):** answer 3–5 real questions properly: cutlists, edge banding (cant) deductions, hinge clearances, CNC files, board optimisation. Add to the question log.
- **Anchor customer:** keep talking with the 2–3 candidates as a peer. No pitch.

**Week 5 · 9 Nov · L−22**
- **Facebook Page:** first post, an educational tip ("Cum calculezi lățimea polițelor între laterale fără să greșești grosimea"). This is for future visitors, not reach.

**Week 6 · 16 Nov · L−21**
- **YouTube:** first short video (2–4 min), a generic trade tip filmed on a phone or screen (e.g. edge-banding deductions). Not about the app.
- **Offline:** introductory email to APMR, framed as learning: "I'm building a design tool for small workshops and would like to understand what members struggle with." No pitch.

**Week 7 · 23 Nov · L−20**
- **Facebook Page:** tip #2.
- **Validation (Section 3b):** start asking 5–10 people you've built rapport with, in private messages: what would make them try a new design tool, what they use now, and what feels like a fair monthly price. This decides the open free-plan and pricing questions in DECISIONS.md.

**Week 8 · 30 Nov · L−19** (1 December: National Day)
- **Offline:** visit 2–3 local workshops, with permission, and watch how they design and cut today. Best product research there is.
- **Monthly review.**

### Month -4 — First soft mentions + referral launch (weeks 9–13)

Start being open about the project, gently (Section 3c). Weeks 11–12 are the
holidays: no announcements.

**Week 9 · 7 Dec · L−18**
- **Facebook groups:** keep answering. Where it's genuinely relevant and the rules allow it, mention it in a comment: "lucrez chiar la ceva pentru problema asta" ("I'm working on something for exactly this problem"). No link unless asked.
- **Facebook Page:** first behind-the-scenes post: a WIP screenshot ("o privire în ce construim").

**Week 10 · 14 Dec · L−17**
- **Email:** first monthly "jurnal de construcție" (build log) to confirmed waitlist members. 150–250 words: what you built, what you learned from carpenters, one screenshot.
- **Facebook Page:** WIP #2.

**Weeks 11–12 · 21 Dec – 3 Jan · L−16 / L−15** (Christmas, New Year)
- **Facebook Page:** one light seasonal post.
- **Groups:** replies only.
- **Prepare week 13:** lawyer approval of the Privacy Policy, fill in the email settings, rebuild the emails.

**Week 13 · 4 Jan 2027 · L−14** — *referral launch*
- **Website:** publish Home + Privacy, switch the referral program on (Section 2).
- **Email:** to the waitlist, a new-year update with the invite program: "3 confirmed invites = a guaranteed place in the private beta."
- **Facebook Page:** announce the invite program. Pin it.
- **Facebook groups:** at most **one** own post per group this month, value-led (e.g. a tip plus one line about the beta), and only where allowed.
- **WhatsApp:** share your own invite link with carpenters you know personally.

### Month -3 — Private beta (weeks 14–17)

Only start once the product handles real projects. Better a month late than a
bad first impression with your future advocates (Section 3c).

**Week 14 · 11 Jan · L−13**
- **Beta selection (15–20 people):** everyone with 3+ confirmed invites (they were promised a place), the anchor customer, and the warmest group contacts. Invite each personally by email or phone.
- **Email:** build log #2 to the whole waitlist ("beta-ul privat a început").

**Weeks 15–17 · 18 Jan – 7 Feb · L−12 to L−10**
- **Concierge onboarding (Section 5.4):** 5–7 one-to-one sessions a week (~45 min each), building the tester's real project with them.
- **Ask permission** in each session to record the screen (future demo footage) and to quote them later.
- **Facebook Page:** weekly behind-the-scenes post ("ce am învățat din prima săptămână de beta"), with testers' permission.
- **Facebook groups:** keep answering questions (never stop this).

**Week 16 · 25 Jan · L−11** — *Founding Partner reservations open*
- **Website:** publish the Founding Partner page (Section 2).
- **Email:** "100 de locuri Founding Partner: rezervă-ți locul, fără plată acum."
- **Facebook Page:** the program post (co-creation framing, Section 5.4).

**Week 17 · 1 Feb · L−10**
- **Monthly review:** reservations, beta activation (first successful export, Section 4a), main feedback themes.

### Month -2 — Proof building (weeks 18–22)

**Week 18 · 8 Feb · L−9**
- **YouTube:** record demo 1 (design flow) using a real beta project (Launch Content Kit 2.1).
- **Blog:** publish post 1, "Program proiectare mobilă gratuit — ce opțiuni ai în 2026", after verifying every competitor fact.
- **Email:** build log #3.
- **Facebook groups:** where a question matches, link the blog post in a comment. It's a genuine answer.

**Week 19 · 15 Feb · L−8**
- **YouTube:** record demo 2 (AI assistant, Kit 2.2).
- **Blog:** post 2, "Cum faci cutlist pentru CNC fără să calculezi manual".

**Week 20 · 22 Feb · L−7**
- **YouTube:** record demo 3 (cutlist/CNC export, Kit 2.3). Upload all three.
- **Blog:** post 3, "Polyboard vs. alternative cloud-based".
- **Website:** publish the Demo page with the three videos.

**Week 21 · 1 Mar · L−6**
- **Testimonials:** add 3–5 real quotes (name, workshop, city) to the site.
- **Facebook Page:** testimonial post #1, tagging the tester if they agree.
- **Website:** publish the FAQ.
- **Facebook groups:** first demo-clip post in one or two groups where you're well known: "I've shown bits of this before; here's how it works now."

**Week 22 · 8 Mar · L−5**
- **Decide:** final prices, free-plan limits and Founding Partner terms (open questions 1–5 in DECISIONS.md), based on the beta.
- **Monthly review.**

### Month -1 — Countdown (weeks 23–26)

**Week 23 · 15 Mar · L−4**
- **Website:** publish Pricing and Terms.
- **Email:** launch date announced: "Pe 12 aprilie lansăm."
- **Facebook Page:** countdown #1 ("4 săptămâni").
- **Anchor customer:** agree how they'll take part at launch (a comment, a short video, their own post).

**Week 24 · 22 Mar · L−3**
- **Facebook Page:** countdown #2, a short demo clip.
- **YouTube:** tutorial #2 (from the question log).
- **Facebook groups:** a value post with the launch date at the end, where allowed.

**Week 25 · 29 Mar · L−2**
- **Facebook Page:** countdown #3, a testimonial.
- **Finalise the founder-story post** (Launch Content Kit 3.1), adapted for each group's rules.
- **Support:** FAQ and help answers ready for the 5–10 most likely questions (Section 4a).

**Week 26 · 5 Apr · L−1**
- **Email:** "Lansăm săptămâna viitoare", with the number of Founding Partner spots left.
- **Facebook Page:** countdown #4 ("săptămâna viitoare").
- **Final checks:** `npm run test:all`, `npm run check-launch`, a test payment, every email in Brevo.

### Launch month (weeks 27–30) — about 20 h/week

**Week 27 · 12 Apr · L+0** — *launch*
- **Day 1, morning:** set `productPublic = true` and deploy; the Founding Partner counter now counts paying spots.
- **Day 1:** founder-story post in each group, spread over the day and adapted per group (link in the comments where allowed). Same story on the Page, pinned.
- **Email:** to the whole waitlist: "Mobilcab e live — locurile Founding Partner sunt deschise."
- **Anchor customer:** comments and shares.
- **All week:** reply to every comment and message the same day. This week is mostly support.

**Week 28 · 19 Apr · L+1**
- **Facebook Page:** first real user project (with permission).
- **Concierge sessions** for new Founding Partners.
- **YouTube:** short "răspund la întrebările voastre" video from launch-week questions.

**Week 29 · 26 Apr · L+2**
- **Facebook Page:** "what we fixed in week 1" changelog post. Transparency builds trust.
- **Facebook groups:** replies only. Don't re-post the launch.

**Week 30 · 3 May · L+3** (Orthodox Easter 2 May 2027 [VERIFY], 1 May holiday: a light week)
- **Facebook Page:** one post.
- **Launch-month review:** sign-ups, Founding Partners, activation, top support questions.

### Phase 1 — Romania growth (weeks 31–39) — 8–10 h/week

Goal by week 39 (Marketing Plan Section 5): 100–300 users, 10–30 paying
Founding Partners, 2–3 case studies.

**Every week in Phase 1:** groups (2 h), Page posts (2 a week), support (2 h), metrics (1 h).

**Week 31 · 10 May · L+4**
- **Email:** first monthly changelog to paying users (Section 6a).
- **YouTube:** tutorial #3.
- **Blog:** post 4, from the most common question in the log.

**Week 32 · 17 May · L+5**
- **Case study #1:** with the anchor customer: the project, time saved, what changed.

**Week 33 · 24 May · L+6**
- **Facebook Page + groups:** publish case study #1.

**Week 34 · 31 May · L+7**
- **Offline:** a regional fair, or 3 workshop visits with a tablet demo.

**Week 35 · 7 Jun · L+8**
- **Email:** monthly newsletter to the free users and the waitlist.
- **YouTube:** tutorial #4.

**Week 36 · 14 Jun · L+9**
- **Retention (Section 6a):** personal "need help?" message to paying users inactive for 14+ days.

**Week 37 · 21 Jun · L+10** (Rusalii 20–21 June [VERIFY])
- **Blog:** post 5.
- **Facebook Page:** testimonial #2.

**Week 38 · 28 Jun · L+11**
- **Quarterly check-in** with every Founding Partner: a short call or message (Section 6a).

**Week 39 · 5 Jul · L+12**
- **Phase 1 review** against the goal above. Proceed to Phase 2 only with testimonials, case studies and some revenue (Section 7).

### Phase 2 — Growth + new segments (weeks 40–52) — 8–10 h/week

Designers/architects and manufacturers (Section 7). August is slow: a lighter
cadence, used to prepare autumn.

**Week 40 · 12 Jul · L+13**
- **LinkedIn:** company page and refreshed founder profile.
- **Designer/architect groups** (Facebook and LinkedIn): join and observe. The same trust process as with carpenters, shortened to 2–3 weeks.

**Week 41 · 19 Jul · L+14**
- **Case study #2.**
- **Designer angle:** client presentations, e.g. sharing a live design link, but only if the app really does this [VERIFY].

**Week 42 · 26 Jul · L+15**
- **Design schools:** contact 1–2 for a guest webinar in the autumn semester.

**Weeks 43–46 · 2–29 Aug · L+16 to L+19** (15 August holiday)
- **Lighter cadence:** 1 Page post and 1 YouTube video a week.
- **Prepare:** the webinar, a partnership one-pager (users, case studies).

**Week 44 · 9 Aug · L+17**
- **Partnerships:** write to fittings distributors (Blum, Hettich, GTV) and CNC sellers in Romania about co-marketing or hardware presets (Section 7).

**Week 47 · 30 Aug · L+20**
- **Manufacturers:** 5 direct LinkedIn conversations, using the case studies.

**Week 48 · 6 Sep · L+21**
- **Webinar** at a design school, or a Facebook Live demo.

**Week 49 · 13 Sep · L+22**
- **Blog:** a post for designers.
- **YouTube:** a video for designers.

**Week 50 · 20 Sep · L+23**
- **Trade show** slot (BIFE-SIM or a regional fair, if the dates found in week 4 fall here): attend as a visitor, demo on a tablet, aim for 20–30 conversations.

**Week 51 · 27 Sep · L+24**
- **Retention:** set up the win-back email for cancelled users (Section 6a). Plan the renewal reminders for Founding Partners: their 12 months end around April 2028.

**Week 52 · 4 Oct · L+25**
- **Year review:** which channel brought the most confirmed sign-ups and paying users, cost per customer (time counts), and plan year 2 (Europe research starts around month 10, Section 8).

---

## 4. Weekly routine (repeat every week)

| Day | Task | Time |
|---|---|---|
| Monday | Groups: answer new questions; update the question log | 45 min |
| Tuesday | Create this week's Page post or video | 1–2 h |
| Wednesday | Groups: answers; private conversations (anchor, validation) | 45 min |
| Thursday | Publish (Page / YouTube / blog) | 30 min |
| Friday | Numbers (below) + plan next week | 30 min |
| Ongoing | Reply to comments and messages within 24 h | — |

**Numbers to note every Friday** (one row a week in a spreadsheet):

| Number | Where |
|---|---|
| New confirmed sign-ups, and confirmation rate | Brevo; Plausible goals `Waitlist Signup` / `Waitlist Confirmed` |
| Sign-ups through invite links | Plausible `Waitlist Signup` with `invited: yes` |
| Founding Partner reservations | the counter / Brevo list |
| Questions answered in groups | your question log |
| Page followers; YouTube views and subscribers | Facebook / YouTube |
| Blog and Demo page visits; `blog_to_signup` clicks | Plausible |

From launch, add the Marketing Plan Section 9 metrics: activation (first
export), free → paid, monthly revenue, churn.

---

## 5. Content bank

Topics by type. Facebook Page posts are short (3–6 lines plus an image or
clip). Group content is mostly answers, not posts.

**Trade tips** (from week 5, always useful, never about the app)
1. Lățimea pieselor dintre laterale: de ce se scad două grosimi.
2. Cantul ABS de 2 mm: când și cât scazi din dimensiunea de debitare.
3. Rosturile ușilor: 2 mm sau 3 mm? Ce iei în calcul.
4. Balamale aplicate vs. semi-aplicate vs. interioare: diferențele de calcul.
5. Coliziunea sertar–balama: cum o eviți înainte de tăiere.
6. Dulapul de colț: trei soluții și dezavantajele fiecăreia.
7. Cum îți organizezi lista de debitare ca să nu greșești la transcriere.
8. Optimizarea plăcii: cât material pierzi de obicei și cum reduci.
9. Ce verifici la un fișier înainte să-l trimiți la CNC.
10. Cum măsori corect la client: lista de verificare.

**Behind the scenes** (from week 9)
11. WIP screenshot: "a feature a carpenter in a group asked for".
12. "What I learned visiting three workshops."
13. "Why the app runs in the browser" (the founder's reason).
14. Build log highlights from the monthly email.

**Proof** (from week 18)
15. The three demo clips, each cut to a 30–60 s version for the Page.
16. Testimonials (with permission): name, workshop, city, one concrete result.
17. Case studies: one real project, before vs. after.
18. "Answering your questions" videos from the question log.

**Community** (from week 13)
19. The invite program: what you get for 1 and 3 confirmed invites.
20. Questions to the audience ("Ce program folosiți acum pentru bucătării?"). These also feed the validation.
21. Spotlight on a beta tester's workshop (with permission).
22. "You asked, we built" (Section 6a).

**Launch** (weeks 23–30)
23. Countdown posts 4, 3, 2, 1.
24. The founder-story post (Launch Content Kit 3.1).
25. Spots left: "X din 100 locuri Founding Partner".
26. "What we fixed in week 1."

---

## 6. Dependencies — what has to be ready, and by when

| Needed by | What | Owner |
|---|---|---|
| Week 1 | Git + GitHub, Vercel, domain, Brevo setup, Plausible | Founder |
| Week 12 | Lawyer-approved Privacy Policy (blocks the referral launch) | Lawyer |
| Week 14 | The product ready for real projects (blocks the private beta) | Founder |
| Week 16 | Founding Partner open questions 2–3 decided | Founder |
| Weeks 18–20 | Demo videos recorded | Founder |
| Week 21 | Open questions 4–5 answered (FAQ); testimonial permissions | Founder |
| Week 22 | Final prices and free-plan limits (open question 1) | Founder |
| Week 23 | Lawyer-approved Terms; **Stripe payments built into the site** | Lawyer / development |

If one of these slips, move that week's announcement, not the trust-building
work around it.
