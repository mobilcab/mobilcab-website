// Runs scripts/launch-check.mjs at the start of every build.
// A production deploy (DEPLOY_ENV=production, set by the deploy workflow) stops
// on any error; local builds and preview deploys only print a summary.
//
// This used to key off Vercel's own VERCEL_ENV variable. On Cloudflare Workers
// nothing sets an equivalent, so the workflow sets DEPLOY_ENV explicitly: a
// missing value must never be read as "production".

import { fileURLToPath } from 'node:url';
import { runLaunchChecks } from '../../scripts/launch-check.mjs';

export default function launchCheck() {
  return {
    name: 'mobilcab:launch-check',
    hooks: {
      'astro:build:start': ({ logger }) => {
        const root = fileURLToPath(new URL('../..', import.meta.url));
        const { errors, warnings } = runLaunchChecks({ root, env: process.env });
        const production = process.env.DEPLOY_ENV === 'production';

        if (production) {
          for (const w of warnings) logger.warn(w);
          if (errors.length) {
            for (const e of errors) logger.error(e);
            throw new Error(`Launch check: ${errors.length} problem(s) must be fixed before a production deploy (see above).`);
          }
          logger.info('Launch check passed.');
        } else if (errors.length || warnings.length) {
          logger.info(
            `${errors.length} launch problem(s), ${warnings.length} warning(s); production deploys stop on problems. Details: npm run check-launch`,
          );
        }
      },
    },
  };
}
