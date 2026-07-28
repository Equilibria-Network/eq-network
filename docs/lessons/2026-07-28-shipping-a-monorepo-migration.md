# Shipping a monorepo-migration branch, and auditing for dead assets

- Date: 2026-07-28
- Related: [`../adr/0001-monorepo-topology.md`](../adr/0001-monorepo-topology.md)

## What happened

The pristine-baseline branch also migrated the site from a root `src/` layout to a pnpm monorepo under
`apps/site/`, then merged to `main` and deployed. Two things bit:

1. Promoting the branch with `git checkout main && git merge` aborted. Old `main` still had the
   pre-monorepo layout, so switching the working tree collided with gitignored leftovers (a local
   `.env`, a generated `env.d.ts`, `node_modules`, and `docs/handoffs/`).
2. An early dead-asset scan that grepped only `.ts/.tsx/.astro/.html` flagged live paper-texture images
   as unreferenced. They are referenced from `.module.css`, which the scan had excluded.

## What was learned

- To promote a branch whose working tree differs structurally from `main`, push the ref directly with
  `git push origin <branch>:main`. It fast-forwards the remote without a working-tree swap; then realign
  the local branch with `git branch -f`.
- When proving an asset is dead, grep every reference type including CSS, and confirm with an inverse
  check: every image path still referenced in source must resolve to a file on disk. Deleting a `public/`
  asset never fails the build (only a runtime 404), so the grep is the only safety net.
