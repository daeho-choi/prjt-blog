// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// GitHub Pages project site: https://daeho-choi.github.io/prjt-blog/
// If switching to a custom domain later, drop `base` and adjust `site`.
export default defineConfig({
  site: 'https://daeho-choi.github.io',
  base: '/prjt-blog/',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  build: {
    format: 'directory',
  },
});
