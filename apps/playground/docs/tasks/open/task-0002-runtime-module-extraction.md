# Extract the playground runtime by stable responsibility

- Provenance: task-0002 (migration follow-up)
- Links back to: [`../../adr/0001-integrated-react-worker-workbench.md`](../../adr/0001-integrated-react-worker-workbench.md)
- Status: todo
- Owner: unassigned
- Priority: soon

## Problem

The UI, renderer, worker client, typed contracts, and pure numerical kernel are now separate. The
characterized numerical port still contains all five engines in one file to avoid mixing equation changes
with architectural migration.

## Done when

Each scientific engine and its fixtures live in an owned module, with shared numerical primitives extracted
once and the full validation ladder unchanged.

## Notes

Extract behind passing characterization tests. Do not rewrite model equations while moving them. Preserve
`runScenario()` and the worker request/result contract.
