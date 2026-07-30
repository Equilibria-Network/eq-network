# Implementation and performance audit — 2026-07-30

## Scope

Rebuild the inherited single-document prototype as a scalable, scenario-first browser application mounted
inside the existing Equilibria site at `/lab/playground`.

## Verification

- `pnpm test` — passed; full numerical validation ladder, determinism, sealed-coupling null, and all five
  scenario contracts.
- `pnpm build` — passed; playground typecheck/Vite build and the full Astro static site build.
- Targeted ESLint over playground source/tests and the Astro route — passed.
- Production browser journey — passed at desktop and 390 px: five scenarios, real navbar/footer, worker
  recomputation, live metrics, exact showcase view box, settings/story replacement, sticky-title paint
  order, pipeline view, A/B comparison, no horizontal overflow, and reduced motion.

## Performance evidence

Evidence class: local Lighthouse lab run on the development VM, static production preview, desktop profile.

| Metric                 | Inherited prototype | Integrated candidate |
| ---------------------- | ------------------: | -------------------: |
| Lighthouse performance |                  75 |                  100 |
| Total blocking time    |              623 ms |                 0 ms |
| LCP                    |              654 ms |               749 ms |
| CLS                    |              0.0002 |               0.0042 |
| Accessibility          |                  91 |                   97 |
| Best practices         |                  96 |                  100 |
| Agentic browsing       |                  67 |                  100 |

- Baseline run: `20260730T112546Z-web-desktop-37f41ec9`
- Final candidate run: `20260730T124839Z-web-desktop-8e32b354`
- Candidate budget verdict: **pass** for all five adopted checks in
  [`../performance/web-budget-policy.json`](../performance/web-budget-policy.json).
- The evidence tool correctly refused a formal comparison because the baseline was the standalone root URL
  and the candidate is the integrated `/lab/playground/` route. The table is therefore a directional
  before/after observation from the same VM and profile, not a statistically controlled regression claim.

The remaining Lighthouse accessibility finding is the existing site footer copyright-year contrast, not a
playground node. The SEO score is intentionally reduced by `noindex` while the route remains a lab preview.

### Follow-up after showcase and reading-layout restoration

A later single Lighthouse run measured the canonical **development server**, after the co-author showcase,
live charts, sticky title, and three-column reader were restored. It is diagnostic lab evidence, not
compatible with the production-preview baseline above and not a release verdict.

| Metric                 | Development-server observation |
| ---------------------- | -----------------------------: |
| Lighthouse performance |                             88 |
| Accessibility          |                             97 |
| Best practices         |                            100 |
| Agentic browsing       |                            100 |
| FCP                    |                       929.8 ms |
| LCP                    |                     1,499.0 ms |
| Total blocking time    |                       195.5 ms |
| CLS                    |                         0.0042 |

- Run: `20260730T135254Z-web-desktop-96a665d0`
- Engine: Lighthouse 13.4.1; one local desktop lab sample at
  `http://127.0.0.1:4321/lab/playground/`.
- Upstream verdict: `not_evaluated`; the run did not apply the repository budget policy.
- The earlier invalid-SVG console error was gone and Best Practices recovered from 96 to 100.
- Timing comparisons remain qualified because both later runs used development mode and a single sample.

## Delivery size

Latest standalone Vite harness assets:

- entry including React: 246,522 bytes raw / 77,544 bytes gzip;
- worker with all five engines: 36,663 bytes raw / 8,657 bytes gzip;
- scoped playground CSS: 24,274 bytes raw / 5,045 bytes gzip.

The standalone entry includes React and is therefore not comparable with the adopted “playground entry,
excluding shared React” budget. Production Astro output shares framework chunks with other islands; use
the production build and a bundle breakdown for the next app-entry budget decision.

## Findings and follow-ups

- The worker boundary eliminated the baseline main-thread blocking without introducing a remote service.
- Scenario changes must render only a trajectory tagged for that scenario; the browser suite now covers
  this race.
- The settings icon asset collection mentioned by the owner was not present in this checkout. A code-native
  tuning glyph is used temporarily at the single `settings-trigger` boundary.
- Golden trajectory checks now pin every default scenario's headline metrics and representative
  start/middle/end series values, so layout and drawing work cannot silently change scientific behavior.
- Scientific per-scenario extraction remains separate from this architecture migration so equation movement
  can be reviewed under the unchanged validation ladder.
- `SimulationCanvas.tsx` and `TrajectoryChart.tsx` are inactive remnants of the first renderer pass. Their
  removal is tracked separately so this commit does not combine deletion with the SVG restoration.
