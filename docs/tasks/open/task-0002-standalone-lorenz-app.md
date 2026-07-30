# Spin the Lorenz visual out into a standalone app

- Provenance: task-0002 (owner request)
- Links back to: [`../../adr/0001-monorepo-topology.md`](../../adr/0001-monorepo-topology.md),
  [`../../../apps/site/docs/adr/0007-visual-essay-system.md`](../../../apps/site/docs/adr/0007-visual-essay-system.md)
- Status: todo
- Owner: unassigned
- Priority: soon

## Problem

Reusable interactive visuals such as the Lorenz attractor currently evolve inside `apps/site`, coupling
experimentation to the public website's component tree and release cycle. They need an independent
workbench where simulation, rendering, controls, and performance can change freely while the site consumes
a stable, intentionally small integration surface.

## Done when

A workspace under `apps/` owns the Lorenz simulation and its development surface, the website instantiates
an exported stable embed/component contract, and no source implementation is duplicated under
`apps/site`.

## Notes

- Start by inventorying the existing canvas/SVG implementations and choose one canonical simulation model.
- Define the host contract before moving code: dimensions, theme tokens, initial conditions, controls,
  reduced-motion behaviour, lifecycle, and cleanup.
- Keep the numerical model and renderer separable so later visual apps can reuse either layer.
- Prefer a workspace package consumed at build time over an iframe unless isolation is an explicit
  requirement. The app may provide its own playground route for iteration.
- Preserve static-site deployment: no backend or runtime service is implied.
- Add focused deterministic checks for the model and browser-level smoke coverage for mounting, resizing,
  reduced motion, and teardown before replacing the site's current implementation.
