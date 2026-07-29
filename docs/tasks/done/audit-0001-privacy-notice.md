# Add a privacy notice to the contact form

- Provenance: audit-0001
- Links back to: `../../audits/2026-07-28-audit-0001-inherited-recon.md` (F1), `../../privacy/data-map.md`
- Status: done — 2026-07-28
- Owner: unassigned
- Priority: now

## Outcome

Done. A short notice under the contact form (`ContactForm.tsx`, copy in `content/site.ts`) states that the
name, email, and message are sent to the form processor to answer the enquiry, and links to the `/privacy`
page (see [`task-0004-privacy-policy-page.md`](task-0004-privacy-policy-page.md)).

## Problem

The contact form sends a name, email, and message to Formspree (US) with no statement to the visitor
about what happens to their data. The processor choice is an accepted trade-off; the missing notice is the
gap.

## Done when

The contact form shows, or links to, a short plain-language note stating that submissions are processed by
a third-party form service and used only to respond to the enquiry.

## Notes

Minimal version: one line under the form. Fuller version: a `/privacy` page the note links to. Keep it
consistent with [`../../privacy/data-map.md`](../../privacy/data-map.md).
