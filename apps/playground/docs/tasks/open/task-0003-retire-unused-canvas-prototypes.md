# Retire unused Canvas renderer prototypes

- Provenance: task-0003 (documentation reconciliation)
- Links back to:
  [`../../architecture/scenario-platform.md`](../../architecture/scenario-platform.md),
  [`../done/task-0001-integrated-playground-app.md`](../done/task-0001-integrated-playground-app.md)
- Status: todo
- Owner: unassigned
- Priority: later

## Problem

`SimulationCanvas.tsx` and `TrajectoryChart.tsx` are unreferenced remnants of the first integration pass.
Production now uses `ShowcaseScene.tsx` and `ScenarioCharts.tsx` so the original co-author geometry can be
preserved in SVG. Keeping two inactive rendering systems makes architecture discovery ambiguous.

## Done when

The two unused components and their now-unused CSS selectors are removed with explicit deletion approval;
source imports remain clean; scientific tests, browser smoke, and both builds pass; and architecture docs
still describe the production renderer accurately.

## Notes

Do not use this task to rewrite the active SVG showcase or numerical kernel. Git history and the inherited
HTML prototype remain the recovery sources for abandoned Canvas experiments.
