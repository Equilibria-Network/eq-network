# Promote the guided playground player

- Provenance: owner revision
- Links back to: [`../../adr/0001-integrated-react-worker-workbench.md`](../../adr/0001-integrated-react-worker-workbench.md)
- Status: done
- Owner: unassigned
- Priority: now

## Problem

The integrated app had preserved the numerical models but reduced the inherited narrative to passive copy.
Its tall sticky title and metrics also crowded the figure, the details rail could not close, and the
temporary Lab route and unavailable Share control no longer matched the product.

## Outcome

- `/playground` is canonical and indexable; `/lab/playground` redirects.
- Each scenario exposes ordered, typed story steps that operate the existing preset, view, playhead,
  playback target, and speed controls without changing numerical transformations.
- The compact player uses the repository owner's local SVG controls, keeps metrics live above the figure,
  and lets Story or Settings close so the stage reclaims the third column.
- Per-scenario assumptions and the full fixed-rule/optimizer reading caveat are visible again.
- The site hero explains CI Lib as a laboratory and wind tunnel for institutions.

## Verification

Completed on 2026-07-30:

- deterministic scenario, scientific-golden, and validation tests pass;
- playground package and full Astro static-site builds pass;
- the browser journey passes at 1440 px and 390 px, including story-driven playback, settings replacement,
  rail closure, stage-width recovery, live metrics, sticky paint order, and the canonical navigation route;
- visual inspection confirms the compact header, metrics, icon controls, and story rail fit around the
  inherited 880 × 400 showcase.
