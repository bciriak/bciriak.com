import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { tkShikiTheme, tkTransformer } from './src/lib/shiki-tk-transformer';

export default defineConfig({
  site: 'https://bciriak.com',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/drafts/'),
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: tkShikiTheme,
      transformers: [tkTransformer()],
    },
  },
});
