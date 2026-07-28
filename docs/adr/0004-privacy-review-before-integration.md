# ADR-0004: Privacy-policy deep dive before integrating any data-touching service

- Status: Accepted (2026-07-28)
- Date: 2026-07-28

## Context

The site processes visitor personal data (at minimum, contact-form name/email/message). Choosing a
third-party service to handle that data on the basis of a feature comparison is not enough — the deciding
factors are jurisdictional and contractual (where data is stored, who the subprocessors are, what the DPA
says, what rights and retention apply). Those live in the provider's privacy policy, DPA, and imprint, not
its marketing page.

## Decision (proposed)

Before integrating **any** third-party service that stores, processes, or transmits visitor personal data
(form handlers, analytics, embeds, CDNs that see submissions, email delivery, etc.), produce a written
**privacy deep-dive report** and attach it to the deciding task. The report covers, per candidate:

- Legal entity and headquarters jurisdiction.
- Where submission/user data is physically stored and processed.
- The full subprocessor chain (and whether any are US / Cloud-Act exposed).
- What the DPA / privacy policy commits to: retention, deletion, data-subject rights, security, breach
  notice, international-transfer mechanism.
- Data minimisation: what the service actually receives vs what it needs.
- Cost, spam handling, and integration effort (secondary to the above).

The decision, and the report it rests on, are recorded (task or ADR). Ranked against the house preference:
self-hosted > EU/EEA/CH resident > "adequate" > US > avoid.

## Consequences

- **Enables:** provider choices that are defensible on privacy grounds, not just convenience; a paper trail
  if a data-protection question is ever raised.
- **Cost:** a research step before each such integration. Proportionate — these decisions are hard to
  reverse once visitor data has flowed.

## Revisit when

The process proves too heavy for genuinely trivial, no-personal-data integrations — at which point scope it
explicitly to services that touch personal data (as worded above).

## Sources

House privacy preference (self-host > EU > US); [`../privacy/data-map.md`](../privacy/data-map.md);
[`../tasks/task-0003-eu-form-handler.md`](../tasks/task-0003-eu-form-handler.md).
