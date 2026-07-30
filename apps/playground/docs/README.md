# Playground documentation

App-scoped documentation for the Collective Intelligence Playground. Repo-wide decisions remain in
[`../../../docs/`](../../../docs/README.md).

## Layout

- [`adr/`](adr/) — decisions that govern this app.
- [`tasks/`](tasks/README.md) — open and completed implementation work.
- [`context/`](context/00-orientation.md) — product and research context, including the co-author notes.
- [`architecture/`](architecture/scenario-platform.md) — module boundaries and scale-up path.
- [`performance/`](performance/budget.md) — adopted interaction and delivery budgets.
- [`runbooks/`](runbooks/development.md) — local build and verification procedures.
- [`privacy/`](privacy/data-map.md) — data-flow inventory.
- [`audits/`](audits/README.md) — dated review evidence.
- [`handoffs/`](handoffs/README.md) — temporary continuation notes for unfinished work.

The app is a static client embedded in the Astro site. Its running build and tests are authoritative
when prose drifts.

## Current status

- Canonical route: `/lab/playground/` inside the shared site layout.
- Production boundary: `@eq-network/playground/embed`, consumed at Astro build time.
- Scientific boundary: deterministic worker-owned trajectories protected by golden and validation tests.
- Rendering boundary: scenario-specific SVG showcases plus DOM metrics and SVG time-series charts.
- Open work: scientific module extraction and retirement of unused pre-restoration Canvas prototypes; see
  [`tasks/README.md`](tasks/README.md).
