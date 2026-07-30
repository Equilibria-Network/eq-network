# ADR-0001: integrated React workbench with worker-owned simulation

- Status: Proposed
- Date: 2026-07-30

## Context

The inherited playground was a self-contained HTML document. The desired product is a full-featured
application inside the existing Equilibria website, not a second website or an isolated dashboard. Its
scientific runtime must scale independently from storytelling and rendering without blocking the site UI.
The original co-author showcase geometry and numerical transformations are invariants for the first
integrated release.

## Decision

Use Astro's existing `Layout` for production chrome and mount a stable React package export at
`/playground`. React owns orchestration and accessible controls, not numerical work. A module Web
Worker owns simulation; its public request/result contract returns transferable typed-array trajectories.
Scenario-specific SVG renderers own the animated scientific figures and time-series drawings, while the
DOM owns prose, controls, metrics, and accessibility. A full-width sticky scenario header owns the current
chapter. Named presets are first-class player controls. Typed story steps coordinate those same presets,
views, ticks, and playback targets. The left scenario rail expands into those numbered story sections.
The right details rail is settings-only, closed by default, and ends with evidence anchors and assumptions.
It closes to return its width to the figure instead of opening a modal.

Keep the verified JavaScript kernel pure and renderer-independent. Define scenarios through typed metadata
for narrative beats, controls, presets, metrics, and series. Preserve a Vite standalone entry as a fast
development harness, but treat Astro's static site build as the production artifact.

## Consequences

- The page uses the same navbar, footer, fonts, metadata, and hosting model as the rest of the site.
- Slider churn cancels stale work; simulation cannot create main-thread long tasks.
- New scenario content uses one typed contract; new numerical engines implement the worker boundary.
- React and SVG stay replaceable behind that boundary. Canvas, OffscreenCanvas, WASM, or WebGPU are
  scale-up options triggered by measurement rather than foundational dependencies.
- The current characterized kernel remains one file while its equations are unchanged. Per-scenario
  extraction is a separate, test-gated scientific refactor.

## Revisit when

Measured workloads exceed the thresholds in the architecture and performance documents, or the site
changes its primary island framework.

## Sources

[`../../../../docs/adr/0001-monorepo-topology.md`](../../../../docs/adr/0001-monorepo-topology.md);
[`../../../../docs/adr/0003-integrated-playground-deployment.md`](../../../../docs/adr/0003-integrated-playground-deployment.md);
[`../../README.md`](../../README.md); [`../architecture/scenario-platform.md`](../architecture/scenario-platform.md);
the working paper and inherited `apps/site/prototypes/playground.html`.
