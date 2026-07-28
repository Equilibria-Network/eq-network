# ADR-0002: Formspree for the contact form

- Status: Withdrawn (reclassified as a task, 2026-07-28)
- Date: 2025 (approximate; reconstructed from repository history)

## Why withdrawn

Choosing a form handler is not an architectural decision worth an ADR. The operative default is simply:
prefer the privacy-friendly, EU-resident option when one does the same job.

The current implementation uses Formspree (US), which is a Cloud-Act exposure for contact-form personal
data. The intent is to **migrate to an EU-resident form handler** (or a self-hosted one). That work is
tracked as [`../tasks/task-0003-eu-form-handler.md`](../tasks/task-0003-eu-form-handler.md).

The mechanics that remain true regardless of provider: the form is client-side only; the endpoint is read
from `PUBLIC_FORMSPREE_ENDPOINT` (injected at build time from a repository secret); no submission data
touches infrastructure the project operates. See [`../privacy/data-map.md`](../privacy/data-map.md).
