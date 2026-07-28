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

## Status

Maintained. The site is the organisation's public front door, deployed continuously to
[eq-network.org](https://eq-network.org). The `playground/` app is in progress.

## Develop

```bash
pnpm install                          # from the repo root; installs all workspaces
cp apps/site/env.example apps/site/.env   # then set PUBLIC_FORMSPREE_ENDPOINT for the contact form
pnpm dev                              # run the site dev server (bind --host to reach it off-box)
```

Node 22 and pnpm (pinned via `packageManager`). Per-workspace commands use pnpm filters, e.g.
`pnpm --filter @eq-network/site build`.

### Scripts (run from the repo root)

| Command        | What it does                                                          |
| -------------- | --------------------------------------------------------------------- |
| `pnpm dev`     | Site dev server with hot reload                                       |
| `pnpm build`   | Build the site (`astro check` type-check + `astro build`)             |
| `pnpm preview` | Serve the production build locally                                    |
| `pnpm check`   | The full local gate before pushing: `format:check` + `lint` + `build` |
| `pnpm lint`    | ESLint                                                                |
| `pnpm format`  | Prettier (write); `pnpm format:check` to verify only                  |

There is no `test` script: this is a static content site with no unit suite, so `astro check` (inside
`build`, run by `check`) is the automated safety floor. See `CONTRIBUTING.md` §3.

### The contact form

The contact form posts to Formspree, read from `PUBLIC_FORMSPREE_ENDPOINT` (a `PUBLIC_` build-time value,
not a confidential secret). Locally it comes from `apps/site/.env`; in CI it is injected from the
`PUBLIC_FORMSPREE_ENDPOINT` repository secret. Without it the form still renders but submissions go nowhere.

## Deploy

There is no local deploy command. Merging to `main` triggers `.github/workflows/deploy.yml`, which builds
`apps/site` and publishes it to GitHub Pages at `eq-network.org` (custom domain via `apps/site/public/CNAME`).
Pull requests run `.github/workflows/ci.yml` (format, lint, build). See
[`docs/runbooks/deploy.md`](docs/runbooks/deploy.md).

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) and, for agents, [`AGENTS.md`](AGENTS.md). Project docs,
audits, and decision records live in [`docs/`](docs/README.md).

`AGENTS.md` and `CLAUDE.md` are two **identical** files on purpose (a symlink does not survive a Windows
checkout). Edit one and copy it to the other; CI fails if they drift.

## License

[MIT](LICENSE) — Copyright (c) 2024-2026 Equilibria Network.
