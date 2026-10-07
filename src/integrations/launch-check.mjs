// Runs scripts/launch-check.mjs at the start of every build.
// Production deploys on Vercel (VERCEL_ENV=production) stop on any error;
// local builds and Vercel preview deploys only print a summary.

import { fileURLToPath } from 'node:url';
import { runLaunchChecks } from '../../scripts/launch-check.mjs';

export default function launchCheck() {
  return {
    name: 'mobilcab:launch-check',
    hooks: {
      'astro:build:start': ({ logger }) => {
        const root = fileURLToPath(new URL('../..', import.meta.url));
        const { errors, warnings } = runLaunchChecks({ root, env: process.env });
        const production = process.env.VERCEL_ENV === 'production';

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
