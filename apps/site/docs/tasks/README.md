# Tasks

Actionable open work for the site (`apps/site`), one file per task. ADRs record decisions; tasks record
work to do. Filename prefix encodes provenance: `adr-NNNN-*` (from a decision), `audit-NNNN-*` (from an
audit), `task-NNNN-*` (standalone). Files are filed by status into `open/`, `deferred/`, and `done/`.
Numbers are contiguous within this app's scope.

> The one-time workspace migration that produced `apps/site` is tracked repo-wide, not here:
> [`../../../../docs/tasks/done/task-0001-repo-structure.md`](../../../../docs/tasks/done/task-0001-repo-structure.md)
> (from [`ADR-0001 monorepo-topology`](../../../../docs/adr/0001-monorepo-topology.md)).

## Umbrella tasks (start here)

| Task                                                                               | Summary                                                                                                                                                                                                                                                        |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [task-0001-pristine-baseline](open/task-0001-pristine-baseline.md)                 | The single "clean up before big dev" checklist — every housekeeping/bug/perf/a11y/maintainability sub-item, grouped into phases. Subsumes the `audit-*` detail tasks below. (baseline shipped 2026-07-28; residual polish is deferred or folds into task-0002) |
| [task-0002-visual-language-alignment](open/task-0002-visual-language-alignment.md) | Improve the UI/UX on a shared, enforceable design system: a mechanical foundation stage, then per-page redesign sub-tasks.                                                                                                                                     |

The `audit-*` files below are the granular details for individual sub-items of task-0001.

## Open

| Task                                                                               | From          | Summary                                                                                                                                       |
| ---------------------------------------------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [task-0001-pristine-baseline](open/task-0001-pristine-baseline.md)                 | Cleanup gate  | The clean-up-before-big-dev checklist (see umbrella above) (baseline shipped 2026-07-28; residual polish is deferred or folds into task-0002) |
| [task-0002-visual-language-alignment](open/task-0002-visual-language-alignment.md) | Design system | UI/UX on a shared, enforceable design system (see umbrella above)                                                                             |
| [task-0007-brand-page](open/task-0007-brand-page.md)                               | Owner request | Public `/brand` page: logo, palette, type, motifs, usage (renders from the design tokens)                                                     |

## Deferred (feature work — not part of the current cleanup phase)

| Task                                                                                   | From           | Summary                                                                                               |
| -------------------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------- |
| [task-0003-eu-form-handler](deferred/task-0003-eu-form-handler.md)                     | Privacy stance | EU-resident contact-form handler — a future enhancement (Formspree ships today; not a removal)        |
| [task-0005-visual-asset-regeneration](deferred/task-0005-visual-asset-regeneration.md) | Owner idea     | Regenerate all imagery to one visual identity (blocked on defining it; pairs with task-0002 redesign) |
| [task-0006-i18n](deferred/task-0006-i18n.md)                                           | ADR-0004       | i18n runtime (locale routing/catalogs/switcher); readiness sweep done now via M6, machinery deferred  |

## Done

| Task                                                                   | From            | Outcome                                                                           |
| ---------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------- |
| [task-0004-privacy-policy-page](done/task-0004-privacy-policy-page.md) | Owner request   | `/privacy` page shipped (draft — pending owner legal review + inbox confirmation) |
| [audit-0002-frozen-lockfile](done/audit-0002-frozen-lockfile.md)       | Audit 0001 · F2 | `pnpm install --frozen-lockfile` in CI for reproducible builds                    |
| [audit-0004-playground-favicon](done/audit-0004-playground-favicon.md) | Audit 0001 · F4 | Fixed the 404 favicon on `/lab/playground`                                        |
| [audit-0005-license](done/audit-0005-license.md)                       | Audit 0001 · F5 | MIT chosen; `LICENSE` added (Copyright (c) 2024-2026 Equilibria Network)          |
| [audit-0001-privacy-notice](done/audit-0001-privacy-notice.md)         | Audit 0001 · F1 | Contact-form notice added, linking to `/privacy`                                  |

_(Audit 0001 F3 "add rel=noopener" and B2 "wrong newsletter link" were both retracted — false positives.)_

## Not tracked here (decided against, or accepted as-is)

- A test suite, a CSP, analytics, and a backend are consciously not applied at this scale. See
  [`../../../../CONTRIBUTING.md`](../../../../CONTRIBUTING.md) Section 3.
- The `env.example` / README naming drift (F6) and the optional sitemap (F7) are noted in the audit; fold
  F6 into the F3/F4 batch when someone is in that area.
