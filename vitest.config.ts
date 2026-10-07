// Tests (README.md → "Tests"). getViteConfig gives the tests Astro's setup
// (astro:env, Markdown imports, the same Vite version as the site).
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
