# Write a privacy policy page

- Provenance: task-0004
- Links back to: [`../../privacy/data-map.md`](../../privacy/data-map.md),
  [`../../adr/0004-privacy-review-before-integration.md`](../../adr/0004-privacy-review-before-integration.md)
- Status: done (draft) — 2026-07-28
- Owner: unassigned
- Priority: soon

## Outcome

`/privacy` shipped as a draft: `apps/site/src/pages/privacy.astro` renders copy from
`apps/site/src/content/privacy.ts`, linked from the footer and from a notice under the contact form. It
discloses what is collected, why, the lawful basis, the processors (GitHub Pages + Formspree, both US),
international transfers, retention, cookies (none), data-subject rights, and a privacy contact.

**Still needs the owner:** (1) a legal review of the draft copy, and (2) confirmation that the privacy
contact inbox `privacy@eq-network.org` exists and routes (or a different role inbox). Update
`content/privacy.ts` when the form handler changes (task-0003).

## Problem

The site processes visitor personal data (contact-form name/email/message) but has no privacy policy page.
This is needed regardless of which form handler is chosen — anyone submitting the form is entitled to know
what happens to their data, who processes it, how long it is kept, and how to exercise their rights.

## Done when

A `/privacy` page exists, linked from the footer and referenced by the contact form, stating at least: what
data is collected and why, the lawful basis, the processor(s) and where data is stored, retention, data-
subject rights, and a contact for privacy requests. It stays consistent with
[`../../privacy/data-map.md`](../../privacy/data-map.md).

## Notes

- Content lives in `src/content/` and renders through a page under `src/pages/`, like the other pages.
- The contact-form inline notice (see [`audit-0001-privacy-notice.md`](audit-0001-privacy-notice.md)) should
  link to this page rather than duplicating it.
- The processor section depends on the outcome of
  [`../deferred/task-0003-eu-form-handler.md`](../deferred/task-0003-eu-form-handler.md); the page is drafted
  against the current processor (Formspree) and should be updated when the handler changes.
- Needs a real contact for privacy requests — use a role inbox (e.g. `privacy@…` / `contact@…`), not a
  personal address.
