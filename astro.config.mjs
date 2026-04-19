// @ts-check
import { defineConfig } from 'astro/config';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';

const isBuild = process.argv.includes('build');

// https://astro.build/config
export default defineConfig({
  integrations: isBuild ? [] : [react(), keystatic()],
});
