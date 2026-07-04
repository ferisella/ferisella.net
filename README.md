# ferisella.net

Personal site of Fer Isella: pianist, composer, and co-founder of limbo/.

Static site built with [Astro 5](https://astro.build) and managed with [Keystatic](https://keystatic.com), a local-first CMS. Bilingual (Spanish/English), light and dark themes, deployed on Cloudflare.

## Development

Requires Node >= 22.12.0.

```sh
npm install
npm run dev        # dev server + Keystatic admin at /keystatic
npm run build      # static build to dist/
npm run preview    # preview the production build
```

## Content

Content lives as JSON files in `src/content/` (releases, collaborators, highlights), edited directly or through the Keystatic admin panel at `/keystatic` (dev only). Keystatic is excluded from production builds, so the deployed site is fully static.

See `CLAUDE.md` for the full architecture notes.
