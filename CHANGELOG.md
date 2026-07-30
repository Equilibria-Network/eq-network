# Changelog

All notable changes to this site are recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/). This is a continuously-deployed static site, so
entries are dated rather than semver-tagged.

## [2026-07-30] — Scientific-notebook explainer

### Changed

- Promoted the clean scientific-notebook renderer to canonical `/explainer` while retaining the shared
  typed seven-step thesis document and `VisualEssay` reading shell.
- Restored the deployed explainer's full visual progression: integrated society, cascading defection, bad
  equilibria, uncertain cooperation, four research lenses, disconnected disciplinary subnetworks, and a
  compositional bridge.
- Flattened shared visual-essay figures into the page by removing the visible frame, registration marks,
  and figure/status strip while preserving an invisible sticky layout boundary.
- Removed the redundant numeric state rail so the document scroll is the sole scene selector, expanded the
  drawing column, and reduced the persistent model from 28 to 20 actors with selectively pruned links.
- Replaced geometric triangle and institutional marks with straight-edged drafted forms, added restrained
  semantic hatching, and kept a persistent shape key across all seven scenes. The key now states the
  redundant fill contract: humans are open, AI agents use a light hatch, and institutions use a dense
  cross-hatch.
- Added explicit strategic-state keys where color changes meaning: green/cooperate and red/defect in the
  defection and equilibrium scenes, plus amber/unresolved in the uncertainty scene.
- Routed defection, equilibrium, and bridge annotations from live node geometry. The final state now shows
  Equilibria as one participant in a distributed cross-field mesh rather than as a central information hub.
- Moved the local-payoff label beside its initiating actor and routed its short arrow as a two-control-point
  cubic S gesture.
- Reconciled the corner notation with each scene: siloing is expressed as sparse between-field edges and
  bridging as added peer-to-peer edges, avoiding claims of informational independence or central
  aggregation.
- Replaced the explainer's Products closing link with the integrated Simulation Playground.

### Added

- Shared scientific-diagram color tokens for cooperation, defection, uncertainty, and the four research
  fields, with shape, line, and text cues retained for non-color interpretation.
- A dependency-free seven-state desktop/mobile browser regression for the explainer's narrative meanings,
  hydration, accessibility text, and horizontal overflow.

## [2026-07-30] — Integrated collective-intelligence playground

### Added

- A typed React playground package with five deterministic browser simulations, worker-owned numerical
  execution, live metrics, scenario presets, playback controls, A/B comparison, and shareable state.
- Scientific golden tests, scenario-contract tests, a validation ladder, and a dependency-free desktop
  and mobile browser smoke journey.
- App-scoped architecture, task, performance, privacy, audit, and development documentation.

### Changed

- Merged the five-scenario chapter rail and scenario guide into one left-hand hierarchy, with numbered
  sections such as `1 Commons`, `1.1`, and `1.2` that operate the live story.
- Reserved the right rail for Settings, hid it by default, and moved each scenario’s evidence anchor and
  modelling assumptions to the bottom of that configuration.
- Reduced the sticky title to 52 px, compacted the time-series drawings, and added browser geometry
  coverage requiring the simulation and both measures to fit in one snapped desktop viewport.
- Flattened the reader by removing decorative borders, distributing view and condition selectors evenly,
  and normalizing the local SVG controls to the monochrome brand palette.
- Preserved the brand prototype's solid fills and localized hatches while removing shadows, decorative
  rounding, and lift-on-hover treatments. The canonical visual-language contract now prohibits simulated
  elevation and tonal gradients, permits CSS gradients only for discrete hatch/grid/rule patterns, and
  makes borders purposeful exceptions.
- Set the scenario/story rail to open at its 480 px maximum, increased navigation type to 14–16 px, hid
  its scrollbar, and gave the entire rail a very light gray ground. Mobile story prose retains a 14 px
  minimum.
- Simplified selected scenarios and numbered story steps to bold navy type with a plain blue underline;
  views and presets retain navy backgrounds with white text. All hatched control underlines are removed.
- Added a shared accessible rail-resizer for both the story and Settings panels, with pointer capture,
  keyboard bounds, double-click reset, responsive removal, and browser regression coverage.
- Reduced reader structure to three rules: one below the sticky title and one full-height draggable
  divider for each visible side rail. The full edge is draggable, with no central grip.
- Promoted the playground from `/lab/playground` to the indexable `/playground` product route, retaining a
  static redirect for old links and updating navigation, calls to action, sitemap, tests, and docs.
- Replaced passive scenario copy with typed story scenes that actively select the authored preset, view,
  playhead, playback endpoint, and speed across all five models.
- Compacted the sticky scenario header and live metrics and replaced text transport controls with the
  local SVG icon set.
- Removed the unavailable Share action and restored the model-reading guide, per-scenario assumptions, and
  fixed-rule/optimizer caveats from the inherited prototype.
- Reframed the hero around a laboratory for stress-testing coordination systems and the CI Lib “wind
  tunnel for institutions” product purpose, removed the runtime/status card, and widened the title and
  explanatory copy across the available header.
- `/lab/playground` now uses the shared Astro layout, navbar, page header, and footer instead of injecting
  the inherited standalone HTML document.
- The primary navigation now links to **Playground** instead of **Products**. The legacy `/products` route
  remains unlinked until its retirement behavior is decided. Opening that clean `/playground/` link
  resolves to Commons instead of retaining or defaulting to the fifth scenario.
- The original co-author showcase geometry and simulation transformations are preserved behind an SVG
  rendering layer; metrics and time-series charts update with the live playhead.
- Scenario presets are first-class player controls. Granular settings replace the story in the same
  right-hand details rail instead of opening a modal.

### Performance

- Numerical work runs in a cancellable module worker and transfers typed arrays.
- Adopted local budgets and preserved dated Lighthouse evidence; later development-server measurements
  are explicitly separated from the production-build baseline.

## [2026-07-28] — Dependency and toolchain upgrade

A board-wide version bump off the inherited majors, in verified layers.

### Changed

- **Astro 4 to 7**, React 18 to 19 (`@astrojs/react` 3 to 6), `@formspree/react` 2 to 3, `lucide-react`
  0 to 1, and TypeScript 5 to 6.
- **Root toolchain:** ESLint 9 to 10, `eslint-plugin-astro` 1 to 3, `globals` 15 to 17, and the
  Prettier/config-prettier stack.
- **GitHub Actions** bumped to their latest majors (`checkout` 7, `setup-node` 7,
  `upload-pages-artifact` 5, `deploy-pages` 5, `pnpm/action-setup` 6).
- React 19 migration touch-ups: an explicit initial value for the one bare `useRef`, and removal of the
  now-dead `import React` from 28 component files (the automatic JSX runtime no longer needs it).

### Removed

- The last unreferenced image assets (`useful-image-stash/`).

### Security

- Clears the bulk of the outstanding dependency alerts by moving off the old majors.

### Notes

- TypeScript **7** (the native compiler) is deferred: `@astrojs/check` and `typescript-eslint` do not
  support it yet. See [ADR-0005](apps/site/docs/adr/0005-dependency-upgrade-2026-07.md); ADR-0004 (i18n-readiness)
  is now Accepted.

## [2026-07-29] — Playground: two acts of the question-first redesign

First feature work on the model suite after the forest-walk session (see `DESIGN-LOG.md` for the
design record and decisions).

### Changed (same day, evening)

- **"Economic · flows" tab withdrawn from the scenario bar** pending WP1 — the economics working
  paper that will properly back the rebuilt Economic tab (paper-first pivot; see `DESIGN-LOG.md`).
  The module, engine, and its validation rungs remain in the page.

### Added

- **The vote (political tab):** every 20 ticks the median citizen opinion is enacted — full
  turnout, nothing rigged. New VOTE chart, a `vote responsiveness` badge, and the hollow-democracy
  story beat: responsiveness 0.73 organic / 0.39 amplified / 0.61 defended (port, 8 seeds). Labeled
  as a website-side sketch — not yet in the engine.
- **"Economic · flows" tab (design sketch, orange dot):** a Leontief-lite flow economy — six
  sectors, households that buy, AI capital that must out-earn its upkeep. Money strictly conserved.
  Headlines: a real knee (automation dies below eff ≈ 0.3, holds a third of wealth by 0.4) and
  "richer, and not yours" (output grows 23 → 25 while AI wealth share goes 0 → 50%).
- **`DESIGN-LOG.md`** at the root: the shared, newest-first design log for website work.
- Four new validation-ladder rungs (money conservation, the upkeep knee, output-holds-while-wealth-
  concentrates, defense-levers ordering) — the in-page ladder is now 37/37.

### Fixed

- Restored work dropped by the 2026-07-29 stash dance during the monorepo pull: the page preamble
  ("these are toy models / nothing here pushes back") and its self-test, the headless-harness guard
  on the assumptions rung, and the optimiser-gap notes in the lab-content-review audit.

## [2026-07-28] — Engineering baseline

The first tracked entry. A cleanup pass to bring the inherited site to a clean, enforceable baseline
before feature work, shipped to production in one merge.

### Added

- **`/privacy` page** disclosing what data is collected, why, the processors, retention, and rights,
  linked from the footer and from a notice under the contact form. (Draft, pending legal review.)
- **Accessibility:** a skip-to-content link, `<header>`/`<main>` landmarks, per-page `<h1>`s, a global
  `:focus-visible` style, `prefers-reduced-motion` support on the animated visuals, a real dialog
  (focus trap / Escape / restore) for the research modal, and labels on the contact form.
- **Open Graph, Twitter, and canonical meta** on every page.
- **Tooling:** a `pnpm check` gate (format + lint + build), a CI workflow, an ESLint + Prettier +
  EditorConfig setup, and a CI guard that keeps `AGENTS.md`/`CLAUDE.md` in sync.
- **Documentation:** `CONTRIBUTING.md`, ADRs, a task tracker, audits, a data map, and a deploy runbook.

### Changed

- **Restructured into a pnpm-workspace monorepo** (`apps/site`, `packages/design-system`).
- **All user-facing copy moved into typed content files** under `apps/site/src/content/`, so the site
  is ready for internationalisation without a codebase-wide string hunt.
- **Image payload reduced ~37 MB** (heavy assets converted to sized WebP; below-the-fold images lazy-load).
- **Licensed MIT.**
- Reproducible CI builds (pinned pnpm, frozen lockfile).

### Removed

- Dead code (`SocialBar`, `content/social.ts`, the dormant roadmap detailed-view components) and
  ~37 MB of unreferenced image assets, in one isolated commit kept as a restore point.

### Fixed

- Navbar active-state highlighting (the current path was not passed through).
- A 404 favicon on `/lab/playground`.
- A CSS-variable typo in the explainer styles.
- Regex-metacharacter escaping in the hero's highlight rendering.
- The about-page team card not dismissing on an outside click.

### Security / Privacy

- No secrets in the repository; the Formspree endpoint is a build-time value injected from a
  repository secret. A data map records the two US processors (GitHub Pages, Formspree).
