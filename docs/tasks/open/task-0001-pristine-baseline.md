# Pristine baseline — clear cleanup/housekeeping before feature work

- Provenance: task-0001 (umbrella)
- Sources: [`../../audits/2026-07-28-audit-0001-inherited-recon.md`](../../audits/2026-07-28-audit-0001-inherited-recon.md),
  [`../../audits/2026-07-28-audit-0002-code-hygiene-deep-dive.md`](../../audits/2026-07-28-audit-0002-code-hygiene-deep-dive.md)
- Status: in-progress (cleanup started); most sub-items todo
- Owner: unassigned
- Priority: now — this is the gate before "big dev"

## Goal

Get the repository to a clean, enforceable baseline — bugs fixed, image payload sane, tooling guardrails
in place, dead code resolved, and the worst duplication removed — so that new feature work starts from a
known-good state instead of compounding debt.

## Done when

All sub-items below are checked or explicitly deferred with a reason; ESLint + Prettier + a CI lint check
are running; the image payload is materially reduced; and the confirmed bugs (B1–B4) are fixed.

Visual-identity alignment is tracked separately in
[`task-0002-visual-language-alignment.md`](task-0002-visual-language-alignment.md) (a larger design effort).

---

## Phase 0 — Already done (this pass)

- [x] Untrack and gitignore `.claude/settings.local.json`; harden `.gitignore` (incl. Windows entries).
- [x] Add `AGENTS.md` + `CLAUDE.md` agent guardrails; add root `CONTRIBUTING.md`; set up `docs/`.
- [x] Back-fill ADR-0001 (Astro static) and ADR-0002 (Formspree) — **Proposed, awaiting owner sign-off**.
- [x] Two audits recorded (recon + deep-dive).

## Phase 1 — Owner confirmations (these gate other fixes)

- [x] **GitHub org — resolved:** canonical is `github.com/Equilibria-Network` (the repo's own origin); the
      live Footer already uses it. The dead `social.ts` value `github.com/equilibria-xyz` is stale/wrong.
- [x] **LinkedIn — resolved:** `linkedin.com/company/equilibria-network` (Footer and social.ts agree).
- [x] **Substack / Newsletter — resolved:** the Substack is `substack.com/@equilibria1`; the "Newsletter"
      link to `wizardryweekly.substack.com` is **correct** (the newsletter publication on that Substack) —
      B2 retracted. The dead `social.ts` value `equilibria.substack.com` is the stale one.
- [x] **X/Twitter — resolved:** no X/Twitter account exists; do not add one. Remove the dead `social.ts`
      twitter reference when clearing dead code.
- [x] **Dead-code intent — resolved:** `SocialBar.tsx` + `content/social.ts` are unused and their
      values are stale; the correct fix is one authoritative `social.ts` (canonical values above) consumed by
      the Footer, and delete the duplicate `SocialBar` — folded into task-0002 M2 (one source of truth for
      links). **Roadmap view — owner decided 2026-07-28: delete both.** The detailed publications-per-phase
      view is not coming back; remove the dormant `PhaseBody` (and its commented import in `Roadmap.tsx`) and
      the unused `PhaseDetails.tsx` in the final dead-code commit.
- [x] **License — resolved: MIT.** `LICENSE` added (`Copyright (c) 2024-2026 Equilibria Network`).
      (Note: MIT is a software licence; the research PDFs/prose under `public/` may warrant separate terms —
      revisit if any are third-party or meant to be all-rights-reserved.)
- [x] ADR-0001 accepted; ADR-0002 withdrawn (contact-form handler is feature work — see task-0003).

## Phase 2 — Tooling guardrails (cheap; stops debt re-accumulating)

- [x] **ESLint** — flat config (`@eslint/js` + `typescript-eslint` + `eslint-plugin-astro`,
      Prettier-compatible); fixed all 7 findings (unused symbols, an `any`); generated `env.d.ts` ignored.
- [x] **Prettier** config + **`.editorconfig`** — added; one-time `prettier --write` applied.
- [x] **CI lint/format-check step** — added `.github/workflows/ci.yml` (format:check + lint + build on
      pushes and PRs).
- [x] **CI reproducibility (C1 + F2) — done:** root `package.json` pins `packageManager: pnpm@11.17.0`;
      CI uses `pnpm/action-setup@v4` (reads that pin) and `pnpm install --frozen-lockfile`; lockfile
      regenerated for the workspace. Landed with the workspace migration (task-0005).
- [x] **C3** Removed the stale `@utils/*` tsconfig alias.
- [x] **C4** Moved `@astrojs/check` to `devDependencies`.
- [ ] **C5** Schedule an isolated dependency-upgrade pass (Astro 4→7, React 18→19, `@astrojs/react` 3→6,
      `lucide-react` 0→1) — **after** CI reproducibility (C1) lands. Its own careful effort; likely a
      Proposed ADR given the Astro/React major jumps.
- [ ] Do NOT add husky / lint-staged / commitlint — wrong altitude for this project (recorded in
      CONTRIBUTING §3).

## Phase 3 — Confirmed bugs

- [x] **B1** `Layout.astro` now passes `currentPath={Astro.url.pathname}` to `<Navbar>`.
- [x] **B2** No change needed — retracted (the newsletter link is correct; see audit-0002).
- [x] **B3** `/favicon.ico` now exists at `public/favicon.ico` (copied from `img/logo/`).
- [x] **B4** Playground favicon points to `/favicon.ico` (avoids shipping the 518 KB logo SVG).
- [x] **B8** `var(--color-bg …)` → `var(--bg-color …)` in `Explainer.module.css` (3 refs).
- [x] **B6** `ContactForm` shows a notice instead of a silently-broken form when the endpoint is unset.
- [x] **B7** `AboutTeam` click-outside now dismisses the flipped card on any non-card click.
- [ ] **B9** Footer year hydration nuance — left as-is (low; documented).
- [x] **B10** `Hero.renderTextWithHighlights` now escapes regex metacharacters in the highlight term.
- [ ] **C2** Reduce over-hydration: render static sections as Astro/static; hydrate only genuinely
      interactive islands (perf; overlaps Phase 4).

## Phase 4 — Image payload (biggest visitor-facing win: ~42 MB → target < 5 MB)

- [x] **P1** Heavy auto-traced SVGs re-exported to sized WebP (philosophy icons, ai_lab, system, roadmap
      portraits); references updated in content files.
- [x] **P2** Oversized PNGs downscaled to WebP (philogeny, the 4 pipeline images).
- [x] **P5** `david-hyland.jfif` → `.jpg`; reference updated.
- [x] **P6** Parallax `texture.jpg` 400 KB → 40 KB; `white-paper-texture.jpg` 1.1 MB → 64 KB (in place).
- [x] Lazy-loading (`loading="lazy" decoding="async"`) added to 17 below-the-fold images.
- [ ] **P3 (deferred follow-up)** Full `astro:assets` `<Image>`/`<Picture>` migration (srcset, dimensions,
      build-time optimization). Likely a Proposed ADR. Not done — the above captured the bulk of the win
      without the structural asset-import change.
- [ ] **P4 — dead assets to delete in the final dead-code commit (~36 MB):** the now-unreferenced originals
      replaced above, their PNG twins, and pre-existing dead assets. Confirmed zero-reference:
      `about/philosophy/{dialogue,partner,play,bulb,rubik,test}.svg` + the `{partner,play,bulb,rubik,test}.png`
      twins; `home/audience/ai_lab.{svg,png}`; `home/publications/{system.svg,system.png,philogeny.png,philogeny.svg,system-level-safety-evals.svg,system-level-safety-evals.webp}`;
      `roadmap/{wiener,ostrom,beer,hume,nash}.{svg,png}` and the pre-dead `roadmap/{descartes,forrester,pareto}.{svg,png}`;
      `lab/pipeline-{run,build,visualisations,schedule}.png`; `about/team/jonas.png`;
      `about/advisors/david-hyland.{jfif,png}`; plus the earlier-noted `socials/{luma.svg,substack.png}`.
      Verify zero-reference again at removal time.

## Phase 5 — Accessibility (public site; real users) — DONE

- [x] **A1** Added a top-level `<h1>` to home, research, explainer (visually hidden via `.sr-only`
      where the design has no visible page title); other pages already had one. Playground prototype's
      internal h3-before-h2 is inside `prototypes/playground.html` (raw-injected, outside the component
      tree) and is left for the playground's own work.
- [x] **A2** Team flip-cards → `<button>` (with `aria-pressed`); advisor/partner cards that open a link
      → `<a target="_blank" rel="noopener noreferrer">` (also dropped the popup-blockable `window.open`).
      The research tech-tree cards were already real `<button>`s.
- [x] **A3** Added a global `:focus-visible` outline in `global.css`.
- [x] **A4** `LorenzAttractor` draws a static frame under `prefers-reduced-motion` and only animates while
      on-screen (IntersectionObserver); `NetworkVisualization` snaps to the target layout under reduced
      motion. `ScenarioVisual` already honoured both.
- [x] **A5** `CardModal` is now a real dialog: `role="dialog"` + `aria-modal` + `aria-labelledby`, Escape to
      close, focus trap, focus-in on open + restore on close, and entrance animation disabled under reduced
      motion.
- [x] **A6** `aria-hidden="true"` on the decorative Lorenz `<canvas>`.
- [x] **A7** Darkened the failing `#999`/`#bbb` muted **text** (close glyph, planned/future status badges,
      papers heading, research hint, paper-status text) to a passing grey. Left: `#666` text (already
      passes AA), dashed `#999` **borders** (non-text hedge motif), and the `#888` "IN DESIGN" SVG stamp
      (decorative). All remaining greys are hex pending the token migration (task-0002 M8).
- [x] **A8** Added canonical + Open Graph + Twitter meta, a skip-to-content link, and wrapped the nav in
      `<header>` with `<main id="main-content" tabindex="-1">`. **Follow-up:** a raster `og:image`
      (1200x630) social card — no asset exists yet; pairs with task-0006 visual assets.
- [x] **B5** Associated visually-hidden `<label>`s with the contact-form fields (placeholder is not a label).

## Phase 6 — Maintainability refactors

- [ ] **M1** Collapse `ProductsExploration`/`ProductsCoordination` into one data-driven `<ProductSection>` + one CSS module (~150 lines + a whole module removed).
- [ ] **M2/M3** Centralize social + nav + footer link data into one typed content module; delete the
      divergent inline arrays. (After Phase 1 confirms canonical URLs.)
- [ ] **M8** Replace the 23× `#003b7e` literals and the ad-hoc grey ramp with tokens; add semantic tokens
      (`--text-muted`, `--border`, `--success`, `--error`). _Overlaps task-0002._
- [ ] **M4** Extract a shared `<Section>`/`<SectionHeader>` primitive and a `.container` utility (replaces
      23 redeclarations). _Overlaps task-0002._
- [ ] **M9** Consolidate the ~20 one-off breakpoints into 3–4 named ones. _Overlaps task-0002._
- [ ] **M5** Converge on one content-injection convention (orchestrator prop-drilling, as `Lab.tsx` does).
- [x] **M6 — "zero hardcoded strings" sweep (i18n-readiness hygiene) — DONE.** Moved ALL user-facing copy
      into `src/content/`: new `content/site.ts` for chrome (nav, footer, contact, 404, skip-link, per-page
      screen-reader titles), plus new typed UI fields in `about.ts`, `home.ts`, `lab.ts`, `explainer.ts`,
      `research.ts`, `products.ts`, and `roadmap/overview.ts`. Components render content; no user-facing string
      literal lives in code. Strings moved verbatim (rendered output unchanged). This is the cheap prerequisite
      that makes an eventual i18n pass a locale layer over an already-clean content tree rather than a
      codebase-wide string hunt. See [ADR-0006](../../adr/0006-i18n-readiness.md) (Proposed) and
      [`../deferred/task-0007-i18n.md`](../deferred/task-0007-i18n.md). The i18n _runtime_ (locale routing,
      catalogs, switcher) is explicitly NOT built now — only the externalization discipline.
      **Follow-up (enforcement):** an ESLint `react/jsx-no-literals`-style rule would mechanically prevent new
      hardcoded strings from creeping back. Not enabled yet (needs tuning to avoid false positives on
      punctuation/whitespace); worth adding when the design-system lint config lands (task-0002 / ADR-0003).
      Note: this supersedes the link-data half of **M2/M3** for nav/footer/socials, which now live in
      `content/site.ts`; the remaining M2/M3 work is only deleting the dead `social.ts`/`SocialBar` (final
      dead-code commit).
- [ ] **M7** Convert `404.astro` inline styles to a CSS module.
- [ ] **M10** Split `content/lab.ts` (508 lines) per scenario, mirroring the roadmap content split.
- [ ] **M11** Type `pub: any` in `PhaseBody.tsx` using the existing `Publication` type.

## Phase 7 — Privacy / governance (from audit-0001)

- [ ] **F1** Add a privacy notice to the contact form. Detail:
      [`audit-0001-privacy-notice.md`](../deferred/audit-0001-privacy-notice.md).
- [ ] **F6** Fix the `env.example` vs `.env.example` naming/README mismatch.
- [ ] **F7** (optional) Add `@astrojs/sitemap`.

---

## Notes

- Items marked _Needs/Proposed ADR_ must be drafted as `Proposed` and signed off before implementation,
  per `CONTRIBUTING.md` Decision Log.
- Phases 4–6 overlap the visual-language work; coordinate with
  [`task-0002-visual-language-alignment.md`](task-0002-visual-language-alignment.md) so tokens/primitives
  are defined once.
- Suggested execution order: Phase 1 (unblocks) → Phase 2 (guardrails) → Phase 3 (bugs) → Phase 4 (payload)
  → Phase 5 (a11y) → Phase 6 (refactors) → Phase 7.
