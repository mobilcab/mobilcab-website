// Generates the social share images (public/og-ro.png, public/og-en.png).
// Run with `npm run og` after changing the headline or value prop in src/i18n/*.json.
//
// Lays the image out as HTML with the site's own Manrope font, then screenshots it
// with a locally installed Edge or Chrome in headless mode. Set BROWSER_PATH to
// point at a different Chromium-based browser.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const fontDir = join(root, 'node_modules/@fontsource-variable/manrope/files');

const browser = [
  process.env.BROWSER_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((p) => p && existsSync(p));

if (!browser) {
  console.error('No Edge or Chrome found. Set BROWSER_PATH to a Chromium-based browser.');
  process.exit(1);
}

// Inline the font so the page has no file:// font loads to be blocked.
const fontFace = (subset, range) => {
  const data = readFileSync(join(fontDir, `manrope-${subset}-wght-normal.woff2`)).toString('base64');
  return `@font-face { font-family: Manrope; font-weight: 200 800; src: url(data:font/woff2;base64,${data}) format('woff2'); unicode-range: ${range}; }`;
};
const fonts = [
  fontFace('latin', 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'),
  fontFace('latin-ext', 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF'),
].join('\n');

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const page = ({ headline, valueProp }) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
${fonts}
* { margin: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; overflow: hidden; }
body {
  font-family: Manrope, sans-serif; color: #1d2126; background-color: #f7f6f3;
  background-image: linear-gradient(to right, rgb(29 33 38 / 0.06) 1.5px, transparent 1.5px),
                    linear-gradient(to bottom, rgb(29 33 38 / 0.06) 1.5px, transparent 1.5px);
  background-size: 30px 30px;
  padding: 80px; display: flex; flex-direction: column; justify-content: space-between;
  -webkit-font-smoothing: antialiased;
}
.brand { display: flex; align-items: center; gap: 14px; font-size: 36px; font-weight: 600; letter-spacing: -0.025em; }
.dim { position: relative; width: 96px; height: 18px; border-inline: 3px solid #9a5f1a; margin-bottom: 30px; }
.dim::after { content: ""; position: absolute; inset-inline: 0; top: 50%; height: 3px; margin-top: -1.5px; background: #9a5f1a; }
h1 { font-size: 68px; line-height: 1.12; font-weight: 700; letter-spacing: -0.025em; text-wrap: balance; max-width: 1040px; }
p { margin-top: 26px; font-size: 32px; font-weight: 500; color: #4a5059; }
</style></head><body>
<div class="brand">
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke-width="1.75">
    <rect x="3" y="2.5" width="18" height="19" rx="1.5" stroke="#1d2126"/>
    <path d="M12 2.5v19" stroke="#1d2126"/>
    <path d="M9.25 10.5v3M14.75 10.5v3" stroke="#9a5f1a" stroke-width="2" stroke-linecap="round"/>
  </svg>
  mobilcab
</div>
<div>
  <div class="dim"></div>
  <h1>${escape(headline)}</h1>
  <p>${escape(valueProp)}</p>
</div>
</body></html>`;

const work = mkdtempSync(join(tmpdir(), 'mobilcab-og-'));
try {
  for (const lang of ['ro', 'en']) {
    const dict = JSON.parse(readFileSync(join(root, `src/i18n/${lang}.json`), 'utf8'));
    const html = join(work, `${lang}.html`);
    const out = join(root, `public/og-${lang}.png`);
    writeFileSync(html, page(dict.hero));
    execFileSync(browser, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1200,630',
      '--virtual-time-budget=3000',
      `--user-data-dir=${join(work, 'profile')}`,
      `--screenshot=${out}`,
      pathToFileURL(html).href,
    ], { stdio: 'ignore' });
    console.log(`wrote public/og-${lang}.png`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
