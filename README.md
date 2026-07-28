# Equilibria Network

Monorepo for the Equilibria Network website and its interactive tools.

## Layout

```
apps/
  site/         The public website (Astro static) -> eq-network.org (GitHub Pages)
  playground/   Interactive agent-based-model playground (in progress)
packages/
  design-system/  Shared design tokens and components used across apps
docs/           Project documentation (see docs/README.md)
```

Each app builds and deploys independently; shared code lives in `packages/`. The topology and its
rationale are recorded in [`docs/adr/0005-repo-topology.md`](docs/adr/0005-repo-topology.md).

## Develop

```bash
pnpm install          # from the repo root; installs all workspaces
pnpm dev              # run the site dev server
pnpm build            # build the site (astro check + astro build)
```

Per-workspace commands use pnpm filters, e.g. `pnpm --filter @eq-network/site build`.

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) and, for agents, [`AGENTS.md`](AGENTS.md). Project docs,
audits, and decision records live in [`docs/`](docs/README.md).
