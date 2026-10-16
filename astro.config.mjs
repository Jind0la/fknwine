// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import rehypeTableWrap from './src/lib/rehype-table-wrap.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://fknwine.com',
  integrations: [
    sitemap({
      // /subscribed/ ist eine Danke-Seite für Newsletter-Anmeldungen:
      // kein Suchintent, kein Nutzen im Index (SEO-Audit 17.10.2026).
      filter: (page) => !page.includes('/subscribed/'),
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeTableWrap],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
