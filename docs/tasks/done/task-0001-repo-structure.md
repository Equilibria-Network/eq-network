# Repository reorganisation into an app-scale workspace

- Provenance: task-0001
- Links back to: [`../../adr/0001-monorepo-topology.md`](../../adr/0001-monorepo-topology.md)
- Status: done (2026-07-28) — workspace established; site builds from `apps/site`
- Owner: unassigned
- Priority: —

## Goal

Reorganise from a single Astro app into the layout ADR-0001 settles, so the site and the playground can be
worked on independently and the design system is shared cleanly. Do this **first**, so the dead-code
cleanup, folder decomposition, and design-system extraction land inside the final layout and are not redone.

## Done when

The repo is a pnpm workspace (assuming ADR-0001 lands on Option B): the current app lives under `apps/site`,
`packages/design-system` exists (even if minimal at first), `apps/playground` is scaffolded (or a clear
placeholder), the deploy workflow is path-aware, and `pnpm build` works from the root.

## Plan (Option B — pnpm workspaces; adjust if ADR-0001 picks Option C)

1. **Decide ADR-0001** (blocking).
2. **Add `pnpm-workspace.yaml`; move the current app under `apps/site/`** with `git mv` (preserve history);
   fix import paths / aliases; update `.github/workflows/deploy.yml` to build `apps/site`. One mechanical
   commit, verified by a green build.
3. **Create `packages/design-system/`** (populated by ADR-0002 Stage 1 — tokens + shared components).
4. **Scaffold `apps/playground/`** with its own `package.json`, `docs/`, `adr/`, `tasks/`, and a build; move
   `prototypes/playground.html` into it as the starting point. Set up its own deploy (header-capable host if
   it needs `SharedArrayBuffer`).
5. **Make CI path-aware** so each app builds/deploys on changes to its own paths.

## Relationship to the other cleanup

- [task-0001](../../../apps/site/docs/tasks/open/task-0001-pristine-baseline.md) (bugs, hygiene, dead code) and [task-0002](../../../apps/site/docs/tasks/open/task-0002-visual-language-alignment.md) (design system + per-page redesign) execute **inside**
  this layout. Sequence: this reorg → then those.
- Do the structural moves and any interpretive edits (dead-code deletion, decomposition) as **separate
  commits**, so the low-risk moves are banked even if an interpretive pass needs rework.
- On a shared repo, do the reorg on a branch with the remote as an off-machine backup; drive the internal
  link-checker and the build to green before merging.
