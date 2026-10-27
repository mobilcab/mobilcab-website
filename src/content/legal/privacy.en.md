*Last updated: [FILL IN date]*

> **Draft for legal review — not published.** Until then, the site shows a short temporary notice. Markers: **[FILL IN]** = information only the founder has; **[VERIFY]** = to confirm with the lawyer or the provider; **[TO DECIDE]** = a decision still open (see `docs/DECISIONS.md`).

## 1. Who we are

The mobilcab.com website and the Mobilcab app are operated by **[FILL IN company name]**, registered at **[FILL IN address]**, tax ID (CUI) **[FILL IN]**, Trade Register no. **[FILL IN]** ("Mobilcab", "we"). We are the controller of your personal data under Regulation (EU) 2016/679 ("GDPR").

For any question about your data, write to us at **[FILL IN email address]**.

## 2. The waitlist

When you sign up to hear about the launch, we collect:

- your email address;
- the language you signed up in (Romanian or English);
- the date you signed up and the fact that you gave consent.

We use this only to tell you when Mobilcab launches and, occasionally, to send you product news.

**Confirmation.** Right after you sign up, we send you an email with a confirmation link. We only add you to the list once you click it. If you don't confirm, we keep your address only as long as the link needs to work, and delete it within 30 days at most [VERIFY period].

**The legal basis** is your consent (Article 6(1)(a) GDPR and Article 12 of Romanian Law no. 506/2004 [VERIFY]). You can withdraw it at any time with the unsubscribe link in any email, or by writing to us. Withdrawing doesn't affect processing that happened before.

**The invite program.** Everyone who signs up gets a personal invite code. If you sign up through someone's link, we record that person's code, and once you confirm your address we increase their count of confirmed invites. We use this only to give the program's rewards (a better place in the queue, or a guaranteed place in the private beta). The person who invited you only sees how many confirmed invites they have, not who signed up through their link. The legal basis is the consent you give when signing up [VERIFY: or legitimate interest].

## 3. Founding Partner reservations

When you reserve a spot in the Founding Partner program, we collect:

- your full name;
- your email address;
- your workshop name (optional);
- your city;
- the language you signed up in and the fact that you gave consent.

We use this to hold your spot, contact you personally when access opens, and send you news about the program. Reserving is free and doesn't commit you to anything.

**The legal basis** is your consent and the steps we take, at your request, before a possible contract (Article 6(1)(a) and (b) GDPR) [VERIFY].

## 4. Your account and the app

[VERIFY — this section describes the app as it is in the code on 2026-10-27 (mobilcab-cad, `develop`). Re-check before publishing and confirm with the lawyer.]

When you create an account and use the app, we process:

- **account data:** your email address, your password (stored by the authentication provider only in encrypted form; we can't see it) and, if you fill it in when signing up, your name;
- **your projects:** the designs you create, so we can save them and make them available on all your devices. They may contain your own clients' data (names, dimensions, prices) — you decide what you enter. Until you save, a draft of the project stays in your browser;
- **your settings:** your working preferences (for example the unit of measure or panel widths) and saved presets, tied to your account;
- **problem reports:** when you press "Report a problem", we **automatically** send the team the technical context we need to reproduce the issue: the app version, environment and interface language; your account's email, identifier, plan and role; your browser, window size, screen density, graphics card (WebGL renderer) and, if the browser reports it, device memory; the project's identifier and name, the number of elements by type, the selected element (identifier, type and its dimensions), the active tab and tool, the unit of measure; and your latest commands (type and identifier, no content) and the app's recent errors. **Only if you tick the box**, we also attach a capture of the 3D view or the whole project file. The report reaches us, through a function of ours, as a task in ClickUp;
- **payment data:** payments are processed by Paddle, which acts as the merchant of record; we don't see or store your card details, only information about your subscription and invoices;
- **transactional emails** (for example confirmations and notices about your account or request), sent through Brevo;
- **AI assistant and AI model training:** [VERIFY — the app has no AI assistant today and sends no data to an AI provider; keep this paragraph only if it's decided.] We reserve the right to use project data, **anonymised and aggregated**, to develop future AI-assisted generation features. You can **opt out** from your account [VERIFY: the option doesn't exist in the app yet] — for people who don't opt out, the legal basis is legitimate interest (Article 6(1)(f) GDPR), with a right to object. This is a right reserved for the future, not an active processing today.

**The legal basis:** your account and projects — performing our contract with you (Article 6(1)(b) GDPR); problem reports — our legitimate interest in diagnosing and fixing errors (Article 6(1)(f) GDPR); the 3D capture and project file attached to a report — your consent, given by the tick box in the dialog (Article 6(1)(a) GDPR); invoices — our legal tax obligations (Article 6(1)(c) GDPR).

**Export and account deletion.** From the account menu you can download your data (account, projects, presets and settings) as a file, and delete your account. Deleting removes the account and its associated data from the live database. For anything else, write to the address in section 1.

## 5. Visit statistics

We use Plausible Analytics to know how many people visit the site, which pages they read and how many sign up. Plausible uses no cookies and stores no personal data: your IP address is only used to generate an anonymous identifier that changes daily, and is not saved [VERIFY]. The site also uses Vercel Web Analytics for page-view counts, also without cookies or individual profiles [VERIFY with Vercel; in the code, `@vercel/analytics` is active in `Base.astro`, so there are two tools, not one]. We only see aggregate statistics. The app has no third-party analytics (checked in the code on 2026-10-27). The legal basis is our legitimate interest in understanding whether the site works (Article 6(1)(f) GDPR).

## 6. Videos

The site shows demo videos hosted on YouTube (Google). Until you press play, only the video's preview image loads, from YouTube's servers. The player only loads once you press play, from the "youtube-nocookie.com" domain, and from then on YouTube may store information on your device and processes data under its own privacy policy [VERIFY: how privacy-enhanced mode behaves, and Google's role as an independent controller].

## 7. Technical data

Like any website, the servers hosting it automatically receive technical data about each request (IP address, browser type, page requested, time). This is needed to run the site and protect it from abuse, and is kept for a short period in the hosting provider's logs [VERIFY Vercel's retention]. The legal basis is our legitimate interest (Article 6(1)(f) GDPR).

## 8. Cookies

The site uses no cookies and stores nothing on your device. Exceptions:

- the YouTube player, after you press play (see section 6);
- in the app, the login session, kept in the browser's storage (localStorage or sessionStorage, depending on what you choose when signing in), the project draft and local settings. They are strictly necessary for the app to work, so they don't require consent. We use no tracking or advertising cookies on the site or in the app, so we show no cookie banner; if third-party analytics is added, the decision is revisited [VERIFY with the lawyer].

## 9. Who else can access the data

We don't sell or rent your data, and we don't use it for advertising. We work with the following providers, who process data only on our behalf and on our instructions:

| Provider | Role | Where the data is |
|---|---|---|
| Brevo (Sendinblue SAS, France) | The waitlist, Founding Partner reservations and sending emails, including the app's transactional ones | European Union [VERIFY] |
| Plausible Insights OÜ (Estonia) | Visit statistics, no personal data | European Union [VERIFY] |
| Vercel Inc. (USA) | Hosting of the website and the app; page-view statistics (Web Analytics) | [VERIFY: region]; transfers outside the EU rely on [VERIFY: EU–US Data Privacy Framework / Standard Contractual Clauses] |
| Supabase | Authentication, the database of accounts, projects and settings, the function that receives problem reports | Ireland, EU (region `eu-west-1`, checked in the Supabase console on 2026-10-27, for both the development and production environments); the provider is a US company, so [VERIFY: DPA and the transfer basis, if there is access from outside the EU] |
| ClickUp (Mango Technologies, Inc., USA) | Receives problem reports as tasks, with your email and the technical context above | [VERIFY: workspace region]; if not in the EU, [VERIFY: standard contractual clauses / DPA] |
| Paddle | Payment processing (merchant of record) | [VERIFY] |
| [FILL IN AI provider] | Only if an AI assistant is introduced; there is none today | — |

YouTube (Google) processes data as an independent controller, only if you start a video.

In emails sent through Brevo, we can see whether an email was opened and whether a link was clicked, so we know which information is useful [VERIFY whether tracking stays on].

## 10. How long we keep data

- **Unconfirmed sign-ups:** 30 days at most [VERIFY].
- **Waitlist and invite-program data:** until you unsubscribe or ask us to delete it. If we send you no email for 24 months, or if Mobilcab doesn't launch, we delete the list [VERIFY period].
- **Founding Partner reservations:** until access opens and you decide whether to continue. If you don't continue, we delete the reservation data within 6 months at most [VERIFY period].
- **Account and projects:** for as long as you have an account. When you delete the account from the app, the data disappears at once from the live database; the provider's backups expire gradually, within [FILL IN — proposed 30 days] at most [VERIFY Supabase's backup period].
- **Problem reports:** the ClickUp task (including your email and the technical context) is kept as long as it's useful for diagnosis [FILL IN period]; you can have it deleted by writing to us. Deleting your account doesn't automatically remove the ClickUp tasks [VERIFY — to decide whether to add automatic deletion].
- **Invoices:** for as long as tax law requires [VERIFY: 10 years].
- **After you unsubscribe** we keep only your email address on a suppression list, so we don't write to you again by mistake.
- **Technical data:** the short period described above.

## 11. Your rights

Under the GDPR you have the right to:

- find out what data we hold about you and get a copy;
- have it corrected;
- have it deleted;
- restrict how it's processed;
- receive it in a structured format (portability);
- object to processing based on our legitimate interest;
- withdraw your consent at any time.

Getting a copy of your account data and deleting your account can be done directly in the app (see section 4). For any of your rights, including for problem reports, write to **[FILL IN email address]**. We reply within one month.

If you're unhappy with how we handle your data, you can complain to the Romanian data protection authority, ANSPDCP, B-dul G-ral. Gheorghe Magheru nr. 28-30, sector 1, Bucharest, www.dataprotection.ro [VERIFY].

## 12. Security

The site and the app only work over encrypted connections (HTTPS). Access to data is limited to the people who need it to provide the service.

## 13. Children

Mobilcab is aimed at professionals and is not intended for anyone under 16 (an account requires being at least 18, under the Terms). We don't knowingly collect data about children.

## 14. Changes

If we change this policy, we'll publish the new version on this page and update the date above. If the changes are significant, we'll tell you by email.
