# Regenerate site imagery for a consistent visual identity

- Provenance: task-0006
- Links back to: [`../../adr/0003-visual-language-system.md`](../../adr/0003-visual-language-system.md),
  [`task-0002-visual-language-alignment.md`](../open/task-0002-visual-language-alignment.md),
  [`../../context/10-visual-language.md`](../../context/10-visual-language.md)
- Status: proposed (future) — blocked on defining the visual identity first
- Owner: unassigned
- Priority: later (pairs with the per-page CSS/UX redesign)

## Goal

Beyond the mechanical image _optimization_ already done (task-0001 Phase 4), run every site image through a
generation/regeneration pass so the imagery shares one deliberate visual identity — icons, portraits,
diagrams, textures, and hero art all under the same aesthetic umbrella, matching the redesigned CSS.

## Dependencies / sequencing

1. **Define the visual identity first.** This can't start until the aesthetic is decided (palette, line
   style — e.g. the hand-drawn roughjs motif — illustration style, iconography rules). That definition is
   part of the design-language work in [ADR-0003](../../adr/0003-visual-language-system.md) /
   [`../../context/10-visual-language.md`](../../context/10-visual-language.md).
2. **Pairs with the per-page CSS/UX redesign** (task-0002 Stage 2) — regenerate a page's imagery as its
   look-and-feel is reworked, so assets and layout land together.
3. **Tooling:** to use the owner's in-progress codex image / website-asset generation skill (OS-INT on the
   best structure is underway). Prefer that skill's pipeline once ready.

## Done when

Every image asset is either regenerated to the defined identity or deliberately kept, catalogued, and the
result is consistent across pages. Optimization (WebP/sizing/lazy-load) from Phase 4 is preserved or re-applied.

## Notes

- This supersedes ad-hoc per-image fixes: do it as a coordinated pass once the identity exists, not piecemeal.
- Keep provenance/licensing in mind for any regenerated assets that replace third-party or research figures.
