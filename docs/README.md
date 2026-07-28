# Documentation

Project documentation for the Equilibria Network website. The running system is authoritative; when a
doc and the build disagree, fix the doc.

## Layout

```
docs/
  context/     orientation and canonical "how it works" reference
  adr/         architecture decision records — one locked decision each
  tasks/       actionable open work, decomposed from ADRs and audits
  lessons/     dated learnings and standing thematic notes
  audits/      point-in-time deep-analysis / audit bundles
  templates/   templates for ADRs, tasks, and lessons
  runbooks/    operational response procedures (build, deploy, rollback)
  privacy/     data map and third-party processor inventory
  README.md    this index
```

Project-wide calibration (scope, principles in force, principles skipped) lives in the repo-root
[`CONTRIBUTING.md`](../CONTRIBUTING.md).

## Start here

- New to the project: [`context/00-orientation.md`](context/00-orientation.md).
- Why is it built this way: [`adr/`](adr/).
- What needs doing: [`tasks/README.md`](tasks/README.md).
- The audits: [`audits/2026-07-28-audit-0001-inherited-recon.md`](audits/2026-07-28-audit-0001-inherited-recon.md)
  (recon) and [`audits/2026-07-28-audit-0002-code-hygiene-deep-dive.md`](audits/2026-07-28-audit-0002-code-hygiene-deep-dive.md)
  (code-hygiene deep dive).
- The cleanup gate before feature work: [`tasks/task-0001-pristine-baseline.md`](tasks/task-0001-pristine-baseline.md).

## Conventions

- Link with relative paths so a link-checker can resolve every `.md` link from its own directory.
- ADRs are numbered `NNNN-slug.md` and are immutable-ish: to change course, write a superseding ADR.
- Tasks are prefixed by provenance: `adr-NNNN-*`, `audit-NNNN-*`, or `task-NNNN-*`.
- House voice: short, plain sentences; institutional voice; no personal names or internal machine paths.
