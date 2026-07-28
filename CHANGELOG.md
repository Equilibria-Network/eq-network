# Changelog

All notable changes to this site are recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/). This is a continuously-deployed static site, so
entries are dated rather than semver-tagged.

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
