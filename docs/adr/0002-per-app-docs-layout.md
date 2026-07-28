# ADR-0002: per-app documentation layout

- Status: Accepted
- Date: 2026-07-28

## Context

All project documentation (ADRs, tasks, audits, context, runbooks, privacy, lessons) lived in a single
root `docs/` tree. The repository is a pnpm monorepo (ADR-0001) with more than one deployable surface:
`apps/site` (the public website) and `apps/playground`, plus `packages/`. A single flat `docs/` tree
conflates decisions that govern one app with decisions that govern the whole repository, and it does not
scale as more apps or packages are added.

## Decision

Documentation lives at the scope it governs.

- **Root `docs/`** holds only genuinely cross-deployment / repo-wide material: the monorepo topology,
  repo-wide tasks, cross-cutting lessons, and the shared authoring templates.
- **Each app owns its docs** under `apps/<app>/docs/` (mirroring the same structure: `adr/`, `tasks/`,
  `audits/`, `context/`, `runbooks/`, `privacy/`, `handoffs/`). The website's docs now live under
  `apps/site/docs/`.
- **ADRs and tasks are numbered per scope**, contiguously from `0001`. A decision that governs the site
  is numbered within the site's ADR sequence; a repo-wide decision within the root sequence. The same
  number can therefore appear in two scopes (root ADR-0001 = topology; site ADR-0001 = static hosting),
  disambiguated by path.

## Consequences

- **Enables:** each app's decisions and work tracker live next to its code; a reader of one app is not
  wading through another app's history; new apps get a docs tree without reorganising root.
- **Cost:** a one-time migration (move + per-scope renumber + reference rewrite), performed 2026-07-28.
  Root `docs/` is sparse today (one app carries almost everything) but the scaffold is correct for growth.
- **Convention:** new site-scoped docs go under `apps/site/docs/`; only repo-wide decisions go in root.

## Migration map (2026-07-28)

Root retained: `adr/0001-monorepo-topology` (was `0005-repo-topology`),
`tasks/done/task-0001-repo-structure` (was `task-0005`), the monorepo-migration lesson, and `templates/`.
Moved to `apps/site/docs/`: ADRs `0001` (astro-static, unchanged), `0003->0002` (visual-language),
`0004->0003` (privacy-review), `0006->0004` (i18n), `0007->0005` (dependency-upgrade); tasks `0001-0004`
unchanged, `0008->0007` (brand), `0006->0005` (visual-assets), `0007->0006` (i18n); plus `audits/`,
`context/`, `runbooks/`, `privacy/`, and `handoffs/` wholesale. No broken links after the move
(116 links verified).

## Sources

ADR-0001 (monorepo topology); the two-app reality (`apps/site`, `apps/playground`).
