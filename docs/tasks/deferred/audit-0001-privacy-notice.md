# Add a privacy notice to the contact form

- Provenance: audit-0001
- Links back to: `../../audits/2026-07-28-audit-0001-inherited-recon.md` (F1), `../../adr/0002-formspree-contact-form.md`
- Status: todo
- Owner: unassigned
- Priority: now

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
