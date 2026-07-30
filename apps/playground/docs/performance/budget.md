# Playground performance budget

- Adopted: 2026-07-30
- Measurement route: `/lab/playground/#combined`
- Profile: local static production build, desktop Lighthouse plus browser interaction checks

## Budgets

| Concern                                           |                             Budget | Reason                                                   |
| ------------------------------------------------- | ---------------------------------: | -------------------------------------------------------- |
| Total blocking time                               |                           ≤ 200 ms | Simulation work must not block site navigation or input  |
| Largest contentful paint                          |                      ≤ 1.5 s local | The story should appear before model work completes      |
| Worker compute, default scenario                  | p95 ≤ 250 ms on the development VM | Settings should feel directly manipulated                |
| Parameter-to-ready latency                        |                       p95 ≤ 400 ms | Includes debounce, worker startup, compute, and transfer |
| Active SVG update                                 |                      p95 ≤ 16.7 ms | Preserve 60 Hz input/scroll headroom                     |
| Playground entry JS, gzip, excluding shared React |                            ≤ 50 kB | Keep scenario UI cheaper than the site runtime           |
| Worker JS, raw                                    |                            ≤ 75 kB | Leave room for more engines before a split is required   |
| Layout shift                                      |                             ≤ 0.01 | Worker completion must not move the document             |

## Baseline

The inherited main-thread page measured 623 ms total blocking time in the local desktop audit. Its
combined-kernel command benchmark had a 178.7 ms median including Node startup. The candidate must be
measured from a production site build; command timing and Lighthouse are different evidence classes and
must not be presented as interchangeable.

## Guardrails

- Debounce continuous controls and cancel superseded runs.
- Never run the scientific validation ladder in the production page.
- Transfer typed-array buffers instead of cloning them.
- Keep outcome text in the DOM and bound the SVG mark count to the visible explanatory view.
- Add trajectory decimation before adding a heavier chart framework or moving dense marks to Canvas.
- Report the measurement environment and run id with every before/after claim.

## Evidence policy

Apply these budgets only to a static production preview with the route, browser profile, and cache state
recorded. Development-server Lighthouse runs are diagnostic evidence, not release verdicts. One run may
locate a regression, but repeated compatible runs are required before changing a timing budget or claiming
a stable improvement.
