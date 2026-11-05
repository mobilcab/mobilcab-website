// Recreates the `mobilcab.com` zone records that Vercel DNS serves today, in
// Cloudflare, so switching the registrar nameservers is a no-op for everything
// except the hostnames we deliberately cut over later.
//
// The inventory below was read from `GET /v4/domains/mobilcab.com/records`
// (Vercel) on 2026-11-05. Keep it in sync if Vercel DNS changes before the
// nameserver switch — after the switch Vercel no longer serves the zone.
//
//   node scripts/cloudflare-dns.mjs            # dry run: shows the diff
//   node scripts/cloudflare-dns.mjs --apply    # creates the missing records
//
// Needs CLOUDFLARE_API_TOKEN with Zone:Read + DNS:Edit on `mobilcab.com`, and
// CLOUDFLARE_ACCOUNT_ID. The zone itself must already be added to the account
// (Tokens with Zone:Edit can create it too; a Workers-only token cannot).
//
// It only ever creates records. It never updates or deletes one, so a wrong
// entry here cannot silently rewrite live DNS: drift is reported, not "fixed".

import { fileURLToPath } from 'node:url';

const ZONE_NAME = 'mobilcab.com';

// `proxied: false` everywhere on purpose. The zone move must not change how
// any hostname behaves: apex and `*` keep resolving to Vercel, `develop` and
// `staging` keep resolving to Cloudflare Pages, and mail keeps flowing through
// ImprovMX/Brevo. Proxying is a later, per-hostname decision (it also changes
// which CAs may issue, hence the CAA records below).
const RECORDS = [
  // Apex currently points at a deployment-specific Vercel target (ALIAS).
  // Cloudflare has no ALIAS type: a CNAME at the apex is flattened, which is
  // the equivalent behaviour.
  { type: 'CNAME', name: '@', content: '5e35b3f051753896.vercel-dns-017.com' },
  // Wildcard — this is what serves `app.mobilcab.com` (the CAD app on Vercel).
  { type: 'CNAME', name: '*', content: 'cname.vercel-dns-017.com' },

  { type: 'CAA', name: '@', content: '0 issue "pki.goog"' },
  { type: 'CAA', name: '@', content: '0 issue "letsencrypt.org"' },
  { type: 'CAA', name: '@', content: '0 issue "sectigo.com"' },

  // Brevo DKIM, one CNAME per selector.
  { type: 'CNAME', name: 'brevo1._domainkey', content: 'b1.mobilcab-com.dkim.brevo.com' },
  { type: 'CNAME', name: 'brevo2._domainkey', content: 'b2.mobilcab-com.dkim.brevo.com' },

  // The CAD app environments, served by Cloudflare Pages.
  { type: 'CNAME', name: 'develop', content: 'mobilcab-cad.pages.dev' },
  { type: 'CNAME', name: 'staging', content: 'mobilcab-cad-staging.pages.dev' },

  // Mail (ImprovMX forwarders). Cloudflare keeps MX priority in its own field.
  { type: 'MX', name: '@', content: 'mx1.improvmx.com', priority: 10 },
  { type: 'MX', name: '@', content: 'mx2.improvmx.com', priority: 20 },

  { type: 'TXT', name: '@', content: 'google-site-verification=1H8iqmCgSZ8IXLt0kRnX2ctx6ZNrXXJgv7NBs3_6Ll0' },
  { type: 'TXT', name: '@', content: 'brevo-code:938683f92fbce9e0f2ccc9665dae0e56' },
  { type: 'TXT', name: '@', content: 'v=spf1 include:spf.improvmx.com include:spf.brevo.com ~all' },
  { type: 'TXT', name: '_dmarc', content: 'v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com' },

  // Vercel domain-verification leftovers. Harmless and still useful while
  // Vercel serves `app.mobilcab.com`; drop them in the decommissioning step.
  { type: 'TXT', name: '_vercel', content: 'vc-domain-verify=mobilcab.com,7145208f22784c5c7209' },
  { type: 'TXT', name: '_vercel', content: 'vc-domain-verify=www.mobilcab.com,5c30a1b370d21a3e98e3' },
];

const TTL = 60;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

// Absolute name as Cloudflare reports it ("mobilcab.com", "*.mobilcab.com").
const fqdn = (name) => (name === '@' ? ZONE_NAME : `${name}.${ZONE_NAME}`);
const relative = (name) => {
  if (name === ZONE_NAME) return '@';
  const suffix = `.${ZONE_NAME}`;
  return name.endsWith(suffix) ? name.slice(0, -suffix.length) : name;
};
// Cloudflare returns TXT content wrapped in quotes; compare the payload only.
const sameValue = (a, b) =>
  String(a ?? '').replace(/^"(.*)"$/, '$1') === String(b ?? '').replace(/^"(.*)"$/, '$1');

async function api(path, init = {}) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${apiToken}`,
      'content-type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || body?.success === false) {
    const detail = body?.errors?.map((e) => `${e.code}: ${e.message}`).join('; ') || res.statusText;
    throw new Error(`${init.method ?? 'GET'} ${path} -> ${res.status} ${detail}`);
  }
  return body.result;
}

async function main() {
  if (!apiToken) {
    console.error('CLOUDFLARE_API_TOKEN is not set (source .secrets/cloudflare.env first).');
    return 1;
  }
  const apply = process.argv.includes('--apply');

  const zones = await api(`/zones?name=${ZONE_NAME}`);
  const zone = zones[0];
  if (!zone) {
    console.error(`Zone ${ZONE_NAME} is not in this Cloudflare account.`);
    console.error('Add it (dashboard → Add a site, or a token with Zone:Edit), then re-run this script.');
    return 2;
  }
  console.log(`zone: ${zone.name} (${zone.status}) id=${zone.id}`);
  if (accountId && zone.account?.id !== accountId) {
    console.warn(`warning: zone belongs to account ${zone.account?.id}, CLOUDFLARE_ACCOUNT_ID is ${accountId}`);
  }

  const existing = [];
  for (let page = 1; ; page++) {
    const batch = await api(`/zones/${zone.id}/dns_records?per_page=100&page=${page}`);
    existing.push(...batch);
    if (batch.length < 100) break;
  }

  const wanted = RECORDS.map((r) => ({ ...r, ttl: TTL, proxied: false }));
  const missing = [];
  const drifted = [];

  for (const want of wanted) {
    const candidates = existing.filter((record) => relative(record.name) === want.name && record.type === want.type);
    if (candidates.length === 0) {
      missing.push(want);
      continue;
    }
    const exact = candidates.find((record) => sameValue(record.content, want.content));
    if (!exact) drifted.push({ want, found: candidates.map((c) => c.content) });
  }

  const known = new Set(wanted.map((r) => `${r.type}|${r.name}`));
  const unlisted = existing.filter((record) => !known.has(`${record.type}|${relative(record.name)}`));

  console.log(`existing records: ${existing.length}`);
  console.log(`to create: ${missing.length}`);
  for (const r of missing) console.log(`  + ${r.type.padEnd(5)} ${fqdn(r.name).padEnd(28)} ${r.content}`);

  if (drifted.length) {
    console.log(`\nDRIFT (same type+name, different value — left untouched, check by hand): ${drifted.length}`);
    for (const { want, found } of drifted) {
      console.log(`  ! ${want.type} ${fqdn(want.name)}: wanted "${want.content}" but found ${found.map((f) => `"${f}"`).join(', ')}`);
    }
  }

  if (unlisted.length) {
    console.log(`\nrecords present in Cloudflare but not in this inventory: ${unlisted.length}`);
    for (const r of unlisted) console.log(`  ? ${r.type} ${r.name} ${r.content}`);
  }

  if (!apply) {
    console.log('\ndry run — re-run with --apply to create the missing records.');
    return drifted.length ? 1 : 0;
  }

  let created = 0;
  for (const r of missing) {
    try {
      await api(`/zones/${zone.id}/dns_records`, {
        method: 'POST',
        body: JSON.stringify({
          type: r.type,
          name: r.name === '@' ? ZONE_NAME : fqdn(r.name),
          content: r.content,
          ttl: r.ttl,
          proxied: r.proxied,
          ...(r.priority === undefined ? {} : { priority: r.priority }),
        }),
      });
      created++;
      console.log(`created ${r.type} ${fqdn(r.name)}`);
    } catch (error) {
      console.error(`FAILED  ${r.type} ${fqdn(r.name)}: ${error.message}`);
    }
  }
  console.log(`\ncreated ${created}/${missing.length} records`);
  return created === missing.length && drifted.length === 0 ? 0 : 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = await main();
}
