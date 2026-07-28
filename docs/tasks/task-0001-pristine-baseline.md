# Pristine baseline — clear cleanup/housekeeping before feature work

- Provenance: task-0001 (umbrella)
- Sources: [`../audits/2026-07-28-audit-0001-inherited-recon.md`](../audits/2026-07-28-audit-0001-inherited-recon.md),
  [`../audits/2026-07-28-audit-0002-code-hygiene-deep-dive.md`](../audits/2026-07-28-audit-0002-code-hygiene-deep-dive.md)
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
- [ ] **Dead-code intent — partially resolved:** `SocialBar.tsx` + `content/social.ts` are unused and their
      values are stale; the correct fix is one authoritative `social.ts` (canonical values above) consumed by
      the Footer, and delete the duplicate `SocialBar` — folded into task-0002 M2 (one source of truth for
      links). **Still needs owner:** is the roadmap detailed-publications view (`PhaseBody`, dormant/commented
      in `Roadmap.tsx`; `PhaseDetails.tsx` unused) coming back (re-enable + delete the old) or not (delete both)?
- [x] **License — resolved: MIT.** `LICENSE` added (`Copyright (c) 2024-2026 Equilibria Network`).
      (Note: MIT is a software licence; the research PDFs/prose under `public/` may warrant separate terms —
      revisit if any are third-party or meant to be all-rights-reserved.)
- [x] ADR-0001 accepted; ADR-0002 withdrawn (contact-form handler is feature work — see task-0003).

## Phase 2 — Tooling guardrails (cheap; stops debt re-accumulating)

- [ ] **ESLint** (`eslint` + `@typescript-eslint` + `eslint-plugin-astro`), minimal calibrated ruleset.
      Would have caught the dead code, unused `currentPath`, unused import, and the `any`. _Needs a
      Proposed ADR._
- [ ] **Prettier** config + **`.editorconfig`** — end the formatting drift.
- [ ] **CI lint/format-check step** in `deploy.yml` once the above exist.
- [x] **CI reproducibility (C1 + F2) — done:** root `package.json` pins `packageManager: pnpm@11.17.0`;
      CI uses `pnpm/action-setup@v4` (reads that pin) and `pnpm install --frozen-lockfile`; lockfile
      regenerated for the workspace. Landed with the workspace migration (task-0005).
- [ ] **C3** Remove the stale `@utils/*` tsconfig alias (and the README `utils/` mention) — no `src/utils/`.
- [ ] **C4** Move `@astrojs/check` from `dependencies` to `devDependencies`.
- [ ] **C5** Schedule an isolated dependency-upgrade pass (Astro 4→7, React 18→19, `@astrojs/react` 3→6,
      `lucide-react` 0→1) — **after** CI reproducibility (C1) lands. Its own careful effort; likely a
      Proposed ADR given the Astro/React major jumps.
- [ ] Do NOT add husky / lint-staged / commitlint — wrong altitude for this project (recorded in
      CONTRIBUTING §3).

## Phase 3 — Confirmed bugs

- [ ] **B1** Pass `currentPath={Astro.url.pathname}` to `<Navbar>` in `Layout.astro:33` — fixes the
      logo/background being wrong on all six non-home pages.
- [ ] **B2** Fix the Footer Newsletter URL (Phase 1 confirms the target).
- [ ] **B3** Fix `/favicon.ico` 404 (move icon to `public/favicon.ico` or fix the href).
- [ ] **B4** Fix `/favicon.svg` 404 on `/lab/playground`. Detail:
      [`audit-0004-playground-favicon.md`](audit-0004-playground-favicon.md).
- [ ] **B8** Fix `var(--color-bg …)` → `var(--bg-color)` in `Explainer.module.css` (typo hits fallback).
- [ ] **B6** Disable submit / show a notice when `PUBLIC_FORMSPREE_ENDPOINT` is unset (no silent dead post).
- [ ] **B7** Fix `AboutTeam` inverted click-outside so outside clicks dismiss the flipped card.
- [ ] **B9** Make the footer year build-time constant (or accept the hydration warning) — low.
- [ ] **B10** Escape the highlight term (or match without a regex) in `Hero.tsx`'s
      `renderTextWithHighlights` before `dangerouslySetInnerHTML` — low, trusted content today.
- [ ] **C2** Reduce over-hydration: render static sections as Astro/static; hydrate only genuinely
      interactive islands (perf; overlaps Phase 4).

## Phase 4 — Image payload (biggest visitor-facing win: ~42 MB → target < 5 MB)

_Likely a Proposed ADR: adopt `astro:assets` as the image pipeline._

- [ ] **P3** Migrate `<img>` to Astro `<Image>`/`<Picture>` (format, resize, `srcset`, dimensions,
      lazy-load in one move).
- [ ] **P1** Re-export the multi-MB auto-traced SVGs (`philogeny.svg` 6.7 MB, `dialogue.svg`,
      `system-level-safety-evals.svg`, roadmap philosopher SVGs) as optimized raster, or `svgo` + path
      simplification.
- [ ] **P2** Downscale oversized PNGs (`jonas.png` 3.4 MB @ 2018×1910, `pipeline-run.png`) to display size,
      convert to WebP.
- [ ] **P4** Delete the unused PNG/SVG twins (20+ pairs) — after confirming which is referenced.
- [ ] **P5** Normalize `david-hyland.jfif` to `.jpg`/`.png`.
- [ ] **P6** Compress or replace the 400 KB parallax `texture.jpg`.
- [ ] Dead-asset sweep of `public/` (e.g. `socials/luma.svg`, `substack.png`) — do this _after_ dead code
      is resolved.

## Phase 5 — Accessibility (public site; real users)

- [ ] **A1** Add an `<h1>` to home, research, explainer; fix heading order.
- [ ] **A2** Convert click-handling `<div>`s (team/advisor/partner/research cards) to real `<button>`s.
- [ ] **A3** Add a global `:focus-visible` style; stop stripping input outline without a replacement.
- [ ] **A4** Gate `LorenzAttractor` + roughjs animations on `prefers-reduced-motion` and viewport visibility.
- [ ] **A5** Make `CardModal` a real dialog (role/aria, focus trap, Escape, focus restore).
- [ ] **A6** `aria-hidden="true"` on the decorative Lorenz `<canvas>`.
- [ ] **A7** Darken muted grey text to meet WCAG AA (`#999`/`#bbb` currently fail).
- [ ] **A8** Add Open Graph / Twitter / canonical meta and a skip-to-content link; wrap nav in `<header>`.
- [ ] **B5** Add associated `<label>`s to the contact-form fields.

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
- [ ] **M6** Move hard-coded section headings / footer tagline / `404.astro` copy into content files.
- [ ] **M7** Convert `404.astro` inline styles to a CSS module.
- [ ] **M10** Split `content/lab.ts` (508 lines) per scenario, mirroring the roadmap content split.
- [ ] **M11** Type `pub: any` in `PhaseBody.tsx` using the existing `Publication` type.

## Phase 7 — Privacy / governance (from audit-0001)

- [ ] **F1** Add a privacy notice to the contact form. Detail:
      [`audit-0001-privacy-notice.md`](audit-0001-privacy-notice.md).
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
