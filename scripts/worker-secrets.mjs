// Pushes the runtime secrets from the environment to the site Worker.
// Run by .github/workflows/cloudflare-worker-deploy.yml before every deploy, so
// GitHub Secrets stay the single place these are edited.
//
// Names are skipped when missing on purpose: an empty `wrangler secret put` would
// write an empty value and silently break sign-ups, instead of failing loudly.
//
// Locally: `node scripts/worker-secrets.mjs` reads the same names from the shell.
import { spawnSync } from 'node:child_process';

const NAMES = [
  'BREVO_API_KEY',
  'BREVO_LIST_ID',
  'BREVO_LIST_ID_EN',
  'BREVO_FP_LIST_ID',
  'BREVO_CONFIRM_TEMPLATE_ID_RO',
  'BREVO_CONFIRM_TEMPLATE_ID_EN',
  'CONFIRM_SECRET',
  'CRON_SECRET',
  'NEON_DATA_API_URL',
];

const present = Object.fromEntries(NAMES.filter((name) => process.env[name]).map((name) => [name, process.env[name]]));
const missing = NAMES.filter((name) => !process.env[name]);

if (missing.length) console.log(`Skipped (not set in the environment): ${missing.join(', ')}`);
if (!Object.keys(present).length) {
  console.log('No secrets to push.');
  process.exit(0);
}

const envArgs = process.env.WRANGLER_ENV ? ['--env', process.env.WRANGLER_ENV] : [];
const run = (args, input) => {
  const res = spawnSync('npx', ['wrangler', ...args, ...envArgs], { input, stdio: ['pipe', 'inherit', 'inherit'], shell: process.platform === 'win32' });
  if (res.status !== 0) process.exit(res.status ?? 1);
};

// JSON is piped through stdin rather than a file, so no plaintext secret ever
// lands on the runner's disk.
run(['secret', 'bulk'], JSON.stringify(present));
console.log(`Pushed ${Object.keys(present).length} secret(s) to the Worker.`);
