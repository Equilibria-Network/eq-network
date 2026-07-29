# Data map and processor inventory

What personal data this site touches, and who processes it. Kept current as processors change.

## Summary

The site is static, sets no cookies, runs no analytics, and loads no third-party tracking scripts.
Visiting the site exposes ordinary request metadata to GitHub Pages. The contact form is the only
surface where a visitor intentionally submits personal data.

## Personal data collected

| Data                                                       | Where collected                  | Purpose                                                        | Lawful basis (indicative) | Retention                                                                                                                                    |
| ---------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| IP address and ordinary request metadata                   | GitHub Pages hosting             | Deliver and protect the site                                   | Legitimate interests      | Controlled by GitHub according to purpose and legal obligations; raw logs are not available to Equilibria                                    |
| Name, email address, message body, and submission metadata | Contact form (`ContactForm.tsx`) | Receive and respond to an enquiry; protect the form from abuse | Legitimate interests      | Kept while useful for the enquiry, relationship, or a legal obligation; exact processor-side schedule still needs account-level confirmation |

No accounts, behavioural profiles, advertising data, or intentional collection of location or
special-category data. Visitors are asked not to submit sensitive or unnecessary information.

## Third-party processors

| Processor    | Role                    | Processing locations                                | Data it sees                                                                                  | Published safeguards                                                                                  | Project mitigation                                                                                                             |
| ------------ | ----------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| GitHub Pages | Static hosting / CDN    | United States and other GitHub processing locations | IP address and ordinary request metadata                                                      | GDPR disclosures, Standard Contractual Clauses, EU–US Data Privacy Framework, US state privacy rights | Static bundle only; no analytics or trackers; site-wide `no-referrer` policy; raw visitor logs are not available to Equilibria |
| Formspree    | Contact-form processing | United States                                       | Submitted name, email, message, and request metadata needed to process/protect the submission | Provider states GDPR/SCC and CCPA support and SOC 2 Type II assessment                                | Only three fields; no marketing use; EU-resident replacement is a planned migration                                            |

## Notes and open points

- The house preference is self-hosted or EU-resident processing. Both current processors are US-based.
  This is a recorded, accepted trade-off for a low-volume static site — see `CONTRIBUTING.md` §1 (Formspree
  is the current, endorsed handler) and the EU-migration enhancement
  [`../tasks/deferred/task-0003-eu-form-handler.md`](../tasks/deferred/task-0003-eu-form-handler.md).
- Visitors are told what happens to a contact submission: a short notice under the form links to
  `/privacy` (`apps/site/src/pages/privacy.astro`; copy in `apps/site/src/content/privacy.ts`), which
  discloses processors, practical mitigations, provider-published assurances, and GDPR rights.
- Confirm the Formspree account's configured submission/back-up deletion behaviour and document a
  specific schedule once it can be enforced.
- The privacy contact inbox (`contact@eq-network.org`) must be confirmed to exist and route.
- The public policy and this map require owner/legal review. Provider assurances are attributed claims,
  not an independent certification by Equilibria.
