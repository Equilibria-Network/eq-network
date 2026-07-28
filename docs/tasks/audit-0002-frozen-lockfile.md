# Use --frozen-lockfile in the deploy workflow

- Provenance: audit-0002
- Links back to: `../audits/2026-07-28-audit-0001-inherited-recon.md` (F2)
- Status: todo
- Owner: unassigned
- Priority: now

## Problem

`.github/workflows/deploy.yml` runs `pnpm install`, which can silently rewrite `pnpm-lock.yaml` and ship a
different dependency tree than the one committed. Worse, **CI pins pnpm 8 while `pnpm-lock.yaml` is
`lockfileVersion: '9.0'`** — a v9 lockfile installed with pnpm 8 can resolve differently or fail. Production
builds should be reproducible from the lockfile with a matched pnpm version.

## Done when

`package.json` declares a `packageManager` (pnpm 9.x), the CI `pnpm/action-setup` version matches it, and
the workflow installs with `pnpm install --frozen-lockfile`; a build still passes.

## Notes

If the flag makes CI fail, the lockfile is out of sync with `package.json`; regenerate it locally
(`pnpm install`), commit it, then re-run. That is the flag doing its job.
