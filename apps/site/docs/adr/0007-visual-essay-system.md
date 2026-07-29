# ADR-0007: Build visual essays from a shared shell and page-specific models

- Status: Accepted
- Date: 2026-07-28

## Context

The site is expected to publish multiple visual essays: thesis pages, research explainers, and blog-like
pieces where prose advances beside an evolving graph, simulation, mathematical sketch, or interactive
demonstration.

The first thesis prototype proved the layout, but its scroll observation, sticky figure, progress controls,
closing links, and responsive behavior were coupled to one page. Copying that component would make each new
essay expensive to maintain. Making one universal visualization API would create the opposite problem:
graphs, agent simulations, and interactive proofs do not share a useful domain model.

## Decision

Use a two-part visual-essay architecture:

1. A shared `VisualEssay` shell owns the repeatable reading contract: full-viewport introduction,
   two-column scrollytelling layout, active-step observation, bounded sticky headings, sticky visual frame,
   progress navigation, responsive behavior, and reduced-motion-safe presentation.
2. Each essay supplies typed content and a page-specific visual renderer. The renderer receives the active
   state and owns its domain model, simulation, controls, semantics, and transitions.

The contract lives in `src/components/visual-essay/types.ts`. Page copy remains in `src/content/`. An essay
route composes the shared shell with one renderer instead of copying the shell or registering visual types
in a global switch statement.

## Alternatives considered

### Copy the thesis implementation for each essay

Rejected because scroll behavior, accessibility, and mobile fixes would drift across copies.

### One schema describing every possible visualization

Rejected because it would force unrelated systems into a large conditional API. A force-directed graph,
cellular automaton, and interactive equation need different state and controls.

### MDX plugin with embedded visual directives

Deferred. It may become useful after several essays establish a stable authoring vocabulary. Introducing a
content runtime before that vocabulary exists would be speculative infrastructure.

## Consequences

- New essays get the established reading interaction by providing a typed document and renderer.
- Visual semantics stay local and can use D3, canvas, SVG, or ordinary React without changing the shell.
- Improvements to sticky headings, progress, responsive layout, and accessibility apply to every essay.
- The shell is deliberately a React island, so each essay ships client-side code. Bundle weight must be
  watched as renderers become more complex.
- The first contract is intentionally small. Add a shared capability only after a second essay needs it.

## Compliance

- `pnpm build` type-checks every document and renderer against the shared contract.
- New visual essays should import `VisualEssay` rather than copy its observer and layout code.
- User-facing strings remain in `src/content/`.
- Every animated renderer must honor `prefers-reduced-motion`.

## Revisit when

- Two or more essays need rich inline authoring, suggesting an MDX or content-collection layer.
- Renderers need expensive computation, suggesting workers or lazy-loaded sub-islands.
- A second essay reveals that part of the current contract is thesis-specific.
