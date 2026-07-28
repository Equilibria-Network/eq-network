# ADR-0001: Astro static site published to GitHub Pages

- Status: Accepted (2026-07-28; back-filled from repository history, ratified by the owner)
- Date: 2025 (approximate; reconstructed from git history)

## Context

The site began as a wireframe-driven scaffold and an early Docusaurus build. The project needed a public
marketing and research website: content-heavy, with a few interactive pieces, no backend, no user data,
and low operational burden. The README records the move "from Docusaurus to Astro for better performance
and simpler architecture."

## Decision

Build the site with Astro configured for static output (`output: 'static'`), using React only as islands
for interactive components. Publish the built `dist/` to GitHub Pages via a GitHub Actions workflow on
every push to `main`. Serve it on the custom domain `eq-network.org` via `public/CNAME`.

## Consequences

- **Enables:** zero server to operate; cheap and reliable hosting; fast page loads; a small attack surface
  (no server-side code, no database).
- **Enables:** content stays in typed files under `src/content/`, editable without touching layout.
- **Constrains:** no server-side rendering, no per-request logic, no response headers (GitHub Pages cannot
  set them, which rules out a server-set Content-Security-Policy). The one contact form is handled without a
  backend via a third-party handler (Formspree) — see [`../privacy/data-map.md`](../privacy/data-map.md).
- **Constrains:** dynamic behaviour must run client-side or be delegated to a third-party service.

## Amendment (2026-07-28): client-side simulation direction

The `/lab/playground` is expected to grow into a substantial **client-side agent-based model** — a live
simulation the visitor runs in-browser with tweakable parameters (agent count, iteration settings, etc.),
serving the majority of world-modelers / forecasters / multi-agent researchers. The full high-powered
engine remains a separate download; the web version is the accessible tier.

This is **compatible with static output**: the simulation runs in the browser (JS, or WASM for speed);
no backend is required, and GitHub Pages simply serves the bundle. It is, if anything, a point in favour
of the static + client-side-compute architecture.

Two constraints this introduces, recorded so they are not discovered late:

- **Response headers.** Multi-threaded WebAssembly needs `SharedArrayBuffer`, which the browser only
  enables when the server sends `Cross-Origin-Opener-Policy` / `Cross-Origin-Embedder-Policy` headers.
  **GitHub Pages cannot set response headers.** Single-threaded WASM and Web Workers are unaffected.
- **Bundle weight.** The simulation code must be code-split so it does not bloat the marketing pages.

## Standing guidance — this ADR is a default, not a cage

Build features as the product needs them. This ADR records where hosting sits _today_; it is not a
mandate to contort the product to fit GitHub Pages. When a requested capability is compromised by the
static / GitHub-Pages constraints (response headers, `SharedArrayBuffer`, server compute, persistence),
the correct response is to **surface that plainly and propose the hosting migration** (Cloudflare Pages,
Hetzner, Netlify, or similar) as a Proposed ADR — not to invent a hacky, clearly sub-optimal workaround to
avoid moving. Agents and contributors have explicit licence to challenge this ADR and recommend the move
when the evidence calls for it. Reversible hosting is the whole point of keeping the output static and
portable.

## Revisit when

- The playground needs multi-threaded WASM / `SharedArrayBuffer`, or any other custom response header
  (CSP included). At that point move hosting to a static host that can set headers (Cloudflare Pages,
  Netlify) — a portable swap of the same static output, not an architecture change.
- The simulation, or any feature, needs server-side compute, persistence of user runs, sharing via a
  backend, auth, or server-streamed datasets. Any of these breaks static-only and warrants a new ADR.
- The playground's growth is itself a "big dev" architecture decision (graduating from the current raw
  `prototypes/playground.html?raw` import to a proper Astro island / sub-app with a build step, state, and
  a worker). Write a dedicated ADR when that work starts.

## Sources

- Repository `README.md` ("Migrated from Docusaurus to Astro").
- `astro.config.mjs` (`output: 'static'`, `site: 'https://eq-network.org'`).
- `.github/workflows/deploy.yml` (build and `upload-pages-artifact` / `deploy-pages`).
- `public/CNAME`.
