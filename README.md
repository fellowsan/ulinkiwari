# UlinKiwari Games — Official Website

> **Maén di Jaman Kiwari.**

Official studio website for **UlinKiwari Games**, an indie game studio crafting
fun, creative play for today's players — with the warmth of Sundanese values
and inspiration.

- **Live domain:** https://ulinkiwari.my.id
- **Default language:** English · switchable to Indonesian (Bahasa Indonesia)
- **Design system:** "Kiwari Pop" (tangerine orange, deep purple, butter yellow,
  soft ivory, dark plum)
- **Stack:** HTML5 + Tailwind CSS (CLI build, no Play CDN) + vanilla JavaScript

## Folder structure

```text
ulinkiwari/
├── index.html          # Homepage (EN default, ID via switcher)
├── about.html          # About the studio
├── games.html          # Game catalog ("Coming Soon" state)
├── privacy.html        # Privacy Policy (template — owner review required)
├── terms.html          # Terms of Service (template — legal review advised)
├── contact.html        # Contact & support (no fake form)
├── 404.html            # Branded not-found page
├── src/
│   ├── input.css       # Tailwind v4 source: Kiwari Pop tokens + components
│   └── main.js         # Theme, mobile menu, language switcher, i18n engine
├── assets/
│   ├── css/styles.css  # Built production CSS (generated — do not edit)
│   ├── js/
│   │   ├── i18n.js     # EN/ID copy dictionary (edit copy here)
│   │   └── main.js     # Built copy of src/main.js (generated)
│   ├── images/         # Reserved for future artwork
│   └── icons/
│       └── favicon.svg # Provisional sun+spark mark
├── robots.txt
├── sitemap.xml
├── package.json
├── README.md
└── CONTENT_CHECKLIST.md
```

## Requirements

- Node.js 18+ and npm (Tailwind CSS v4 CLI runs on Node)

## Install

```bash
cd ulinkiwari
npm install
```

## Develop

```bash
npm run dev
```

Watches `src/input.css` and rebuilds `assets/css/styles.css` on change.
Serve the folder with any static server, e.g.:

```bash
npx serve .
```

## Build (production)

```bash
npm run build
```

This compiles minified CSS to `assets/css/styles.css` and copies
`src/main.js` → `assets/js/main.js`. Commit the built files before deploying.

## Deployment (static hosting)

1. Run `npm run build`.
2. Upload the **entire folder** (HTML files, `assets/`, `robots.txt`,
   `sitemap.xml`) to any static host (Netlify, Vercel, Cloudflare Pages,
   GitHub Pages, cPanel, Nginx…).
3. Point the domain `ulinkiwari.my.id` at the host and enable **HTTPS**.
4. Verify:
   - `https://ulinkiwari.my.id/` loads, theme toggle + language switcher work
   - `https://ulinkiwari.my.id/privacy.html` is publicly reachable (needed
     for Google Play Console)
   - No mixed-content warnings, correct canonical URLs

### Domain / HTTPS checklist

- [ ] DNS for `ulinkiwari.my.id` (and `www`, if used) points at the host
- [ ] Valid TLS certificate, HTTP → HTTPS redirect
- [ ] `robots.txt` and `sitemap.xml` reachable
- [ ] 404 page served for unknown paths (configure on the host if needed)

## How to add a game card

1. Open `games.html`, find the **example cards** section.
2. Copy one `<article class="card-pop ...">` block.
3. Replace: title, genre, description, artwork, and add a **verified**
   Google Play URL button. Never claim an unreleased game is on Google Play.
4. Add matching `data-i18n` keys (e.g. `games.g1.title`) in
   `assets/js/i18n.js` under both `en` and `id`.
5. When at least one real game exists, you may remove the example cards and
   the "Coming Soon" block on `index.html` / `games.html`.

## How to change contact / policy text

- **Support email:** in `contact.html`, replace the `[ADD SUPPORT EMAIL]`
  placeholder box with a real `mailto:` link. Then update
  `assets/js/i18n.js` keys `contact.email.*` if you want the address managed
  centrally.
- **Privacy / Terms:** edit the section bodies in `privacy.html` /
  `terms.html` **and** the matching keys in `assets/js/i18n.js`. Resolve
  every `[OWNER INPUT REQUIRED: ...]` / `[LEGAL REVIEW REQUIRED: ...]`
  placeholder first — see `CONTENT_CHECKLIST.md`.

## Theme implementation notes

- Light mode is the default. The toggle in the header (desktop + mobile menu)
  switches themes; the choice persists in `localStorage` (`ulinkiwari-theme`).
- A tiny inline script in each page's `<head>` reads the stored theme **before
  first paint** to avoid flashing the wrong theme.
- Dark mode uses Tailwind v4's class strategy:
  `@custom-variant dark (&:where(.dark, .dark *));` in `src/input.css`.
- `prefers-reduced-motion` disables transitions and the scroll-reveal effect.

## Language implementation notes

- Copy lives in `assets/js/i18n.js` as `window.ULIN_I18N = { en: {...}, id: {...} }`.
- HTML carries the English default inline and marks translatable nodes with
  `data-i18n` (text), `data-i18n-html` (rich text), or
  `data-i18n-attr="attr:key;…"` (attributes, incl. `<meta>` tags and `<title>`).
- The header switcher (EN/ID, desktop + mobile) persists to `localStorage`
  (`ulinkiwari-lang`), updates `<html lang>`, and re-renders meta/OG tags.
- SEO: each page ships unique EN title/description + canonical +
  `hreflang="en|id|x-default"`. Both hreflang values point at the same URL
  because translation is client-side — a documented trade-off; crawlers see
  the English default. For stronger Indonesian SEO later, duplicated
  per-language pages can be added.

## Known placeholders (do not ship as-is)

- `[ADD SUPPORT EMAIL]` — contact.html
- `[OWNER INPUT REQUIRED: ...]` — privacy.html (13 sections)
- `[LEGAL REVIEW REQUIRED: ...]` — terms.html
- Provisional sun+spark logo — documented in footers site-wide
- Example game cards on games.html — clearly labelled, not real games

Full list: see `CONTENT_CHECKLIST.md`.
