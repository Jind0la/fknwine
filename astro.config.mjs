// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import rehypeTableWrap from './src/lib/rehype-table-wrap.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://fknwine.com',
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [rehypeTableWrap],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
