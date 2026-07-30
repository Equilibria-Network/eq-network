# Prototype the About and Roadmap visual-language redesigns

- Provenance: task-0010 (owner request)
- Links back to:
  [`../open/task-0009-page-prototype-programme.md`](../open/task-0009-page-prototype-programme.md),
  [`../open/task-0008-legal-and-about.md`](../open/task-0008-legal-and-about.md),
  [`../../context/10-visual-language.md`](../../context/10-visual-language.md),
  [`../../adr/0009-page-content-and-seo-contracts.md`](../../adr/0009-page-content-and-seo-contracts.md)
- Status: deferred — current pages remain serviceable; resume as the next editorial-page redesign batch
- Owner: unassigned
- Priority: next design batch

## Scope change

Products left the primary navigation when Playground became the product surface on 2026-07-30. Do not
create a new Products prototype. The existing route is governed by
[`task-0012-retire-products-route.md`](task-0012-retire-products-route.md).

## Goal

Create owner-reviewable prototypes for About and Roadmap that apply the established Equilibria
visual language without making the pages identical. Each page should use shared typed contracts and
components for repeated structure while retaining page-specific content and interactions.

Prototype routes:

- `/about/prototype`
- `/roadmap/prototype`

Canonical routes remain unchanged until each prototype is approved. Canonical and prototype routes must
consume the same typed content; do not fork copy to make a redesign easier.

## Shared foundation

Before page-specific styling:

- Give each page a `PageSeo` contract distinct from its visible `PageHeaderContent`.
- Use the common header hierarchy: eyebrow, short title, subtitle, then one or two summary sentences.
- Reuse `PageHeader`, `PageSidebar`, page status metadata, annotated rules, figure frames, cards, hatches,
  and tokens where their contracts fit.
- When two pages need the same new pattern, extract a typed data contract and shared component rather than
  copying markup or CSS. Keep customization bounded through content, props, variants, or slots.
- Centralize local media in typed content or an explicit asset manifest and verify every path.
- Prefer code-native mathematical, graph, sketch, and hatch visuals. Image generation may be used for a
  genuinely raster illustration when it adds value, but generated decoration is not required.

## Page scopes

### About

- Clarify what the research network is, how it relates to the registered association, and how people can
  participate or contact it.
- Reconcile shared organisation facts with Legal rather than duplicating them.
- Redesign philosophy, team, advisors, and partners around reusable editorial/card contracts.
- Preserve privacy and data minimisation when deciding which personal or governance details to publish.

### Roadmap

- Replace the bespoke `RoadmapHero` with the common page header contract.
- Redesign the phase selector, phase overview, status language, and sticky details behavior.
- Keep phase data in the existing typed roadmap content modules.
- **Do not redesign, replace, or materially edit the bottom `ResearchGraph`.** The prototype must compose
  the existing graph unchanged after the redesigned roadmap content. Graph work is a separate future task.

## Sequence and dependencies

1. Reconcile shared header, SEO, organisation, and phase-navigation contracts.
2. Prototype About first to complete the ordinary editorial/organisation pattern.
3. Prototype Roadmap next, reusing the established chrome and preserving `ResearchGraph`.
4. Review both together for visual coherence, then promote individually after owner approval.

## Verification

- `pnpm check` passes.
- Every prototype emits `noindex, nofollow` and has its own canonical prototype path.
- Desktop and mobile layouts are visually reviewed.
- Keyboard navigation, focus states, and semantic headings are checked.
- Reduced-motion and no-JavaScript reading experiences remain usable.
- Canonical and prototype routes import the same content sources.
- Local assets resolve in the production build.
- Roadmap’s bottom `ResearchGraph` has no source or behavioral diff.

## Done when

Both prototypes are available for review, use the shared data/component contracts, match the visual
identity, pass the verification gates, and leave canonical promotion as an explicit owner decision.
