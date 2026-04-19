# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Fer Isella's personal portfolio website: a static site generated with **Astro 5.x** and managed via **Keystatic**, a local-first headless CMS. The site showcases music releases, collaborators, technology projects (limbo/), and essays, with bilingual (Spanish/English) support and a light/dark theme system.

### Key Stack
- **Astro 5.x** — static site generator with file-based routing
- **Keystatic** — local-file CMS with web-based admin panel (`/keystatic`)
- **Zod** — TypeScript schema validation for collections
- **Astro Content Collections API** — typed data loading with `getCollection()`

## Getting Started

### Installation & Development
```bash
npm install                    # Install dependencies
npm run dev                   # Start dev server (http://localhost:3000)
npm run build                 # Build static site to dist/
npm run preview               # Preview production build locally
```

### Keystatic Admin Panel
The Keystatic CMS runs at `/keystatic` in dev mode. Edits are saved directly to `src/content/` as JSON files.

## Architecture & Content Structure

### Content Collections

Collections are defined in `src/content/config.ts` with Zod schemas. Data lives in `src/content/{collection-name}/`:

**highlights** (singleton: `src/content/highlights/index.json`)
- Contains 3 featured items displayed in the intro section
- Structure: `items: Array<{ title, description?, link? }>`

**collaborators** (collection: `src/content/collaborators/`)
- Individual `.json` files per collaborator (e.g., `pablo-dacal.json`)
- Used in "Who I've worked with" section
- Structure: `{ name, role_es, role_en }` (bilingual)
- Sorted alphabetically by name in render

**releases** (collection: `src/content/releases/`)
- Individual `.json` files per album/EP (e.g., `my-heart.json`)
- Structure: `{ title, year, note_es?, note_en?, tag_es?, tag_en? }` (bilingual)
- Sorted by year descending in frontmatter
- First release (newest) gets `.featured` and `.featured-tag` CSS classes

### Page Structure

**src/pages/index.astro** (main portfolio page, ~780 lines)
- Frontmatter (lines 2–11): Imports all collections via `getCollection()`
- Intro section (lines 688–708): Features top 3 highlights
- Bio section (lines 711–820): Personal narrative + dynamic collaborators list
- Music section (lines 823–947): Discography + production credits
- Limbo section (lines 884–913): Company overview
- Footer (lines 918–949): Links and contact
- Script section (lines 985–1090): Theme/language toggle, reveal-on-scroll animation

**Components**
- `src/components/Highlights.astro` — reusable pattern for rendering collection items with title, description, and link

## Important Patterns

### Dynamic Content Rendering
All hardcoded content sections use `.map()` over collection data. The frontmatter sorts before render:
```ts
const releasesList = releases.sort((a, b) => b.data.year - a.data.year);
const collaboratorsList = collaborators.sort((a, b) =>
  a.data.name.localeCompare(b.data.name)
);
```

Bilingual fields propagate as `data-es` / `data-en` attributes, so the in-browser language toggle keeps working:
```astro
{releasesList.map((release, index) => (
  <article class={`release ${index === 0 ? 'featured' : ''}`}>
    <div class="release-year">{release.data.year}</div>
    <div class="release-title">{release.data.title}</div>
    <div class="release-note"
      data-es={release.data.note_es}
      data-en={release.data.note_en}>
      {release.data.note_en || release.data.note_es}
    </div>
  </article>
))}
```

**Important**: `getCollection()` returns an array directly — do NOT call `.all()` on it (that method does not exist).

### Bilingual Support
- All UI text uses `data-es` and `data-en` attributes
- JavaScript `toggle-language()` function switches visibility via CSS `:lang()` pseudo-classes
- JSON content (from Keystatic) does **not** have i18n attributes; it directly surfaces the data

### Styling
- CSS custom properties for theming: `--bg`, `--bg-alt`, `--text`, `--rule`, `--display`, etc.
- Dark mode via `prefers-color-scheme` media query + manual toggle with `--theme-dark` attribute on `<html>`
- Language-aware CSS: `.thread[lang="es"] .thread-label` for localized styling

### Client-Side Functionality
- Theme toggle: click → localStorage → CSS attribute
- Language toggle: click → localStorage → CSS attribute  
- Reveal-on-scroll: Intersection Observer for fade-in animations on `.reveal` elements
- No build-time i18n processing; all translation happens in the browser

## Keystatic Migration (Complete)

Three major sections converted from hardcoded HTML to dynamic rendering:

1. **Intro threads** (highlights singleton) — `highlightsData.map()`
2. **Collaborators list** (18 entries) — `collaboratorsList.map()` with bilingual roles
3. **Discography** (10 releases) — `releasesList.map()`, sorted by year desc, bilingual notes/tags

### Build-time vs dev-time integration

Keystatic's Astro integration injects server-rendered routes (the `/keystatic` admin). For a purely static Cloudflare Pages deploy, `astro.config.mjs` only loads Keystatic when the Astro CLI is NOT running `build`:

```js
const isBuild = process.argv.includes('build');
export default defineConfig({
  integrations: isBuild ? [] : [keystatic()],
});
```

This keeps `/keystatic` available in `npm run dev`, and keeps `npm run build` fully static (no adapter required).

## Deployment (Cloudflare Pages)

1. Push repo to GitHub
2. In Cloudflare Pages → Create project → Connect GitHub repo
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: `22` (project requires `>=22.12.0`)
4. After first deploy, add custom domain in Pages → Custom domains.

Because Keystatic is excluded from `astro build`, no adapter is needed — the build is fully static.

## File Map (Relevant Paths)

```
src/
├── pages/
│   └── index.astro         # Main portfolio page
├── components/
│   └── Highlights.astro    # Reusable item renderer
├── content/
│   ├── config.ts           # Collection schemas
│   ├── highlights/
│   │   └── index.json      # Featured items (singleton)
│   ├── collaborators/
│   │   └── *.json          # Individual collaborator files
│   └── releases/
│       └── *.json          # Individual release files
├── styles/
│   └── global.css          # Theme variables, base styles
└── layouts/
    └── ... (if any)

public/               # Static assets (favicon, fonts, etc.)
astro.config.mjs      # Astro config + Keystatic integration
```

## Common Commands

- `npm run dev` — develop with hot reload and Keystatic at `/keystatic`
- `npm run build` — production build
- `npm run preview` — test production build locally
- Edit `src/content/**/*.json` directly or via Keystatic UI

## Notes for Future Work

- The page has minimal dependencies; focus is on **content-driven architecture**, not component libraries
- Theme and language state persist to localStorage; theme preference also respects system setting
- Keystatic runs only in dev; production is purely static HTML/CSS/JS
- All collection sorting (by year, alphabetical) happens in component render logic, not in queries
- No API routes or backend; data flows: Keystatic → JSON files → `getCollection()` → frontmatter → template rendering
