// @ts-check
import { defineConfig } from 'astro/config';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const isBuild = process.argv.includes('build');

// https://astro.build/config
export default defineConfig({
  site: 'https://ferisella.net',
  integrations: isBuild ? [sitemap()] : [react(), keystatic(), sitemap()],
});
