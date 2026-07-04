# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Fer Isella's personal site: a static, bilingual (Spanish/English) site built with **Astro 5.x** and managed via **Keystatic**, a local-first headless CMS. Positioning is musician-first: Fer as pianist and composer, with limbo/ (his company) as supporting context. The site has a light/dark theme system and embedded Bandcamp players.

### Key Stack
- **Astro 5.x**, static output, file-based routing
- **Keystatic**, local-file CMS with admin panel at `/keystatic` (dev only)
- **Zod** schemas for content collections
- **Fontsource** self-hosted fonts (no Google Fonts requests)

## Getting Started

```bash
npm install                   # Install dependencies (Node >= 22.12.0)
npm run dev                   # Dev server + Keystatic at /keystatic
npm run build                 # Static build to dist/
npm run preview               # Preview the production build
```

## Architecture

### Routes (all statically generated)

| Route | Source | Language |
|---|---|---|
| `/` | `src/pages/index.astro` | English |
| `/es/` | `src/pages/es/index.astro` | Spanish |
| `/music/[slug]/` | `src/pages/music/[slug].astro` | English |
| `/es/music/[slug]/` | `src/pages/es/music/[slug].astro` | Spanish |

Release slugs come from the JSON filenames in `src/content/releases/` (Astro's `release.id`).

### Internationalization (build-time)

Both languages are **server-rendered at build time**, one page per language, linked with `hreflang` alternates (`en`, `es`, `x-default` pointing to English). There is NO client-side text swapping.

- Pages/components take a `lang: 'en' | 'es'` prop and use a local helper `const t = (es, en) => lang === 'es' ? es : en`.
- The nav language toggle is a plain link to the alternate-language URL; clicking stores `lang-pref` in localStorage.
- The English home (`/`) has a small inline script: first-time visitors with a Spanish browser (or stored `lang-pref: es`) are redirected to `/es/`. No other page redirects.

### Layout and components

- `src/layouts/Base.astro` — HTML shell: head (meta, canonical, hreflang, OG/Twitter, theme-color, inline theme script), nav, footer, and all client-side JS (theme toggle, Bandcamp players, reveal-on-scroll). Pages inject extra head tags (JSON-LD, redirect script) via `<Fragment slot="head">`.
- `src/components/HomeContent.astro` — all home sections (intro, music 01, bio 02, limbo 03), rendered per `lang`.
- `src/components/ReleaseDetail.astro` — release page body (back link, meta, title, note, large Bandcamp player).
- `src/lib/schema.ts` — `SITE` constant, `personSchema` (Person JSON-LD, includes César Isella as `parent`), and `albumSchema()` (MusicAlbum JSON-LD per release).
- `src/styles/global.css` — all styles, imported by Base. CSS custom properties for theming (`--bg`, `--ink`, `--accent`, ...), dark mode via `[data-theme="dark"]`.

### Content Collections

Defined in `src/content/config.ts` (Zod), edited via Keystatic (`keystatic.config.ts`) or directly as JSON:

- **releases** (`src/content/releases/*.json`): `{ title, year, note_es?, note_en?, tag_es?, tag_en?, bandcamp_id?, bandcamp_url? }`. Sorted by year desc; newest gets `.featured` styling and auto-loads its player. `bandcamp_id` is the numeric album ID for the embedded player. 3 releases have no Bandcamp album (Cucusonic, IF, Los Caminos) and render without player.
- **collaborators** (`src/content/collaborators/*.json`): `{ name, role_es, role_en }`. Rendered with a priority list first (Eno, Sosa, Herbert, Dear, Ford), then alphabetical.
- **highlights** (singleton `src/content/highlights/index.json`): `items: [{ label_es?, label_en?, title, description?, link? }]`, the 3 intro threads.

**Important**: `getCollection()` returns an array directly. Do NOT call `.all()` on it.

### Bandcamp players (client-side)

Players are built lazily in Base.astro's script: `.bc-player` holders carry `data-album`, `data-url`, optional `data-size="large"` and `data-autoload`. Colors come from the current theme and are baked into the iframe URL, so loaded players are rebuilt when the theme toggles. Home rows show a "Listen/Escuchar" button; the featured release and release pages auto-load.

### Fonts

Self-hosted via Fontsource, imported in `Base.astro`. Variable families use the `Variable` suffix in CSS: `'Fraunces Variable'` (needs `full.css` for the SOFT/opsz axes), `'JetBrains Mono Variable'`. Spectral is static (300/400/500 + italics).

### Keystatic dev-only integration

Keystatic injects server-rendered routes, so `astro.config.mjs` loads it ONLY for `astro dev`. `build` and `preview` stay fully static, no adapter needed:

```js
const isDev = process.argv.includes('dev');
integrations: isDev ? [react(), keystatic(), sitemap()] : [sitemap()],
```

## Deployment (Cloudflare)

Static deploy of `dist/` (wrangler.toml assets config / Cloudflare Pages). Build command `npm run build`, output `dist`, Node 22. Sitemap is generated by @astrojs/sitemap; robots.txt lives in `public/`.

## File Map

```
src/
├── layouts/
│   └── Base.astro          # HTML shell, head/meta/hreflang, nav, footer, JS
├── components/
│   ├── HomeContent.astro   # Home sections, bilingual via lang prop
│   └── ReleaseDetail.astro # Release page body
├── lib/
│   └── schema.ts           # JSON-LD (Person, MusicAlbum) + SITE constant
├── styles/
│   └── global.css          # All styles, theme variables
├── pages/
│   ├── index.astro         # EN home (+ es-redirect script)
│   ├── es/index.astro      # ES home
│   ├── music/[slug].astro  # EN release pages
│   └── es/music/[slug].astro # ES release pages
└── content/
    ├── config.ts           # Collection schemas
    ├── highlights/index.json
    ├── collaborators/*.json
    └── releases/*.json

public/                # favicons, og-image.jpg, robots.txt
astro.config.mjs       # site URL, sitemap, dev-only Keystatic
keystatic.config.ts    # CMS field definitions
```

## Notes for Future Work

- Musician-first framing is deliberate: keep music leading in copy, order, and metadata.
- Theme persists to localStorage and respects `prefers-color-scheme`; an inline head script applies it pre-paint (no flash).
- Animations respect `prefers-reduced-motion`.
- All collection sorting happens in component render logic, not in queries.
- No API routes or backend; data flows: Keystatic → JSON → `getCollection()` → static HTML.
