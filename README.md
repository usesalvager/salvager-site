# salvager-site

Marketing landing page for [Salvager](https://github.com/usesalvager/salvager) —
hosted at **salvager.sh**. A single-page, long-scroll site built with Astro +
Tailwind CSS v4. Fully static output, no SSR, deployable to any static host.

## Stack

- **Astro 6** — static output (no adapter).
- **Tailwind CSS v4** via the official `@tailwindcss/vite` plugin (not the
  legacy `@astrojs/tailwind` v3 integration).
- No UI kit, no web fonts (system + system-mono stacks), minimal inline JS
  (clipboard copy only). Inline SVG for all icons.

## Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Dev server at `http://localhost:4321`        |
| `npm run build`   | Build static site into `./dist/`             |
| `npm run preview` | Serve the built `./dist/` locally to check   |

## Project structure

```text
/
├── public/
│   ├── favicon.svg          # revision-stack mark
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Header.astro     # sticky nav
│   │   ├── Hero.astro
│   │   ├── Problem.astro
│   │   ├── HowItWorks.astro
│   │   ├── ForAgents.astro  # MCP tools + registration JSON
│   │   ├── WhyTrust.astro   # feature grid
│   │   ├── Quickstart.astro
│   │   ├── Footer.astro
│   │   └── CodeBlock.astro  # copyable command/snippet
│   ├── layouts/
│   │   └── Layout.astro     # <head>, meta/OG, imports global.css
│   ├── styles/
│   │   └── global.css       # @import "tailwindcss" + theme tokens
│   └── pages/
│       └── index.astro      # the one and only route
└── astro.config.mjs         # wires @tailwindcss/vite
```

## Deploy

`npm run build` emits static HTML/CSS into `dist/`. Host-agnostic — point any of
Netlify, Vercel, Cloudflare Pages, or GitHub Pages at `dist/`. No server runtime
required.
