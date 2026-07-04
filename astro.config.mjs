// @ts-check
import { defineConfig } from 'astro/config';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Keystatic injects server-rendered routes, so it only loads in `astro dev`.
// `build` and `preview` stay fully static (no adapter needed).
const isDev = process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
  site: 'https://ferisella.net',
  integrations: isDev ? [react(), keystatic(), sitemap()] : [sitemap()],
});
