# Audit 0002: code hygiene and maintainability deep dive

- Date: 2026-07-28
- Scope: the full `src/`, `public/`, and build/config surface at `main` `27615e9`
- Method: three independent review passes (correctness/bugs; architecture/modularity/maintainability;
  styling/accessibility/front-end-performance), each reading the actual code, with findings
  cross-checked between passes. Calibrated to a static marketing/research site: severity reflects
  visitor-facing impact and maintenance cost, not enterprise expectations.
- Companion to [audit-0001](2026-07-28-audit-0001-inherited-recon.md) (security/privacy/build/governance).
  Where the two overlap, audit-0001 is corrected here (see the SocialBar note under Dead code).

This document is the record of what was found. The work it surfaces is tracked as one umbrella task,
[`../tasks/task-0001-pristine-baseline.md`](../tasks/task-0001-pristine-baseline.md).

## Headline

The codebase is in genuinely decent shape for its age and origin (it began as an AI-scaffolded Vite
project and was migrated to Astro). The interactive React components — the part most likely to hide bugs
— were audited closely and came back **mostly clean**: animation loops and observers are torn down
correctly, the layout math is guarded against divide-by-zero and NaN, and every referenced PDF and image
asset resolves. The real work is in three areas: **a small set of real bugs**, a **42 MB unoptimized
image payload**, and **maintainability debt** (duplication, fragmented link data, dead code, and missing
lint/format tooling). None of it is on fire; all of it is worth clearing before feature work.

## What is genuinely good (verified, not assumed)

- **Content/presentation split is real.** Page copy and data live as typed files in `src/content/`;
  components render them. This is the codebase's strongest asset.
- **Interactive components are sound.** `LorenzAttractor`, `ScenarioVisual`, `NetworkVisualization`, the
  explainer `Step*` visuals, `ResearchGraph`, and the lab layout utilities were each read end-to-end:
  `requestAnimationFrame`, `setInterval`, `ResizeObserver`, and `IntersectionObserver` are all cleaned up;
  no stale-closure leaks; math guarded against zero/NaN; pre-mount draws blocked by dimension guards.
- **Type safety is enforced.** `tsconfig` extends `astro/tsconfigs/strict`; `astro check` gates the build;
  exactly one `any` in the whole tree.
- **Path aliases and dependency direction are clean.** Content never imports components; only one
  cross-group relative import exists.
- **Design tokens exist and are widely used**; CSS Modules scoping is working with no orphaned classes.
- **All 16 referenced `/pdfs/*.pdf` and every live `/img/**` reference resolve on disk.\*\*

## Findings

Severity is calibrated. "High" here means visitor-facing or a multiplier on future work, not an outage.

### Correctness bugs

| ID     | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Sev        | Where                                                                                                                                                |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ------------------------------------------- |
| B1     | **`Navbar` never receives `currentPath`.** `Layout.astro` renders `<Navbar client:load />` with no `currentPath`, so it defaults to `'/'` and `isHomePage` is always true. The "always show the logo on non-home pages" behaviour is therefore broken on all six non-home pages. Confirmed independently by two passes.                                                                                                                                          | med        | `src/layouts/Layout.astro:33`, `src/components/layout/Navbar.tsx:10,15,37`                                                                           |
| ~~B2~~ | **RETRACTED (2026-07-28) — not a bug.** The footer "Newsletter" link to `wizardryweekly.substack.com` was assumed by the reviewers to be a stray scaffold placeholder; the owner confirmed it is the organisation's actual weekly newsletter. The link is correct. (The organisation's Substack is `substack.com/@equilibria1`; the newsletter publication on it is Wizardry Weekly.) A reminder that "looks like a placeholder" is a hypothesis, not a finding. | —          | `src/components/layout/Footer.tsx:11`                                                                                                                |
| B3     | **`/favicon.ico` 404s on every page.** `Layout.astro` links `/favicon.ico`, but the file lives at `public/img/logo/favicon.ico`; there is no `public/favicon.ico`.                                                                                                                                                                                                                                                                                               | low        | `src/layouts/Layout.astro:25`                                                                                                                        |
| B4     | **`/favicon.svg` 404s on the playground page** — no such file exists. (Same root as audit-0001 F4.)                                                                                                                                                                                                                                                                                                                                                              | low        | `src/pages/lab/playground.astro:26`                                                                                                                  |
| B5     | **Contact-form fields have no `<label>`.** Inputs carry `id` + `placeholder` only; placeholders are not accessible names.                                                                                                                                                                                                                                                                                                                                        | low (a11y) | `src/components/layout/ContactForm.tsx:28-70`                                                                                                        |
| B6     | **Contact form posts to `formspree.io/placeholder` when the env var is unset** — the `                                                                                                                                                                                                                                                                                                                                                                           |            | 'placeholder'` fallback avoids a crash but yields a silently broken form. Consider disabling submit / showing a notice when the endpoint is missing. | low | `src/components/layout/ContactForm.tsx:7-8` |
| B7     | **`AboutTeam` click-outside is inverted** — the outside-click branch returns early instead of closing the flipped card, so clicks outside the section do not dismiss it.                                                                                                                                                                                                                                                                                         | low (UX)   | `src/components/about/AboutTeam.tsx:16-27`                                                                                                           |
| B8     | **`var(--color-bg, #fff)` references a token that does not exist** (the real token is `--bg-color`), so it silently falls back to hard-coded white every time.                                                                                                                                                                                                                                                                                                   | low        | `src/components/explainer/Explainer.module.css:25,62,73`                                                                                             |
| B9     | **Footer copyright `{new Date().getFullYear()}`** is evaluated at build and again at hydration; a page viewed in a later year than it was built triggers a React hydration patch/warning.                                                                                                                                                                                                                                                                        | low        | `src/components/layout/Footer.tsx:82`                                                                                                                |
| B10    | **`Hero` builds HTML with an unescaped regex and injects it via `dangerouslySetInnerHTML`.** `renderTextWithHighlights` builds `new RegExp('\\b'+highlight+'\\b','gi')` then sets `dangerouslySetInnerHTML`. Content is authored/trusted so not a live XSS vector, but a highlight with a regex metacharacter misbehaves, and it is a footgun if content ever becomes untrusted. Escape the term or match without a regex. Found by the cross-check pass.        | low        | `src/components/home/Hero.tsx:14-16,46,80`                                                                                                           |

### Front-end performance / asset weight

`public/img` is **42 MB** of images shipped unoptimized. No use of Astro's `astro:assets` anywhere;
every image is a raw `<img>`.

| ID  | Finding                                                                                                                                                                                                                                                                                                                                                                                                                 | Sev  |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| P1  | **Multi-megabyte auto-traced SVGs.** `philogeny.svg` is 6.7 MB / 10,366 `<path>` elements (its PNG twin is 900 KB); `dialogue.svg` 3.6 MB; `system-level-safety-evals.svg` 3.7 MB; `descartes.svg` 2.3 MB plus eight more roadmap SVGs at 8.8 MB total. These are heavy to download, parse, and rasterize. They should be optimized raster (WebP/AVIF) at display size, or run through `svgo` with path simplification. | high |
| P2  | **Oversized PNGs.** `about/team/jonas.png` is 3.4 MB at 2018×1910 (a headshot); `lab/pipeline-run.png` 972 KB at 2344×1487. Downscale to display size and convert to WebP.                                                                                                                                                                                                                                              | high |
| P3  | **No responsive images, no dimensions, near-zero lazy-loading.** Only 1 of ~22 `<img>` tags uses `loading="lazy"`; none set `width`/`height` (causing layout shift); no `srcset`. Adopting `astro:assets` `<Image>`/`<Picture>` fixes format, resize, `srcset`, dimensions, and lazy-load in one move. Highest-ROI change in the repo (42 MB → likely under 5 MB).                                                      | high |
| P4  | **Duplicate PNG+SVG twins** — 20+ heavy SVGs ship alongside a same-name PNG; only one is referenced per component. Delete the unused twin (usually the SVG, per P1).                                                                                                                                                                                                                                                    | med  |
| P5  | `about/advisors/david-hyland.jfif` — `.jfif` is JPEG with an odd extension some tooling mishandles; a `.png` twin exists. Normalize to one.                                                                                                                                                                                                                                                                             | low  |
| P6  | The parallax `texture.jpg` (400 KB) is a full-viewport fixed background at `opacity: 0.03` on every page. Compress hard or replace with a tiny tiling pattern / CSS gradient.                                                                                                                                                                                                                                           | low  |

### Accessibility (matters for a public site)

| ID  | Finding                                                                                                                                                                                                                                                                                        | Sev     |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| A1  | **Three pages have no `<h1>`:** home (`Hero.tsx` uses a logo image + `<p>`), research (`ResearchGraph.tsx` starts at `<h3>`), explainer (`StepNarrative.tsx` starts at `<h2>`). Add one visible-or-visually-hidden `<h1>` per page and fix heading order.                                      | high    |
| A2  | **Click handlers on non-interactive `<div>`s** with no `role`/`tabIndex`/`onKeyDown` — team-card flip, advisor link, partner card, research-card select. Not keyboard- or screen-reader-operable. Make them real `<button>`s.                                                                  | high    |
| A3  | **No global `:focus-visible` style;** `ContactForm.module.css:97` strips `outline` on inputs. Add a global focus ring; never remove outline without a replacement.                                                                                                                             | med     |
| A4  | **Animations ignore `prefers-reduced-motion`.** `LorenzAttractor` runs an unconditional rAF loop even when scrolled off-screen; the roughjs explainer visuals likewise. Only `ScenarioVisual` respects the setting. Gate rAF loops on reduced-motion and on `IntersectionObserver` visibility. | med     |
| A5  | **`CardModal` is not a real dialog** — no `role="dialog"`/`aria-modal`, no focus trap, no Escape-to-close, no focus restore.                                                                                                                                                                   | med     |
| A6  | Decorative `LorenzAttractor` `<canvas>` has no `aria-hidden="true"`.                                                                                                                                                                                                                           | low     |
| A7  | **Muted grey text likely fails WCAG AA.** `#999` on white ≈ 2.85:1 (fails 4.5:1), `#bbb` worse; both are used on text-like elements. Darken muted text to ≥ `#767676`.                                                                                                                         | med     |
| A8  | `Layout.astro` head has no Open Graph / Twitter / canonical tags; the nav is not wrapped in `<header>`; there is no skip-to-content link. Hurts link previews, SEO, and keyboard navigation.                                                                                                   | low/SEO |

### Maintainability / modularity

| ID  | Finding                                                                                                                                                                                                                                                                                                                                                                  | Sev  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---- |
| M1  | **`ProductsExploration.tsx` and `ProductsCoordination.tsx` are byte-identical except one content key**, with two identical 151-line CSS modules. Collapse to one data-driven `<ProductSection>` + one module, mapped over the two content entries.                                                                                                                       | high |
| M2  | **Social/nav/link data is hard-coded in three places with conflicting values.** `content/social.ts` (dead, unused), `Footer.tsx`, and `SocialBar.tsx` disagree on the GitHub org casing (`equilibria-xyz` vs `Equilibria-Network`) and Substack handle. At least one live link set is wrong. Centralize into one typed content module; confirm the canonical URLs first. | high |
| M3  | **Two nav lists hand-maintained** (`Navbar.navLinks`, `Footer.footerLinks`) — dedupe into shared content. (Tied to B1.)                                                                                                                                                                                                                                                  | med  |
| M4  | **Repeated section/card scaffolding.** `.container` is redeclared in 23 CSS modules, `.section` in most; the `section > container > header > grid` pattern and the image-card markup recur across about/products/lab. Extract a shared `<Section>` primitive and a `.container` utility. This is what will hurt first as pages grow.                                     | med  |
| M5  | **Two content-injection conventions.** `lab/**` prop-drills from a `Lab.tsx` orchestrator; `about/**`, `products/**`, `home/**` import the content singleton directly inside leaf components; roadmap mixes both. Pick one (orchestrator prop-drilling is more testable) and converge.                                                                                   | low  |
| M6  | **Hard-coded copy leaking into components** — section headings in `AboutTeam`/`AboutAdvisors`/`AboutPartners`, the footer tagline, and all of `404.astro` are inline rather than in content files, undercutting the otherwise-clean split.                                                                                                                               | low  |
| M7  | `404.astro` uses ~40 lines of inline `style=` and inline `onmouseover` JS — the only page not using CSS Modules. Convert for consistency.                                                                                                                                                                                                                                | low  |
| M8  | **Un-tokenized colour literals.** The brand navy `#003b7e` appears 23× literally (it is exactly `--color-primary`); the full grey ramp (`#999`, `#666`, `#444`, …) and status colours are ad-hoc with no `--color-grey-*`/`--text-muted`/`--success`/`--error` tokens. A rebrand would mean editing 30+ scattered literals.                                              | med  |
| M9  | **Breakpoint sprawl.** A rough 480/768/992/1400 system is polluted by ~20 one-off widths (`767`, `720`, `700`, `640`, …) used interchangeably. Codify 3–4 named breakpoints.                                                                                                                                                                                             | med  |
| M10 | **`content/lab.ts` is 508 lines** (and `research.ts` 209) — the roadmap content was correctly split into per-phase files; lab/research were not. Split `lab.ts` per scenario as it grows.                                                                                                                                                                                | low  |
| M11 | `PhaseBody.tsx:31` has the codebase's only `any` (`pub: any`); a `Publication` type already exists in `content/roadmap/types.ts`.                                                                                                                                                                                                                                        | low  |

### Dead / ambiguous code (Chesterton's Fence — confirm before deleting)

- **`SocialBar.tsx` + `SocialBar.module.css` are unused** (rendered nowhere; references `twitter.svg`/
  `discord.svg` that do not exist). (Separately, audit-0001 F3 — an "add `rel=noopener`" item that had
  listed `SocialBar` among others — was retracted as a false positive; all `target="_blank"` links already
  carry `rel="noopener noreferrer"`.)
- **`content/social.ts` is unused** (and its URLs are the wrong ones — see M2).
- **`PhaseDetails.tsx` is unused;** `PhaseBody.tsx` is imported by `Roadmap.tsx` but only inside a
  commented-out block. The intent (a detailed publications view returning later) is ambiguous. Resolve one
  way or the other rather than leaving the half-finished refactor in place.
- `LorenzAttractor.tsx:11` imports `getCssColor` unused; `lorenzUtils.ts:64` comments "RK4" but implements
  forward-Euler. Trivial.
- **Dead assets:** `socials/luma.svg`, `socials/substack.png` referenced nowhere; a full `public/` sweep is
  worthwhile, but do it _after_ the dead components are resolved (some "unreferenced" assets belong to them).

### Build / hydration / dependency (independent cross-check pass)

An independent second-opinion review surfaced these; each verified directly against the files.

| ID  | Finding                                                                                                                                                                                                                                                                                                                                                                             | Sev |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| C1  | **pnpm major mismatch.** CI pins pnpm 8 (`deploy.yml:24`) but `pnpm-lock.yaml` is `lockfileVersion: '9.0'`. This is a reproducibility hazard beyond audit-0001 F2: installing a v9 lockfile with pnpm 8 can resolve differently or fail. Add a `packageManager` field to `package.json`, align the CI pnpm version to it, and use `--frozen-lockfile`.                              | med |
| C2  | **Over-hydration.** Static sections are shipped as `client:load` React islands (`index.astro`, `about.astro`, `products.astro`, plus the layout). Hydrating non-interactive content ships and runs JS for nothing. Render static sections as Astro/static and hydrate only the genuinely interactive islands (Lorenz, lab/explainer visuals, research graph, contact form, navbar). | med |
| C3  | **Stale `@utils/*` path alias.** `tsconfig.json` defines `@utils/* -> src/utils/*`, but `src/utils/` does not exist (the README also references a `utils/` folder). Remove the alias and the README line, or create the folder when first needed.                                                                                                                                   | low |
| C4  | **`@astrojs/check` is a runtime dependency, not a devDependency** (`package.json`). It is a build-time tool; move it to `devDependencies`.                                                                                                                                                                                                                                          | low |
| C5  | **Dependencies materially behind.** Astro 4 (latest 7.x), React 18 (latest 19.x), `@astrojs/react` 3 (latest 6.x), `lucide-react` 0.x (latest 1.x). Pinned and not known-vulnerable, but a scheduled, isolated upgrade pass is warranted **after** the build is made reproducible (C1). Treat as its own careful effort, not a drive-by bump.                                       | med |

### Tooling gaps (maintainability guardrails that are absent)

- **No ESLint** (nor `@typescript-eslint` / `eslint-plugin-astro`). This is the single biggest missing
  guardrail — it would have caught the dead `SocialBar`, the unused `currentPath`, the unused import, and
  the `any`. Add a small, calibrated config.
- **No Prettier config and no `.editorconfig`.** Formatting is visibly inconsistent (mixed indentation
  mid-file). Near-zero cost to add; ends the drift.
- **No CI check beyond the build** (which does run `astro check` — good). Once ESLint/Prettier exist, add
  a cheap lint/format-check job, and adopt `--frozen-lockfile` (audit-0001 F2).
- **Correctly omitted at this scale:** husky / lint-staged / commitlint. A CI lint check is the right
  altitude; do not add pre-commit hooks.

## Where to start (the order that de-risks feature work)

1. **Owner confirmations** (they gate several fixes): canonical GitHub/Substack/newsletter URLs (B2, M2),
   and the intent of the ambiguous dead code (PhaseDetails/PhaseBody, SocialBar/social.ts).
2. **Tooling guardrails:** ESLint + Prettier + `.editorconfig` + a CI lint step + `--frozen-lockfile`.
   Cheap, and they stop the debt re-accumulating.
3. **The image payload:** adopt `astro:assets`, re-export the heavy SVGs, downscale the big PNGs. Biggest
   single visitor-facing win.
4. **The real bugs:** B1–B4 first (visible), then the a11y set (A1–A3).
5. **Maintainability refactors:** dedupe products (M1), centralize link data (M2/M3), tokenize colours
   (M8), extract the `<Section>` primitive (M4).

All of the above is decomposed into checkable sub-items in
[`../tasks/task-0001-pristine-baseline.md`](../tasks/task-0001-pristine-baseline.md).
