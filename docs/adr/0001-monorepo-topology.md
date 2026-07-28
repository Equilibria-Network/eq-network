# ADR-0001: Repository topology and decomposition (site + playground)

- Status: Accepted (2026-07-28) — Option B, pnpm-workspace monorepo
- Date: 2026-07-28

## Context

Two things will live in this project's world, with very different shapes:

- **The marketing/research site** — static, content-first, light dependencies, stable, deploys to GitHub
  Pages. What exists today.
- **The playground** — becoming a substantial **client-side agent-based-model** with tweakable parameters
  ([ADR-0001](../../apps/site/docs/adr/0001-astro-static-github-pages.md) amendment). It will have heavy, divergent tooling (likely Web Workers and WASM), its own
  build, its own docs / ADRs / tasks, and possibly its own hosting needs (multi-threaded WASM needs
  `SharedArrayBuffer`, which needs COOP/COEP response headers GitHub Pages cannot send). The full
  high-powered engine is already a **separate download/repo**; the web playground is the accessible tier.

The question: **how do we lay this out so a person (or agent) can work on the playground in depth without
being entangled with the marketing site — and how do the two communicate?** This must be decided before the
folder reorganisation, because we do not want to move everything twice.

Today's layout does not support independent work: the site is a single Astro app and the playground is a
224 KB `prototypes/playground.html` imported raw. That is fine for a static prototype, wrong for a real app.

## Options

### Option A — Keep one Astro app; playground is just a `src/` module

- **Pros:** simplest; one build, one deploy, one clone.
- **Cons:** the sim's heavy deps bloat the whole site's build; the site's hosting constraints (static, no
  headers, no `SharedArrayBuffer`) are forced onto the sim; no independent work or release; the raw-HTML
  approach has to grow into the same build. Rejected — it couples exactly the two things that should be
  decoupled.

### Option B — Monorepo with workspaces (recommended)

One repository, pnpm workspaces:

```
eq-network/
  apps/
    site/         Astro marketing site  → GitHub Pages
    playground/   ABM app (own build, deps, deploy) → its own docs/ adr/ tasks/
  packages/
    design-system/  shared tokens + components (ADR-0002), used by both
  docs/           cross-cutting repo docs (this docs/ tree)
  pnpm-workspace.yaml
```

- **Pros:** the playground gets full isolation (own deps, build, deploy target, and a nested `docs/adr/
tasks/` — exactly as described) while **sharing the design system** with the site through one workspace
  package (no cross-repo publishing to stay visually aligned). Atomic changes across site + shared tokens +
  playground in one PR. One clone, one issue tracker, one place to coordinate — right for a small,
  agent-assisted team. Workspaces keep the dep trees separate, so the site build never pulls the WASM
  toolchain. Path-filtered CI lets `apps/site` deploy to GitHub Pages while `apps/playground` deploys
  independently (e.g. Cloudflare Pages with the COOP/COEP headers it needs) — the header constraint is
  solved without a separate repo.
- **Cons:** a one-time migration (move the current app under `apps/site`, touching import paths and the
  deploy workflow); CI must become path-aware; contributors learn the workspace layout.

### Option C — Separate repository for the playground

- **Pros:** hardest isolation; fully independent history, cadence, and contributors; ideal **if** the web
  playground shares more code with the separate high-powered engine than with the site.
- **Cons:** the design system must be published and version-bumped across repos to keep the two aligned (or
  duplicated — which is the exact drift ADR-0002 is fighting); cross-repo coordination overhead; embedding
  the playground into the site becomes a release-versioning problem. Two of everything (CI, deploy, docs
  roots) for a small team.

## Decision

Adopt **Option B — a pnpm-workspace monorepo** with `apps/site`, `apps/playground`, and
`packages/design-system`. Deploy each app independently (site → GitHub Pages; playground → a header-capable
static host when it needs `SharedArrayBuffer`). The site **embeds the playground by linking to / iframing
its own deployment** (e.g. a `play.` subdomain), which decouples the playground's hosting from the site's
and lets it evolve on its own cadence. The current `prototypes/playground.html?raw` import is the crude
precursor and is replaced by the real `apps/playground` when that work begins.

Choose **Option C instead** only if the web playground turns out to share substantial code with the
separate high-powered engine repo (then it belongs near the engine, not the site). This is the one fork in
the road that needs the owner's call, because it shapes the reorganisation.

### How they communicate

- **Shared code** (design tokens/components, and any shared types) flows through `packages/*` — imported at
  build time by both apps. One source of truth, no publishing.
- **Runtime**: the site does not call the playground's internals; it embeds the deployed playground (iframe
  or a linked route on the `play.` subdomain). Clean boundary, independent deploys, and the playground can
  take the response headers it needs.

## Consequences

- **Enables:** deep, independent work on the playground; a shared, drift-proof design system; independent
  deploy targets and hosting per app; one coordination surface.
- **Requires:** a one-time, mostly-mechanical migration to the workspace layout (its own task, done before
  the rest of the reorg so paths settle once); path-aware CI.
- **Sequencing:** this is the **first** structural step — the dead-code cleanup, folder decomposition, and
  design-system extraction all land inside the new layout, so they are not done twice.

## Revisit when

The playground's coupling to the separate engine grows to the point that co-locating them (Option C) beats
sharing the design system with the site; or the monorepo's CI/tooling overhead outweighs its atomicity for
the team's actual size.

## Sources

[ADR-0001](../../apps/site/docs/adr/0001-astro-static-github-pages.md) (static hosting + the `SharedArrayBuffer`/header constraint and
the client-side-ABM amendment); [ADR-0002](../../apps/site/docs/adr/0002-visual-language-system.md) (the shared design system that
both apps consume); current `prototypes/playground.html` + `apps/site/src/pages/lab/playground.astro`.
