# Fix the missing favicon on /lab/playground

- Provenance: audit-0004
- Links back to: `../../audits/2026-07-28-audit-0001-inherited-recon.md` (F4)
- Status: todo
- Owner: unassigned
- Priority: soon

## Problem

`src/pages/lab/playground.astro` links `rel="icon" href="/favicon.svg"`, but no `favicon.svg` exists at
the web root. The repository ships `favicon.ico` and `logo_icon.svg`. That page requests a 404 favicon.

## Done when

The playground page references a favicon asset that exists (either point at `/favicon.ico` / an existing
SVG, or add `public/favicon.svg`).

## Notes

Cosmetic. Batch with F3 and F6.
