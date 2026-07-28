# Write a privacy policy page

- Provenance: task-0004
- Links back to: [`../privacy/data-map.md`](../privacy/data-map.md),
  [`../adr/0004-privacy-review-before-integration.md`](../adr/0004-privacy-review-before-integration.md)
- Status: todo
- Owner: unassigned
- Priority: soon

## Problem

The site processes visitor personal data (contact-form name/email/message) but has no privacy policy page.
This is needed regardless of which form handler is chosen — anyone submitting the form is entitled to know
what happens to their data, who processes it, how long it is kept, and how to exercise their rights.

## Done when

A `/privacy` page exists, linked from the footer and referenced by the contact form, stating at least: what
data is collected and why, the lawful basis, the processor(s) and where data is stored, retention, data-
subject rights, and a contact for privacy requests. It stays consistent with
[`../privacy/data-map.md`](../privacy/data-map.md).

## Notes

- Content lives in `src/content/` and renders through a page under `src/pages/`, like the other pages.
- The contact-form inline notice (see [`audit-0001-privacy-notice.md`](audit-0001-privacy-notice.md)) should
  link to this page rather than duplicating it.
- The processor section depends on the outcome of [`task-0003-eu-form-handler.md`](task-0003-eu-form-handler.md);
  the page can be drafted now against the current processor and updated when the handler changes.
- Needs a real contact for privacy requests — use a role inbox (e.g. `privacy@…` / `contact@…`), not a
  personal address.
