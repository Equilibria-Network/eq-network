<!-- Canonical agent guide. CLAUDE.md is kept identical to this file by hand.
     (A symlink is not used because it does not survive a Windows checkout.)
     Keep both short so they cannot meaningfully drift. -->

# Agent guide — eq-network

Read this before making changes. Full calibration is in [`CONTRIBUTING.md`](CONTRIBUTING.md);
project docs are in [`docs/`](docs/README.md).

## What this repo is

A **static** Astro 4 + React website (no backend, no database) published to GitHub Pages at
`eq-network.org`. Page copy and data live as typed files in `src/content/`; components render them.

## Do not commit these (they are gitignored — do not force-add them)

- `node_modules/`, `dist/`, `.astro/`, caches (`.vite/`, `.eslintcache`, `*.tsbuildinfo`)
- `.env` and any `.env.*` (only `env.example` is committed)
- OS / editor noise: `.DS_Store`, `Thumbs.db`, `Desktop.ini`, `*.swp`, `*.orig`
- `.claude/settings.local.json` — this is **per-machine, personal** settings. Shared team settings
  belong in `.claude/settings.json`. Keep your local file out of version control.

If `git status` shows any of the above, they should not be staged. Do not add them with `git add -f`.

## Never commit a secret

The site is public. The only runtime secret is the Formspree endpoint, injected at build time from the
`PUBLIC_FORMSPREE_ENDPOINT` repository secret. No API keys, tokens, or `.env` files in the repo — ever.

## Commit hygiene

- Small, focused commits. Keep **content edits**, **styling**, and **dependency bumps** in separate commits.
- Clear messages describing the change, not the tool that made it.
- Run `pnpm build` (it runs `astro check`) before pushing; a type error should fail the build, not ship.

## Before a non-trivial change

- Read the relevant component and its content file first.
- Do not add a backend, analytics, a new third-party script/CDN, or a new data-collection surface without
  raising it — these are privacy/architecture decisions recorded in `docs/adr/`.
- Do not hand-edit `dist/`; change the source and rebuild.
