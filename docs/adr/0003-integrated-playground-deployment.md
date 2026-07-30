# ADR-0003: mount the playground package inside the site deployment

- Status: Proposed — implemented, awaiting owner ratification
- Date: 2026-07-30
- Supersedes: the runtime/deployment portion of
  [`0001-monorepo-topology.md`](0001-monorepo-topology.md); its workspace-topology decision remains accepted

## Context

ADR-0001 correctly separated the site and future simulation into workspaces, but anticipated that the
playground would be hosted independently and embedded by iframe or link. That assumption was driven by a
possible future requirement for multi-threaded WebAssembly and `SharedArrayBuffer` response headers.

The implemented browser model does not require those headers. The owner also requires the playground to
be a first-class part of the existing website, with the same navbar and footer and no page-within-a-page
frame. At the same time, the numerical runtime and development surface need an independent package
boundary so scenarios can grow without becoming site-page code.

## Decision

Keep `apps/playground` as an independent workspace package and development harness. Export one stable React
entry from `@eq-network/playground/embed`. The Astro site imports that entry at build time and mounts it at
`/lab/playground` inside the canonical `Layout`, `PageHeader`, navbar, and footer.

Production is one static GitHub Pages artifact under `apps/site/dist`. The standalone Vite build is a
package-development harness, not a second public website. A module worker provides numerical isolation
without changing the deployment model. The route remains `noindex` while the explanatory and scientific
contracts are still under active review.

## Alternatives considered

### Continue injecting the inherited HTML document

Rejected. It cannot reuse site chrome safely, provides no typed package boundary, and makes a single
document own UI, simulation, rendering, and state.

### Deploy to a separate origin and iframe it

Deferred until a measured requirement demands response headers or independent deployment. It would add
focus, sizing, accessibility, release-versioning, and navigation boundaries without a current runtime
benefit.

### Move all playground source into `apps/site`

Rejected. It would erase the workspace ownership boundary and couple numerical/runtime changes to the
site's page component tree.

## Consequences

- The visitor experiences one website and one navigation system.
- The site and playground deploy atomically, while package-only development stays isolated.
- The playground may use React and workers without making Astro own the numerical model.
- A future `SharedArrayBuffer`, remote engine, or independently versioned release may require a new
  deployment ADR and a different integration adapter.
- The inherited `apps/site/prototypes/playground.html` is now reference material, not a production source.
  Its deletion is intentionally separate because it remains useful for visual and scientific comparison.

## Compliance

- `apps/site/src/pages/lab/playground.astro` imports only the package export and shared site chrome.
- `pnpm --filter @eq-network/playground check` verifies the package.
- `pnpm --filter @eq-network/site build` verifies static integration.
- `pnpm --filter @eq-network/playground smoke:browser` verifies the shared navbar/footer, route, worker,
  scenario controls, live output, and desktop/mobile behavior against a running site.

## Revisit when

The worker requires cross-origin isolation, the playground needs an independent release cadence or origin,
or production measurements show that atomic site deployment is the wrong performance boundary.
