# Site documentation

Documentation for the Equilibria Network **website** (`apps/site`) — the static Astro app published to
`eq-network.org`. The running system is authoritative; when a doc and the build disagree, fix the doc.

This is app-scoped documentation. Repo-wide material (monorepo topology, cross-app tooling, shared
templates) lives in the root [`../../../docs/`](../../../docs/README.md).

## Layout

```
apps/site/docs/
  context/     orientation and canonical "how it works" reference
  adr/         architecture decision records — one locked decision each
  tasks/       actionable open work, decomposed from ADRs and audits
  audits/      point-in-time deep-analysis / audit bundles
  runbooks/    operational response procedures (build, deploy, rollback)
  privacy/     data map and third-party processor inventory
  handoffs/    session handoff notes (gitignored; local working context)
  README.md    this index
```

The shared authoring templates (ADR, task, lesson, handoff) live once at the repo root in
[`../../../docs/templates/`](../../../docs/templates/).

## Start here

- New to the site: [`context/00-orientation.md`](context/00-orientation.md).
- Why it is built this way: [`adr/`](adr/).
- What needs doing: [`tasks/README.md`](tasks/README.md).
- The audits: [`audits/2026-07-28-audit-0001-inherited-recon.md`](audits/2026-07-28-audit-0001-inherited-recon.md)
  (recon) and [`audits/2026-07-28-audit-0002-code-hygiene-deep-dive.md`](audits/2026-07-28-audit-0002-code-hygiene-deep-dive.md)
  (code-hygiene deep dive).
- The cleanup gate before feature work: [`tasks/open/task-0001-pristine-baseline.md`](tasks/open/task-0001-pristine-baseline.md) (baseline shipped 2026-07-28).

## Decision records (ADRs)

| ADR                                                   | Decision                                                   |
| ----------------------------------------------------- | ---------------------------------------------------------- |
| [0001](adr/0001-astro-static-github-pages.md)         | Astro static site published to GitHub Pages                |
| [0002](adr/0002-visual-language-system.md)            | A shared design system (concept) — _superseded by 0006_    |
| [0003](adr/0003-privacy-review-before-integration.md) | Privacy-policy deep dive before integrating a data service |
| [0004](adr/0004-i18n-readiness.md)                    | i18n readiness now, i18n runtime deferred                  |
| [0005](adr/0005-dependency-upgrade-2026-07.md)        | Dependency and toolchain upgrade (2026-07)                 |
| [0006](adr/0006-tailwind-design-system.md)            | Tailwind v4 as the design-system foundation                |

The monorepo-topology decision that produced `apps/site` is repo-wide:
[`../../../docs/adr/0001-monorepo-topology.md`](../../../docs/adr/0001-monorepo-topology.md).

## Conventions

- Link with relative paths so a link-checker can resolve every `.md` link from its own directory.
- ADRs and tasks are numbered `NNNN-slug.md`, contiguous from 0001 **within this app's scope**.
- ADRs are immutable-ish: to change course, write a superseding ADR.
- Tasks are prefixed by provenance: `adr-NNNN-*`, `audit-NNNN-*`, or `task-NNNN-*`.
- House voice: short, plain sentences; institutional voice; no personal names or internal machine paths.

Project-wide calibration lives in the repo-root [`../../../CONTRIBUTING.md`](../../../CONTRIBUTING.md).
