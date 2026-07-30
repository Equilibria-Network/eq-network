# Scenario platform architecture

## Product hierarchy

The page is a scenario reader first and a model workbench second. The default path is:

```text
choose scenario → understand the pressure → watch the live figure → read outcomes
                                                         ↘ open settings when useful
```

Controls are not the thesis. They are evidence that the underlying instrument is configurable and can be
extended into a more complete agent-based model.

The production composition at `/playground` uses the standard editorial `PageHeader`, followed by a
full-width scenario reader. A compact sticky chapter title spans the viewport. The left rail is one
hierarchical navigation surface: five scenarios expand into numbered story sections (`1`, `1.1`, `1.2`,
and so on), and choosing a section stages its authored preset, view, tick, and playback. Named conditions,
player controls, live metrics, the invariant showcase, and compact time-series charts occupy the centre.
The right rail is reserved for granular settings, evidence anchors, and modelling assumptions; it is
closed by default and never becomes a modal or a page inside the page.

Both desktop rails share `ResizableRailHandle`, an accessible layout primitive rather than
scenario-specific behavior. React owns two width values and publishes them as CSS custom properties on
the reader grid. The separator supports pointer capture, Arrow/Shift+Arrow/Home/End keyboard operation,
and double-click reset; it disappears when the responsive layout stacks. Rail width never enters the
scenario registry, URL, worker request, trajectory, or scientific state.

## Runtime boundaries

```text
Astro Layout (navbar, footer, metadata)
  └─ React scenario reader
      ├─ typed scenario definition (story, controls, presets, metrics)
      ├─ DOM views (scenario/story hierarchy, resizable rails, presets, transport, metrics)
      ├─ SVG views (scenario showcase, live time-series charts, pipeline)
      └─ SimulationClient
          └─ module Worker
              └─ pure engine → transferable typed-array Trajectory
```

- **Astro** remains the document and site-composition framework.
- **React** is the interaction coordinator because it is already the site's supported island runtime. It
  does not own global routing or numerical loops.
- **Web Workers + typed arrays** are the durable engine contract. Latest input terminates stale work.
- **SVG** preserves the co-author's exact showcase alignment and gives the brand drawing layer explicit,
  inspectable geometry. Semantically important results remain in the DOM.
- **Vite** is the package development/build harness; Astro is the production build.

## Why D3 is not the framework

D3 is a focused visualization toolbox, not an application or simulation architecture. Add small modules
such as `d3-scale`, `d3-array`, or `d3-force` only when a renderer needs their tested mathematics. Do not
let D3 own the DOM, React state, or the scenario contract. The current figures need no additional runtime
dependency.

## Scenario plug-in contract

A scenario definition declares:

- stable id, route hash, title, research question, and epistemic assumption;
- ordered story steps with an authored preset, view, tick, optional playback target, and speed;
- an evidence anchor and scenario-specific modelling notes for the bottom of Settings;
- defaults and seed;
- grouped parameter definitions and named presets;
- four headline metric definitions and one or more time-series definitions;
- an engine identifier that the worker registry can execute.

`rendering/scenes.ts` is a separate visual registry. It maps each scenario to one or more stable view keys
and renderers without making the typed content registry own SVG implementation details.

Adding a qualitatively new scenario should require:

1. a definition and scientific tests;
2. one worker engine adapter returning the common `Trajectory`;
3. one stage renderer (generic renderers may be reused);
4. registration in the scenario and engine registries.

It must not require editing the site layout, transport controls, settings UI, comparison logic, or
pipeline view.

## Package composition

```text
apps/playground/
├── src/
│   ├── components/               Shared DOM, SVG, and pipeline views
│   │   └── ResizableRailHandle   Pointer + keyboard grid-boundary primitive
│   ├── engine/
│   │   ├── types.ts              Trajectory and worker protocol
│   │   ├── run.ts                Engine registry boundary
│   │   ├── simulation.worker.ts  Numerical execution and transfers
│   │   ├── simulationClient.ts   Cancellation/latest-wins policy
│   │   └── kernel.js             Characterized equations (split only under tests)
│   ├── metrics/
│   │   └── live.ts               Playhead-derived headline metric projections
│   ├── rendering/
│   │   ├── scenes.ts             Scenario-specific showcase compositions
│   │   ├── sketch.ts             Brand-aligned SVG drawing primitives
│   │   └── types.ts              Renderer contracts
│   ├── scenarios/
│   │   └── registry.ts           Typed narrative/control/metric definitions
│   ├── App.tsx                   Generic scenario reader
│   └── embed.ts                  Stable Astro-facing export
├── test/                         Scientific contracts and browser journeys
└── docs/                         ADRs, architecture, budgets, audits, tasks
```

When several authors begin adding scenarios in parallel, decompose `scenarios/registry.ts` into one folder
per scenario (`definition.ts`, `renderer.ts`, `fixtures.ts`) and keep `scenarios/index.ts` as the only
registry. Do that before it becomes a merge hotspot, not before: five definitions remain easy to audit as
one set, while the large scientific kernel already has a test-gated extraction task.

## Scale-up ladder

Keep complexity behind the same contracts and advance only after measurements cross a threshold.

| Tier                      | Workload                                                          | Implementation                                                        |
| ------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------- |
| Current                   | tens–hundreds of agents, hundreds–thousands of ticks              | JS worker, `Float64Array`, bounded SVG views                          |
| Larger trajectories       | data no longer fits comfortably in one transfer                   | chunked columnar results, ring buffers, decimation, cached aggregates |
| Larger rendering          | SVG update p95 exceeds 16.7 ms or mark count becomes unwieldy     | Canvas/`OffscreenCanvas`, spatial indexing, level-of-detail           |
| Larger numerical models   | compute p95 exceeds the interaction budget after algorithmic work | Rust/WASM engine implementing the same request/result contract        |
| Very dense spatial models | Canvas remains the measured bottleneck                            | PixiJS/WebGL or a small WebGPU renderer adapter                       |

Canvas, WASM, and WebGPU are scale strategies, not starting frameworks. They add drawing, binary, build,
or debugging cost and should be earned by a representative benchmark.

## Architectural fitness functions

| Invariant                                                  | Evidence                                                                |
| ---------------------------------------------------------- | ----------------------------------------------------------------------- |
| UI work does not change inherited model behavior           | scientific goldens and the full validation ladder                       |
| Every scenario supplies complete UI and engine contracts   | scenario-contract tests                                                 |
| Same parameters and seed are deterministic                 | deterministic validation test                                           |
| Zero coupling remains the transfer-gap null                | scientific validation test                                              |
| A stale worker result never renders as the active scenario | scenario-tagged result guard plus browser scenario switch               |
| Live metrics and SVG geometry follow the playhead          | browser smoke at political ticks 0 and 150 plus invalid-number scan     |
| Story drives rather than decorates the run                 | browser checks authored preset, view, playhead, and playback activation |
| Simulation and measures fit one reader viewport            | browser checks compact title and chart bottom against viewport geometry |
| Site integration stays one page, not an iframe/modal       | browser checks shared chrome, settings-only rail, and reclaimed width   |
| Sticky scenario title owns the viewport paint layer        | real scroll geometry plus `elementFromPoint` paint-order assertion      |
| Rail sizing is accessible UI state, not model state        | browser checks pointer drag, both keyboard directions, and ARIA values  |

The browser journey is intentionally separate from the root check because it needs the canonical site
server running on port 4321.

## State and persistence

Scenario and rail-layout state are in React memory. The stable hash selects a scenario; optional seed and
parameter query values remain readable for backward-compatible shared URLs, but the interface does not
advertise sharing until that product function exists. Rail widths deliberately do not enter the URL or
model parameters. There is no database, account, local storage, remote execution, or hidden
cross-scenario state.

The four metric cards and the charts are projections of the active trajectory at the current playhead.
They are not cached endpoint summaries. Changing parameters or seed requests a complete new trajectory;
the player then reads the new run.

## Dependency policy

Prefer platform APIs and narrow packages. A new dependency needs an owned purpose, a measurable benefit,
static-host compatibility, and a removal path. State libraries, chart frameworks, schema validators, and
rendering engines are not justified by the current contracts.
