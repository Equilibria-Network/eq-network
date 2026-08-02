# Collective Intelligence Playground

A static, browser-run laboratory for exploring how economic, cultural and political institutions
change when humans and AI systems share the same networks. It is developed as a workspace package
and mounted at `/playground` inside the Equilibria website's canonical layout.

The app leads with the coupled model and lets you drill into each of its three legs:

1. **A coupled society** — one population on three conserved ledgers, where cross-system influence
   is bought rather than assumed (`cilib.environments.ledger_society`)
2. **Economy** — the money leg, on its own (`capital_economy`, WP1)
3. **Politics** — the attention leg, on its own (`influence_exchange`, WP2)
4. **Polity** — the votes leg, on its own (`delegative_polity`, WP3)

That order is the structure, not a preference: `environments/attachment.py` names the shared kernel
as "attention in `influence_exchange`, ballots in `delegative_polity`, both in `ledger_society`",
and the coupled config anchors its parameters to all three papers by name. Scenarios that were not
legs of the coupled model — the governed commons and cultural contagion — were removed on
2026-08-02 rather than left as unrelated tabs.

Every scenario provides a guided story, reproducible presets and seeds, optional model settings,
animated graph views, time-series readouts, and a derived pipeline view. The models are
qualitative browser ports of the Collective Intelligence Library examples; they are teaching and
exploration instruments, not forecasts.

Each port states its own parity evidence in a header comment beside the model. Ports match the
engine on ensemble means, never run for run: the engine runs float32 under JAX's RNG and these run
float64 under the kernel's, so a browser trajectory is the same model on a different draw.

## Develop

From the repository root:

```bash
pnpm install
pnpm --filter @eq-network/site dev --host 0.0.0.0 --port 4321
```

Open `http://localhost:4321/playground/` locally or the printed network URL from another machine.
This canonical site server includes the real navbar, page header, footer, and Astro integration. Use
`pnpm dev:playground` only for package-isolated work; it is not a separate production website.

```bash
pnpm --filter @eq-network/playground test
pnpm --filter @eq-network/playground build
pnpm --filter @eq-network/site build
pnpm --filter @eq-network/playground smoke:browser
```

The Vite build is a development harness. Production is the statically generated, indexable site route at
`apps/site/dist/playground/`; `/lab/playground` is a static compatibility redirect. No backend, API key,
analytics, cookie, or personal-data store is used.

## Structure

```text
apps/playground/
├── docs/               App-scoped decisions, tasks, context, operations, and privacy
├── public/             Working paper and local brand reference assets
├── src/
│   ├── components/     SVG showcase, live chart, and pipeline views
│   ├── engine/         Pure kernel, typed contracts, worker, and latest-wins client
│   ├── metrics/        Playhead-derived live metric projections
│   ├── rendering/      Scenario-specific SVG geometry and drawing primitives
│   ├── scenarios/      Typed stories, parameters, presets, metrics, and views
│   ├── App.tsx         Scenario reader and experiment workbench
│   ├── embed.ts        Stable production export consumed by Astro
│   ├── main.tsx        Standalone development harness
│   └── styles.css      Equilibria-scoped workbench visual system
├── test/               Scientific tests, validation, benchmarks, and browser smoke
├── index.html          Accessible document shell and application mount point
└── package.json        Independent app commands and dependencies
```

The numerical kernel is a characterized port of the paper examples. React never runs it directly: all
trajectories are produced in a cancellable module worker and transferred as typed arrays. The scenario
registry drives navigation, narrative, parameters, presets, metrics, and view selection. The restored
co-author showcase geometry is rendered as SVG, while live metric cards and time-series charts read the
same trajectory and playhead.

Architecture, scaling thresholds, decisions, and task status are indexed in
[`docs/README.md`](docs/README.md).
