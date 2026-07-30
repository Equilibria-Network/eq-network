# Development runbook

## Start

From the repository root:

```bash
pnpm install
pnpm --filter @eq-network/site dev --host 0.0.0.0 --port 4321
```

Use the network URL printed by Astro. This is the canonical development surface because it exercises the
real route and shared site chrome. Keep one `432x` listener: stop an old dev or preview process before
starting another. The package-only `pnpm dev:playground` harness is useful for isolated Vite work but does
not prove Astro integration.

## Verify

```bash
pnpm --filter @eq-network/playground test
pnpm --filter @eq-network/playground build
pnpm --filter @eq-network/site build
```

With the canonical server running on 4321, the dependency-free Chrome smoke check exercises mounting,
scenario switching, story-driven presets/views/playback, parameter recomputation, live metrics, restored
SVG geometry, the derived pipeline view, the settings-only rail, one-viewport desktop geometry,
sticky-title paint order, mobile overflow, and reduced motion:

```bash
pnpm --filter @eq-network/playground smoke:browser
```

To smoke a static production preview, stop the development server first, then reuse 4321:

```bash
pnpm --filter @eq-network/site build
pnpm --filter @eq-network/site preview --host 0.0.0.0 --port 4321
pnpm --filter @eq-network/playground smoke:browser
```

During visual review, check at least:

- 390 px and 1440 px viewport widths;
- keyboard access to scenarios, settings, presets, mechanisms, sliders, seed, playback, and views;
- reduced-motion mode;
- a deep link such as `#combined`;
- changing a preset, slider, seed, and timeline position;
- live metric and chart changes while scrubbing;
- the full-width title remaining opaque and topmost after the introductory header scrolls away;
- story scenes changing presets, views, ticks, and playback as authored;
- the selected scenario expanding into numbered story sections in the left rail;
- Settings hidden initially, evidence and assumptions at its bottom, and Close returning width to the stage;
- the sticky title, simulation, and both measure charts fitting within one 1000 px desktop viewport;
- the site navbar and footer around the app.

## Full repository gate

```bash
pnpm check
lychee --offline --no-progress $(rg --files -g '*.md')
```

The browser smoke remains separate because `pnpm check` does not own a long-running server.

## Output

The app build writes its development harness to `apps/playground/dist/`; the site build writes the
production route to `apps/site/dist/`. Do not edit or commit either directory.
