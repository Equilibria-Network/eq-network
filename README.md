# Equilibria Network

Monorepo for the Equilibria Network website and its interactive tools.

## Layout

```
apps/
  site/         The public website (Astro static) -> eq-network.org (GitHub Pages)
  playground/   Browser simulation package mounted by the site at /lab/playground
packages/
  design-system/  Shared design tokens and components used across apps
docs/           Project documentation (see docs/README.md)
```

Each app has an independent development build. The production site consumes the playground through its
workspace export and deploys both as one static GitHub Pages artifact. The topology is recorded in
[`docs/adr/0001-monorepo-topology.md`](docs/adr/0001-monorepo-topology.md); the implemented integration
boundary is documented in
[`docs/adr/0003-integrated-playground-deployment.md`](docs/adr/0003-integrated-playground-deployment.md).

## Status

Maintained. The site is the organisation's public front door, deployed continuously to
[eq-network.org](https://eq-network.org). The playground is an explanatory-model preview and remains
`noindex` while its scientific and editorial contracts mature.

## Develop

```bash
pnpm install                          # from the repo root; installs all workspaces
cp apps/site/env.example apps/site/.env   # then set PUBLIC_FORMSPREE_ENDPOINT for the contact form
pnpm --filter @eq-network/site dev --host 0.0.0.0 --port 4321
```

Node 22 and pnpm (pinned via `packageManager`). Per-workspace commands use pnpm filters, e.g.
`pnpm --filter @eq-network/site build`.

### Scripts (run from the repo root)

| Command               | What it does                                                                       |
| --------------------- | ---------------------------------------------------------------------------------- |
| `pnpm dev`            | Site dev server with hot reload; pass `--host 0.0.0.0 --port 4321` on this VM      |
| `pnpm dev:playground` | Standalone Vite harness for package-only work; do not run beside the site on 4321  |
| `pnpm test`           | Deterministic playground contracts, validation, and scientific golden trajectories |
| `pnpm build`          | Type-check and build every workspace, including the static production site         |
| `pnpm preview`        | Serve the production site build locally                                            |
| `pnpm check`          | Full local gate: formatting, lint, tests, and all builds                           |
| `pnpm lint`           | ESLint                                                                             |
| `pnpm format`         | Prettier (write); `pnpm format:check` verifies only                                |

The dependency-free browser smoke journey is separate because it needs a running site:

```bash
pnpm --filter @eq-network/playground smoke:browser
```

### The contact form

The contact form posts to Formspree, read from `PUBLIC_FORMSPREE_ENDPOINT` (a `PUBLIC_` build-time value,
not a confidential secret). Locally it comes from `apps/site/.env`; in CI it is injected from the
`PUBLIC_FORMSPREE_ENDPOINT` repository secret. Without it the form still renders but submissions go nowhere.

## Deploy

There is no local deploy command. Merging to `main` triggers `.github/workflows/deploy.yml`, which builds
the workspace and publishes `apps/site/dist` to GitHub Pages at `eq-network.org` (custom domain via
`apps/site/public/CNAME`). Pull requests run `.github/workflows/ci.yml`. See
[`apps/site/docs/runbooks/deploy.md`](apps/site/docs/runbooks/deploy.md).

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) and, for agents, [`AGENTS.md`](AGENTS.md). Project docs,
audits, and decision records live in [`docs/`](docs/README.md). Release history is in [`CHANGELOG.md`](CHANGELOG.md).

`AGENTS.md` and `CLAUDE.md` are two **identical** files on purpose (a symlink does not survive a Windows
checkout). Edit one and copy it to the other; CI fails if they drift.

## License

[MIT](LICENSE) — Copyright (c) 2024-2026 Equilibria Network.
