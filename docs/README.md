# Documentation

Repo-wide documentation for the Equilibria Network monorepo. The running system is authoritative; when a
doc and the build disagree, fix the doc.

## Per-app convention

Documentation is scoped. This root `docs/` tree holds **only cross-deployment / repo-wide** material —
things that concern the monorepo as a whole rather than a single deployable app. Everything specific to a
given app lives under that app's own `docs/`:

- **Site docs:** [`../apps/site/docs/`](../apps/site/docs/README.md) — the public Astro website
  (ADRs, tasks, audits, context, runbooks, privacy, handoffs).
- **Playground docs:** `apps/playground/docs/` — created when that app's work begins.

If a decision or task concerns one app only, it belongs in that app's `docs/`, not here.

## Layout

```
docs/
  adr/         repo-wide architecture decision records (monorepo topology, tooling that spans apps)
  tasks/       repo-wide work items (structural / cross-app)
  lessons/     dated learnings and standing thematic notes
  templates/   shared authoring templates for ADRs, tasks, lessons, and handoffs
  README.md    this index
```

## Contents

- **ADR:** [`adr/0001-monorepo-topology.md`](adr/0001-monorepo-topology.md) — the pnpm-workspace
  decomposition into `apps/site`, `apps/playground`, and `packages/`; and
  [`adr/0002-per-app-docs-layout.md`](adr/0002-per-app-docs-layout.md) — why docs are scoped per app.
- **Tasks:** [`tasks/done/task-0001-repo-structure.md`](tasks/done/task-0001-repo-structure.md) records
  the workspace migration; [`tasks/open/task-0002-standalone-lorenz-app.md`](tasks/open/task-0002-standalone-lorenz-app.md)
  scopes the standalone interactive-visual workbench.
- **Lessons:** [`lessons/`](lessons/README.md) — e.g.
  [`lessons/2026-07-28-shipping-a-monorepo-migration.md`](lessons/2026-07-28-shipping-a-monorepo-migration.md).
- **Templates:** [`templates/`](templates/) — [`adr.md`](templates/adr.md), [`task.md`](templates/task.md),
  [`lesson.md`](templates/lesson.md), [`handoff.md`](templates/handoff.md), shared across all apps.

Project-wide calibration (scope, principles in force, principles skipped) lives in the repo-root
[`CONTRIBUTING.md`](../CONTRIBUTING.md).

## Conventions

- Link with relative paths so a link-checker can resolve every `.md` link from its own directory.
- ADRs and tasks are numbered `NNNN-slug.md`, **contiguous from 0001 within each scope** (repo-wide here;
  per-app under each app's `docs/`).
- ADRs are immutable-ish: to change course, write a superseding ADR.
- Tasks are prefixed by provenance: `adr-NNNN-*`, `audit-NNNN-*`, or `task-NNNN-*`.
- House voice: short, plain sentences; institutional voice; no personal names or internal machine paths.
