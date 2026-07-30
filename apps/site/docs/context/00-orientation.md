# Orientation

Genre: explanation (Diátaxis). The one-page mental model of what this repository is.

## What it is

The public website for the Equilibria Network, served at `eq-network.org`. It is a static site: every
page is pre-rendered to HTML at build time. There is no backend, no database, and no server-side runtime.
The site lives in `apps/site/` of a pnpm workspace (see [ADR-0001](../../../../docs/adr/0001-monorepo-topology.md)).

## Stack

- **Astro 7** with `output: 'static'` — the site generator and router. One file per route under `apps/site/src/pages/`.
- **React 19** islands via `@astrojs/react` — used only for interactive pieces (the thesis, lab
  simulations, research graph, roadmap, and contact form). Most of the page is static HTML.
- **Tailwind 4 + CSS Modules + global CSS** provide the shared styling foundation and page-specific
  composition.
- **roughjs** for the hand-drawn visual style; **lucide-react** for icons.
- **@formspree/react** for the contact form.
- **pnpm** for packages; **TypeScript** in strict mode.

## How content is organised

Page copy and data live as typed TypeScript under `apps/site/src/content/` (for example `home.ts`, `about.ts`,
`roadmap/`). Components in `apps/site/src/components/` render that data. To change words on a page, edit the content
file, not the component.

## Routes

`apps/site/src/pages/` maps directly to URLs: `index.astro` (home), `about`, `products`, `research`,
`roadmap`, `thesis`, `privacy`, `legal`, `brand`, `lab`, `playground`, prototypes, and a `404`.
The primary navigation links to the playground. The legacy Products route still builds but is unlinked
pending the retirement decision in
[`task-0012`](../tasks/deferred/task-0012-retire-products-route.md).

## The playground

`/playground` mounts `@eq-network/playground/embed` inside the canonical Astro `Layout` and
`PageHeader`. The workspace package owns the scenario registry, numerical worker, live metrics, SVG
showcases, controls, tests, and app-scoped docs. The old `apps/site/prototypes/playground.html` remains
comparison material only and is not imported by production.

The package has a standalone Vite harness for focused development, but production ships in
`apps/site/dist` with the same navbar and footer as every other site page. See
[`playground architecture`](../../../playground/docs/architecture/scenario-platform.md) and the
repo-wide [`integration ADR`](../../../../docs/adr/0003-integrated-playground-deployment.md).

## The thesis

`/thesis` composes the shared `VisualEssay` shell with the approved scientific-notebook D3 and RoughJS
renderer. The shell owns scroll activation, the flat sticky drawing region, narrative column, and mobile
behavior. The renderer owns seven thesis-specific visual states and their transitions. Legacy
`/explainer` and prototype URLs redirect to this canonical route.

## How it ships

Push to `main` triggers `.github/workflows/deploy.yml`: install, `pnpm build` (which runs `astro check`
then `astro build`), and publish `apps/site/dist` to GitHub Pages. The custom domain is set by `apps/site/public/CNAME`.

## Visual language

The site has a consistent visual language (colour, type, spacing, the hand-drawn roughjs motif, section and
card patterns). It is documented as a contract in [`10-visual-language.md`](10-visual-language.md) — read it
before building or editing a page so new work matches instead of drifting.

## The one thing that must work

Any page loads and reads correctly, the playground retains its characterized scientific behavior, and the
site builds and deploys from `main`.
