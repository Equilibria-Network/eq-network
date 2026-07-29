# Changelog

All notable changes to this site are recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/). This is a continuously-deployed static site, so
entries are dated rather than semver-tagged.

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
