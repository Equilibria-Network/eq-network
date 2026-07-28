# Tasks

Actionable open work, one file per task. ADRs record decisions; tasks record work to do. Filename prefix
encodes provenance: `adr-NNNN-*` (from a decision), `audit-NNNN-*` (from an audit), `task-NNNN-*`
(standalone). Files are filed by status into `open/`, `deferred/`, and `done/`.

## Umbrella tasks (start here)

| Task                                                                               | Summary                                                                                                                                                                     |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [task-0005-repo-structure](done/task-0005-repo-structure.md)                       | **First structural step (gated on ADR-0005):** reorganise into an app-scale workspace so site + playground are independent. Everything else lands inside this layout.       |
| [task-0001-pristine-baseline](open/task-0001-pristine-baseline.md)                 | The single "clean up before big dev" checklist — every housekeeping/bug/perf/a11y/maintainability sub-item, grouped into phases. Subsumes the `audit-*` detail tasks below. |
| [task-0002-visual-language-alignment](open/task-0002-visual-language-alignment.md) | Improve the UI/UX on a shared, enforceable design system: a mechanical foundation stage, then per-page redesign sub-tasks.                                                  |

The `audit-*` files below are the granular details for individual sub-items of task-0001.

## Open

| Task                                                                               | From          | Summary                                                                                   |
| ---------------------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------- |
| [task-0001-pristine-baseline](open/task-0001-pristine-baseline.md)                 | Cleanup gate  | The clean-up-before-big-dev checklist (see umbrella above)                                |
| [task-0002-visual-language-alignment](open/task-0002-visual-language-alignment.md) | Design system | UI/UX on a shared, enforceable design system (see umbrella above)                         |
| [task-0008-brand-page](open/task-0008-brand-page.md)                               | Owner request | Public `/brand` page: logo, palette, type, motifs, usage (renders from the design tokens) |

## Deferred (feature work — not part of the current cleanup phase)

| Task                                                                                   | From           | Summary                                                                                               |
| -------------------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------- |
| [task-0003-eu-form-handler](deferred/task-0003-eu-form-handler.md)                     | Privacy stance | EU-resident contact-form handler — a future enhancement (Formspree ships today; not a removal)        |
| [task-0006-visual-asset-regeneration](deferred/task-0006-visual-asset-regeneration.md) | Owner idea     | Regenerate all imagery to one visual identity (blocked on defining it; pairs with task-0002 redesign) |
| [task-0007-i18n](deferred/task-0007-i18n.md)                                           | ADR-0006       | i18n runtime (locale routing/catalogs/switcher); readiness sweep done now via M6, machinery deferred  |

## Done

| Task                                                                   | From            | Outcome                                                                           |
| ---------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------- |
| [task-0005-repo-structure](done/task-0005-repo-structure.md)           | ADR-0005        | Workspace reorganised into an app-scale layout                                    |
| [audit-0002-frozen-lockfile](done/audit-0002-frozen-lockfile.md)       | Audit 0001 · F2 | `pnpm install --frozen-lockfile` in CI for reproducible builds                    |
| [audit-0004-playground-favicon](done/audit-0004-playground-favicon.md) | Audit 0001 · F4 | Fixed the 404 favicon on `/lab/playground`                                        |
| [audit-0005-license](done/audit-0005-license.md)                       | Audit 0001 · F5 | MIT chosen; `LICENSE` added (Copyright (c) 2024-2026 Equilibria Network)          |
| [task-0004-privacy-policy-page](done/task-0004-privacy-policy-page.md) | Owner request   | `/privacy` page shipped (draft — pending owner legal review + inbox confirmation) |
| [audit-0001-privacy-notice](done/audit-0001-privacy-notice.md)         | Audit 0001 · F1 | Contact-form notice added, linking to `/privacy`                                  |

_(Audit 0001 F3 "add rel=noopener" and B2 "wrong newsletter link" were both retracted — false positives.)_

## Not tracked here (decided against, or accepted as-is)

- A test suite, a CSP, analytics, and a backend are consciously not applied at this scale. See
  [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md) Section 3.
- The `env.example` / README naming drift (F6) and the optional sitemap (F7) are noted in the audit; fold
  F6 into the F3/F4 batch when someone is in that area.
