// Registers the daily clean-up of unconfirmed sign-ups (/api/cleanup) as a
// Vercel Cron Job. Like the security headers, it's added to the routing config
// the Vercel adapter writes (.vercel/output/config.json), rather than vercel.json.
// Vercel calls the path with `Authorization: Bearer <CRON_SECRET>`.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';

// 03:00 UTC every day (05:00–06:00 in Romania). On Vercel's free plan the
// exact minute isn't guaranteed, which doesn't matter here.
const crons = [{ path: '/api/cleanup', schedule: '0 3 * * *' }];

export default function vercelCrons() {
  return {
    name: 'mobilcab:vercel-crons',
    hooks: {
      'astro:build:done': ({ logger }) => {
        const configPath = new URL('../../.vercel/output/config.json', import.meta.url);
        if (!existsSync(configPath)) {
          logger.warn('.vercel/output/config.json not found; the daily clean-up was not scheduled.');
          return;
        }
        const config = JSON.parse(readFileSync(configPath, 'utf8'));
        config.crons = crons;
        writeFileSync(configPath, JSON.stringify(config, null, 2));
        logger.info('Scheduled the daily clean-up of unconfirmed sign-ups.');
      },
    },
  };
}
