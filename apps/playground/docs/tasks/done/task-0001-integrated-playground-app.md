# Build the integrated collective-intelligence playground

- Provenance: task-0001 (owner request)
- Links back to: [`../../adr/0001-integrated-react-worker-workbench.md`](../../adr/0001-integrated-react-worker-workbench.md)
- Status: done
- Owner: unassigned
- Priority: now

## Problem

Five working browser simulations were trapped in a single static HTML prototype. The playground needs
an owned package and test surface while remaining a first-class route in the existing website.

## Done when

All five scenarios mount through a stable package export inside the canonical site layout; worker-backed
recomputation, narrative exploration, optional settings, comparison, desktop/mobile behavior, the
validation ladder, performance evidence, and app-scoped documentation are verified.

## Notes

- Preserve the inherited qualitative model behavior while creating a real package boundary.
- Keep every computation local; do not add analytics, accounts, or a backend.
- Source material: [`../../context/voice-notes.md`](../../context/voice-notes.md) and the
  [working paper](../../../public/cilib-whitepaper.pdf).
- Verification evidence is added when the task moves to `done/`.

## Verification

Completed on 2026-07-30.

- Five typed scenario and engine contracts pass.
- Default scientific trajectories remain pinned by golden tests; determinism, validation invariants, and
  the zero-coupling null pass.
- The production Astro route uses the shared navbar, page header, and footer.
- The original showcase alignment and numerical transformations are preserved behind scenario-specific SVG
  renderers.
- Named conditions are visible beside the player; live metrics and charts follow the playhead.
- Granular settings replace the story in the same details rail, with focus moved and restored deliberately.
- Browser smoke passes at desktop and 390 px, including worker recomputation, deep links, A/B comparison,
  pipeline view, reduced motion, sticky-title paint order, and no horizontal overflow.
- Playground and full static-site builds pass.

See the
[`implementation and performance audit`](../../audits/2026-07-30-implementation-and-performance.md) and
[`documentation reconciliation`](../../audits/2026-07-30-documentation-reconciliation.md).
