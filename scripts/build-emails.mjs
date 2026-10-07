// Builds the Brevo email templates into emails/*.html (`npm run emails`).
//
//   confirm-ro.html / confirm-en.html                      — double opt-in confirmation (transactional)
//   waitlist-ro.html / waitlist-en.html                    — after a waitlist sign-up is confirmed
//   founding-partner-ro.html / founding-partner-en.html    — after a Founding Partner reservation
//
// Copy is adapted from Launch Content Kit Section 4 (see emails/README.md for
// what changed and why). Settings (founder name, company line, demo link) come
// from EMAIL_SETTINGS in src/config.ts.
//
// Email HTML is deliberately old-fashioned: tables, inline styles and system
// fonts, because Gmail, Outlook and phone mail apps ignore most modern CSS.
// Personalisation and the unsubscribe link use Brevo's template syntax:
// {{ contact.FIRSTNAME }}, {{ unsubscribe }}.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

// Read EMAIL_SETTINGS from src/config.ts without a TypeScript toolchain: it's a
// plain object literal of strings.
const config = readFileSync(`${root}src/config.ts`, 'utf8');
const block = config.match(/EMAIL_SETTINGS = \{([\s\S]*?)\};/)?.[1] ?? '';
const setting = (key) => block.match(new RegExp(`${key}:\\s*'([^']*)'`))?.[1] ?? '';
const settings = {
  founderName: setting('founderName'),
  companyLine: setting('companyLine'),
  siteUrl: setting('siteUrl') || 'https://mobilcab.ro',
  demoUrl: setting('demoUrl'),
};

const referralProgram = /export const REFERRAL_PROGRAM = true;/.test(config);
const referralGoal = config.match(/export const REFERRAL_GOAL = (\d+);/)?.[1] ?? '3';

const missing = Object.entries({ founderName: settings.founderName, companyLine: settings.companyLine })
  .filter(([, v]) => !v)
  .map(([k]) => k);
if (missing.length) {
  console.warn(`! EMAIL_SETTINGS in src/config.ts is missing: ${missing.join(', ')}. The emails show [COMPLETEAZĂ] markers until it's filled in.`);
}
const fill = (value, lang) => value || (lang === 'ro' ? '[COMPLETEAZĂ]' : '[FILL IN]');

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const colors = { paper: '#f7f6f3', ink: '#1d2126', graphite: '#4a5059', line: '#d9d6cf', wood: '#9a5f1a' };
const font = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const p = (html, extra = '') =>
  `<p style="margin:0 0 16px;font-family:${font};font-size:16px;line-height:1.6;color:${colors.graphite};${extra}">${html}</p>`;

const steps = (items) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 16px;">${items
    .map(
      (item, i) => `
  <tr>
    <td valign="top" width="32" style="padding:0 0 10px;font-family:${font};font-size:15px;font-weight:700;color:${colors.wood};">${i + 1}.</td>
    <td valign="top" style="padding:0 0 10px;font-family:${font};font-size:16px;line-height:1.5;color:${colors.ink};">${item}</td>
  </tr>`,
    )
    .join('')}
</table>`;

const button = (href, label) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;">
  <tr>
    <td bgcolor="${colors.wood}" style="border-radius:6px;">
      <a href="${escape(href)}" style="display:inline-block;padding:13px 22px;font-family:${font};font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:6px;">${label}</a>
    </td>
  </tr>
</table>`;

function layout({ lang, subject, preheader, body, reason, transactional = false }) {
  const unsubscribe = lang === 'ro' ? 'Dezabonează-te' : 'Unsubscribe';
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${escape(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${colors.paper};">
<!-- Subject (set it in Brevo): ${escape(subject)} -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(preheader)}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="${colors.paper}">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;">
        <tr>
          <td style="padding:0 4px 20px;font-family:${font};font-size:20px;font-weight:700;letter-spacing:-0.02em;color:${colors.ink};">mobilcab</td>
        </tr>
        <tr>
          <td bgcolor="#ffffff" style="border:1px solid ${colors.line};border-top:4px solid ${colors.wood};border-radius:6px;padding:32px 28px 16px;">
${body}
          </td>
        </tr>
        <tr>
          <td style="padding:20px 4px 0;font-family:${font};font-size:12px;line-height:1.6;color:${colors.graphite};">
            ${reason}<br>
            ${escape(fill(settings.companyLine, lang))}${
              transactional ? '' : `<br>\n            <a href="{{ unsubscribe }}" style="color:${colors.graphite};text-decoration:underline;">${unsubscribe}</a>`
            }
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;
}

const site = settings.siteUrl.replace(/\/$/, '');
const signature = (lang) =>
  p(
    lang === 'ro'
      ? `Pe curând,<br><strong style="color:${colors.ink};">${escape(fill(settings.founderName, lang))}</strong>, fondator Mobilcab`
      : `Talk soon,<br><strong style="color:${colors.ink};">${escape(fill(settings.founderName, lang))}</strong>, Mobilcab founder`,
  );
const demoLine = (lang) =>
  settings.demoUrl
    ? p(
        lang === 'ro'
          ? `Până atunci, poți vedea cum funcționează aici: <a href="${escape(settings.demoUrl)}" style="color:${colors.wood};font-weight:700;">clipurile demo</a>.`
          : `In the meantime, here's a quick look at how it works: <a href="${escape(settings.demoUrl)}" style="color:${colors.wood};font-weight:700;">the demo clips</a>.`,
      )
    : '';

// Only while REFERRAL_PROGRAM is on: the person's invite link and progress page.
// {{ contact.REFCODE }} is their invite code (a Brevo contact attribute).
const referralBlock = (lang) => {
  if (!referralProgram) return '';
  const home = lang === 'ro' ? '/ro/' : '/en/';
  const status = lang === 'ro' ? '/ro/confirmat/' : '/en/confirmed/';
  const invite = `${site}${home}?ref={{ contact.REFCODE }}`;
  return [
    p(lang === 'ro' ? 'Invită alți tâmplari:' : 'Invite other carpenters:', `font-weight:700;color:${colors.ink};margin-bottom:10px;`),
    p(
      lang === 'ro'
        ? `Pentru fiecare tâmplar care se înscrie prin linkul tău și își confirmă adresa, urci în coada pentru beta-ul privat. La ${referralGoal} invitații confirmate, ai un loc garantat. Linkul tău: <a href="${invite}" style="color:${colors.wood};font-weight:700;word-break:break-all;">${invite}</a>`
        : `For every carpenter who signs up through your link and confirms, you move up the queue for the private beta. At ${referralGoal} confirmed invites, your place is guaranteed. Your link: <a href="${invite}" style="color:${colors.wood};font-weight:700;word-break:break-all;">${invite}</a>`,
    ),
    button(`${site}${status}?cod={{ contact.REFCODE }}`, lang === 'ro' ? 'Vezi câte invitații ai' : 'See your invites'),
  ].join('\n');
};

const templates = {
  // Double opt-in: sent by the site through Brevo's transactional API, with the
  // confirmation link as {{ params.CONFIRM_URL }}. Not a marketing email, so
  // it carries no unsubscribe link.
  'confirm-ro': {
    lang: 'ro',
    subject: 'Confirmă-ți înscrierea la Mobilcab',
    preheader: 'Un singur clic și ești pe lista de așteptare.',
    reason: 'Primești acest email pentru că cineva a introdus adresa ta în formularul de pe mobilcab.ro. Dacă nu ai fost tu, ignoră-l: fără confirmare, nu te adăugăm pe nicio listă.',
    transactional: true,
    body: [
      p('Salut,'),
      p('Apasă pe butonul de mai jos ca să-ți confirmi înscrierea pe lista de așteptare Mobilcab.'),
      button('{{ params.CONFIRM_URL }}', 'Confirmă înscrierea'),
      p('Linkul e valabil 7 zile.', 'font-size:14px;'),
    ].join('\n'),
  },
  'confirm-en': {
    lang: 'en',
    subject: 'Confirm your Mobilcab sign-up',
    preheader: "One click and you're on the waitlist.",
    reason: "You're receiving this email because someone entered your address on mobilcab.ro. If it wasn't you, ignore it: without confirmation, we don't add you to any list.",
    transactional: true,
    body: [
      p('Hi,'),
      p('Click the button below to confirm your sign-up to the Mobilcab waitlist.'),
      button('{{ params.CONFIRM_URL }}', 'Confirm my sign-up'),
      p('The link is valid for 7 days.', 'font-size:14px;'),
    ].join('\n'),
  },
  'waitlist-ro': {
    lang: 'ro',
    subject: 'Ești pe listă! Iată ce urmează 🛠️',
    preheader: 'Mulțumesc că te-ai înscris. Iată ce urmează până la lansare.',
    reason: 'Primești acest email pentru că te-ai înscris pe lista de așteptare de pe mobilcab.ro.',
    body: [
      p('Salut,'),
      p('Mulțumesc că te-ai înscris pe lista de așteptare Mobilcab!'),
      p(
        'Ești printre primii care vor afla când deschidem accesul. Primii 100 de tâmplari vor primi prețul Founding Partner, blocat 12 luni — iar tu afli primul când se deschid locurile.',
      ),
      p('Ce urmează:', `font-weight:700;color:${colors.ink};margin-bottom:10px;`),
      steps([
        'Te anunț personal când deschidem accesul pentru primii utilizatori.',
        'Îți arăt un ghid rapid de 10 minute ca să faci primul tău proiect.',
        'Îți cer sincer părerea — ce merge, ce nu, ce ai vrea să vezi.',
      ]),
      demoLine('ro'),
      referralBlock('ro'),
      signature('ro'),
    ].join('\n'),
  },
  'waitlist-en': {
    lang: 'en',
    subject: "You're on the list! Here's what happens next 🛠️",
    preheader: "Thanks for signing up. Here's what happens before launch.",
    reason: 'You are receiving this email because you joined the waitlist on mobilcab.ro.',
    body: [
      p('Hi,'),
      p('Thanks for joining the Mobilcab waitlist!'),
      p(
        "You're among the first to hear when access opens. The first 100 workshops will get Founding Partner pricing, locked for 12 months — and you'll be the first to know when spots open.",
      ),
      p('What happens next:', `font-weight:700;color:${colors.ink};margin-bottom:10px;`),
      steps([
        "I'll let you know personally when access opens for the first users.",
        'A quick 10-minute guide to help you build your first project.',
        "I'll genuinely ask for your feedback — what works, what doesn't, what you'd want to see.",
      ]),
      demoLine('en'),
      referralBlock('en'),
      signature('en'),
    ].join('\n'),
  },
  'founding-partner-ro': {
    lang: 'ro',
    subject: 'Locul tău de Founding Partner e rezervat 🛠️',
    preheader: 'Ți-am păstrat locul. Iată ce înseamnă și ce urmează.',
    reason: 'Primești acest email pentru că ți-ai rezervat un loc în programul Founding Partner pe mobilcab.ro.',
    body: [
      p('Salut, {{ contact.FIRSTNAME }},'),
      p('Mulțumesc că ți-ai rezervat locul în programul Founding Partner! Ești printre primii 100 de tâmplari care construiesc Mobilcab alături de noi.'),
      p('Ce înseamnă rezervarea:', `font-weight:700;color:${colors.ink};margin-bottom:10px;`),
      steps([
        'Prețul Founding Partner pentru planul Basic: 49 RON/lună sau 549 RON/an, blocat 12 luni.',
        'Nu plătești nimic acum. Plata se face abia când primești acces, iar rezervarea nu te obligă la nimic.',
        'Ai un cuvânt de spus în ce construim mai departe.',
      ]),
      p('Ce urmează:', `font-weight:700;color:${colors.ink};margin-bottom:10px;`),
      steps([
        'Te contactez personal când deschidem accesul pentru Founding Partners.',
        'Dacă vrei, facem împreună primul tău proiect, la telefon sau pe video.',
        'Îți cer sincer părerea — ce merge, ce nu, ce ai vrea să vezi.',
      ]),
      button(`${site}/ro/founding-partner/`, 'Despre programul Founding Partner'),
      signature('ro'),
    ].join('\n'),
  },
  'founding-partner-en': {
    lang: 'en',
    subject: 'Your Founding Partner spot is reserved 🛠️',
    preheader: "We've held your spot. Here's what it means and what happens next.",
    reason: 'You are receiving this email because you reserved a spot in the Founding Partner program on mobilcab.ro.',
    body: [
      p('Hi {{ contact.FIRSTNAME }},'),
      p("Thanks for reserving your spot in the Founding Partner program! You're among the first 100 workshops building Mobilcab with us."),
      p('What your reservation means:', `font-weight:700;color:${colors.ink};margin-bottom:10px;`),
      steps([
        'Founding Partner pricing for the Basic plan: 49 RON/month or 549 RON/year, locked for 12 months.',
        "Nothing to pay now. You only pay once you get access, and the reservation doesn't commit you to anything.",
        'You get a real say in what we build next.',
      ]),
      p('What happens next:', `font-weight:700;color:${colors.ink};margin-bottom:10px;`),
      steps([
        "I'll contact you personally when Founding Partner access opens.",
        "If you'd like, we'll build your first project together, by phone or video call.",
        "I'll genuinely ask for your feedback — what works, what doesn't, what you'd want to see.",
      ]),
      button(`${site}/en/founding-partner/`, 'About the Founding Partner program'),
      signature('en'),
    ].join('\n'),
  },
};

mkdirSync(`${root}emails`, { recursive: true });
for (const [name, template] of Object.entries(templates)) {
  writeFileSync(`${root}emails/${name}.html`, layout(template));
  console.log(`wrote emails/${name}.html   (subject: ${template.subject})`);
}
