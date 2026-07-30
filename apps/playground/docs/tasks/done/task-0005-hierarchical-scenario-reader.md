# Merge the scenario and story navigation

- Provenance: owner revision
- Links back to: [`../../adr/0001-integrated-react-worker-workbench.md`](../../adr/0001-integrated-react-worker-workbench.md)
- Status: done
- Owner: unassigned
- Priority: now

## Problem

Separate chapter and story surfaces duplicated navigation, while a default-open right rail reduced the
figure. The sticky title and full-size charts also prevented the simulation and measures from fitting in
one viewport. Repeated borders made the two selector rows feel like an undifferentiated button wall.

## Outcome

- The left rail is an exclusive scenario hierarchy: `1 Commons` expands into `1.1` through `1.6`, and
  every subsection drives its authored preset, view, tick, playback target, and speed.
- The right rail is settings-only and hidden by default. Evidence ladders and itemized assumptions are at
  the bottom of every scenario’s configuration.
- The sticky title is 52 px; the live simulation and two compact measure charts fit in a 1000 px desktop
  viewport after the introductory header.
- View and condition selectors divide their available width evenly. Decorative borders are removed and
  the local transport icons render in one brand-aligned monochrome treatment.
- The reader preserves the brand prototype's flat fills and localized hatch while removing shadows,
  decorative rounding, and elevation-on-hover. No layout, palette, or scientific encoding changed in
  this surface-treatment correction.
- The desktop story rail starts at its 480 px maximum, uses larger 14–16 px navigation type, graphite
  prose, and a very light gray ground. Its scrollbar is visually hidden while the content remains
  scrollable. Mobile narrative copy is at least 14 px.
- The rail is titled “Scenario Guide”. Its selected scenario and active numbered subsection stay on the
  light rail ground and use bold navy type with a plain blue underline; views and presets use navy ground
  and white text. All hatched control underlines were removed.
- The shared `/playground/` navigation link has no scenario-specific URL. An absent or removed hash
  resolves to Commons, including when the top-bar link is used from another active scenario.
- The scenario and Settings rails use one reusable resizable separator. It supports pointer dragging,
  keyboard sizing, bounded widths, and reset without entering scenario or simulation state.
- The reader has only three structural divider rules: beneath the sticky title, between the scenario rail
  and graph, and—when open—between the graph and Settings. The full vertical rule is the drag target; no
  central grip is required.

## Verification

Completed on 2026-07-30:

- scientific goldens, validation, scenario contracts, package build, and full static-site build pass;
- the browser journey verifies five scenario toggles, story-driven playback, hidden-by-default Settings,
  evidence and assumptions, rail closure, stage-width recovery, 52 px title geometry, chart fit, and
  shadow-free square reader/settings surfaces;
- the same journey enforces the maximum initial rail width, narrative type floor, gray rail ground,
  hidden scrollbar, hatch-free underlined scenario and subsection states, navy/white control-tab states,
  pointer and keyboard rail resizing, and 14 px mobile story copy;
- an actual top-bar navigation resets an active non-default scenario to Commons;
- desktop and 390 px journeys have no horizontal overflow, and reduced-motion behavior remains intact.
