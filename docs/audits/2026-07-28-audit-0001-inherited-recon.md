# Audit 0001: inherited-codebase reconnaissance

- Date: 2026-07-28
- Scope: the whole repository at first checkout (`Equilibria-Network/eq-network`, `main` at `27615e9`)
- Method: reconnaissance-first review across the standard audit dimensions. Calibrated to the project's
  actual shape — a public, static, content-first website with no backend and no user data beyond a
  contact form. The aim is understanding and a prioritised, honest findings list, not a rewrite.

## 1. What this is

A static marketing and research website for the Equilibria Network, served at `eq-network.org`. Built
with Astro 4 (`output: 'static'`), React 18 islands for interactive pieces, CSS Modules, and pnpm.
Published to GitHub Pages by a GitHub Actions workflow on push to `main`. No backend, no database, no
server-side runtime, no authentication. See [`../context/00-orientation.md`](../context/00-orientation.md).

142 commits since 2024-11-20. The build began as a wireframe scaffold (early commits from an
`gpt-engineer-app` bot, originally a Vite/React/shadcn stack) and was migrated to Astro. Content lives in
typed files under `src/content/`; components render it.

## 2. Risk map

The risk surface is small and mostly cosmetic, which is the correct outcome for a static site.

| Question                | Answer for this codebase                                                                                              |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Critical paths          | A page rendering; the site building and deploying from `main`.                                                        |
| Single point of failure | The GitHub Actions deploy workflow and the GitHub Pages hosting.                                                      |
| Hidden state            | Only the `PUBLIC_FORMSPREE_ENDPOINT` build-time variable and the external Formspree service.                          |
| Time-sensitive code     | None found.                                                                                                           |
| External contracts      | The public URLs of pages (inbound links, SEO); the Formspree endpoint.                                                |
| Personal data           | Contact-form name/email/message, processed by Formspree (US). See [`../privacy/data-map.md`](../privacy/data-map.md). |
| Operational risk        | Low. A failed build does not publish; the previous site stays live. No data to lose.                                  |

## 3. Findings

Ranked by risk times cost-to-fix. Severity is calibrated to a static, no-user-data site: nothing here is
urgent, and several items are deliberately logged as "accepted" rather than "to fix".

### F1 — Contact form has no privacy notice (privacy) — medium

The contact form sends a name, email, and message to Formspree (US-headquartered, Cloud Act) with no
statement to the visitor about what happens to their data. For an organisation whose contact address sits
in the EU, a one-line notice next to the form (or a short privacy page linked from it) is the cheap,
correct fix. The processor choice itself is an accepted trade-off, recorded in
[ADR-0002](../adr/0002-formspree-contact-form.md); the missing _notice_ is the gap.
Tracked: [`../tasks/audit-0001-privacy-notice.md`](../tasks/audit-0001-privacy-notice.md).

### F2 — CI installs without a frozen lockfile (build reproducibility) — low

`.github/workflows/deploy.yml` runs `pnpm install`, not `pnpm install --frozen-lockfile`. In CI this
means a drifted or out-of-date `pnpm-lock.yaml` can be silently rewritten and a different dependency tree
shipped than the one committed. The fix is one flag and makes every production build reproducible from the
lockfile. Tracked: [`../tasks/audit-0002-frozen-lockfile.md`](../tasks/audit-0002-frozen-lockfile.md).

### F3 — `target="_blank"` links without `rel="noopener"` (security) — RETRACTED (false positive)

**Retracted 2026-07-28.** This finding was a scanning artifact: a per-line grep flagged the `target="_blank"`
line without seeing the `rel="noopener noreferrer"` on the following line. Direct re-inspection of every
`target="_blank"` in `src/` confirms **all of them carry `rel="noopener noreferrer"`** (CardModal,
PhaseDetails, PhaseBody, Publications, Footer, SocialBar, ScenarioSection). There is nothing to fix. The
corresponding task has been removed. Cross-checked by an independent review pass.

### F4 — `/lab/playground` references a missing `/favicon.svg` (correctness) — low

`src/pages/lab/playground.astro` links `rel="icon" href="/favicon.svg"`, but the repository ships
`favicon.ico` and `logo_icon.svg`, not `favicon.svg` at the web root. That page requests a 404 favicon.
Cosmetic; fix by pointing at an asset that exists or adding the file.
Tracked: [`../tasks/audit-0004-playground-favicon.md`](../tasks/audit-0004-playground-favicon.md).

### F5 — No LICENSE file (governance) — low

A public repository with no license is, by default, all-rights-reserved: others may not reuse the content
or code. If that is intended, state it; if not, add a license. This is a decision for the owners, not a
defect. Tracked: [`../tasks/audit-0005-license.md`](../tasks/audit-0005-license.md).

### F6 — `env.example` naming and README drift (docs) — low

The template file is `env.example` (no leading dot), while `README.md` tells the reader to copy
`.env.example`. Astro reads `.env`, and both a dotted and undotted example are common, but the doc and the
file should agree. Either rename the file to `.env.example` or fix the README line. Low priority.

### F7 — No sitemap or robots.txt (SEO / ops) — low / optional

For a public site whose audience is reached partly through search, a sitemap helps. Astro has an official
`@astrojs/sitemap` integration and `site` is already set in the config, so this is a small addition. Not
required; logged for the owners to decide.

## 4. Consciously accepted (not findings)

These look like omissions but are the right call at this scale. They are recorded so their absence is
traceable, not mistaken for oversight. See [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md) Section 3.

- **No test suite.** A static content site. `astro check` (type-check, run inside `pnpm build`) is the
  automated floor; content and visuals are verified by human preview. Revisit if the interactive lab
  components grow logic whose breakage would be silent.
- **No Content-Security-Policy / security headers.** GitHub Pages cannot set response headers, and the
  site loads no third-party scripts, which removes most of what a CSP defends against.
- **No analytics.** A privacy-positive default, consistent with the house preference.
- **No backend / SSR.** Correct for the content this site serves.

## 5. Positives

Worth stating plainly, because they are the reason the risk surface is small:

- **No secrets in the working tree or in git history** (scanned both). The only runtime secret is injected
  from a repository secret at build time.
- **Dependencies are few and lockfile-pinned** (a short direct-dep list; no abandoned or exotic packages).
  Note: they are pinned but now **materially behind** current majors (Astro 4 vs 7, React 18 vs 19,
  `@astrojs/react` 3 vs 6, `lucide-react` 0.x vs 1.x) — not a vulnerability, but a scheduled upgrade pass is
  warranted after the build is made reproducible. See audit-0002 for the CI reproducibility issue.
- **Content is cleanly separated from presentation** (`src/content/` as typed data).
- **A build-time type-check gates the deploy** (`astro check` inside `pnpm build`).
- **The playground has a single source of truth** (`prototypes/playground.html` imported raw), avoiding a
  copy-paste divergence.
- **Per-repo git identity is set** so commits are attributed to the project account, not a global identity.

## 6. What to do next (prioritised)

Ordered by risk times cost. None is urgent.

1. **F1** privacy notice on the contact form — highest value, low cost.
2. **F2** `--frozen-lockfile` in CI — one line, buys reproducible builds.
3. **F4 / F6** the trivial correctness and hygiene fixes — batch them. (F3 retracted — false positive.)
4. **F5 / F7** license and sitemap — owner decisions; do when convenient.

Open work is tracked under [`../tasks/`](../tasks/). This audit is the record of what was found on
2026-07-28; the tasks are where the work is followed.

## Appendix: dimensions reviewed

Scope and purpose; architecture; design principles; the (absent) API layer; the (absent) data layer;
concurrency (none); performance (static output, no hot paths); security; privacy; observability (none
beyond CI logs); error handling (contact-form validation via Formspree); testing; configuration;
dependencies; hosting and data residency; version-control hygiene; documentation; code-review culture.
Dimensions marked absent are absent by design for a static site, not by oversight.
