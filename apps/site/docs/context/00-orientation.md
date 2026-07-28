# Orientation

Genre: explanation (Diátaxis). The one-page mental model of what this repository is.

## What it is

The public website for the Equilibria Network, served at `eq-network.org`. It is a static site: every
page is pre-rendered to HTML at build time. There is no backend, no database, and no server-side runtime.
The site lives in `apps/site/` of a pnpm workspace (see [ADR-0001](../../../../docs/adr/0001-monorepo-topology.md)).

## Stack

- **Astro 4** with `output: 'static'` — the site generator and router. One file per route under `apps/site/src/pages/`.
- **React 18** islands via `@astrojs/react` — used only for interactive pieces (the lab simulations, the
  research graph, the roadmap, the contact form). Most of the page is static HTML.
- **CSS Modules + global CSS** under `apps/site/src/styles/` for styling. No CSS framework.
- **roughjs** for the hand-drawn visual style; **lucide-react** for icons.
- **@formspree/react** for the contact form.
- **pnpm** for packages; **TypeScript** in strict mode.

## How content is organised

Page copy and data live as typed TypeScript under `apps/site/src/content/` (for example `home.ts`, `about.ts`,
`roadmap/`). Components in `apps/site/src/components/` render that data. To change words on a page, edit the content
file, not the component.

## Routes

`apps/site/src/pages/` maps directly to URLs: `index.astro` (home), `about`, `products`, `research`, `roadmap`,
`explainer`, `privacy`, `lab`, `lab/playground`, and a `404`. The lab and its playground are unlisted (absent from
the navbar).

## The playground

`/lab/playground` renders `apps/site/prototypes/playground.html` imported raw at build time. That HTML file is the
single source of truth for the prototype and is deliberately not wrapped in the site layout.

## How it ships

Push to `main` triggers `.github/workflows/deploy.yml`: install, `pnpm build` (which runs `astro check`
then `astro build`), and publish `apps/site/dist` to GitHub Pages. The custom domain is set by `apps/site/public/CNAME`.

## Visual language

The site has a consistent visual language (colour, type, spacing, the hand-drawn roughjs motif, section and
card patterns). It is documented as a contract in [`10-visual-language.md`](10-visual-language.md) — read it
before building or editing a page so new work matches instead of drifting.

## The one thing that must work

Any page loads and reads correctly, and the site builds and deploys from `main`. Everything else is
secondary.
