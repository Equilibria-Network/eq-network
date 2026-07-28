# Data map and processor inventory

What personal data this site touches, and who processes it. Kept current as processors change.

## Summary

The site is static and collects no personal data by default. It sets no cookies, runs no analytics, and
loads no third-party scripts. The single data-collection surface is the contact form.

## Personal data collected

| Data                              | Where collected                  | Purpose               | Lawful basis (indicative)                                      | Retention                                                            |
| --------------------------------- | -------------------------------- | --------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------- |
| Name, email address, message body | Contact form (`ContactForm.tsx`) | Respond to an enquiry | Consent / legitimate interest (the visitor chooses to send it) | Held by the form processor per its policy; not stored by the project |

No accounts, no behavioural tracking, no location data, no special-category data.

## Third-party processors

| Processor    | Role                    | HQ / jurisdiction         | Data it sees                                              | Notes                                                    |
| ------------ | ----------------------- | ------------------------- | --------------------------------------------------------- | -------------------------------------------------------- |
| GitHub Pages | Static hosting / CDN    | United States (Cloud Act) | Request metadata (IP, user agent) in standard access logs | Serves the static bundle; no application data            |
| Formspree    | Contact-form processing | United States (Cloud Act) | Name, email, message from each submission                 | Endpoint injected at build time from a repository secret |

## Notes and open points

- The house preference is self-hosted or EU-resident processing. Both current processors are US-based.
  This is a recorded, accepted trade-off for a low-volume static site — see `CONTRIBUTING.md` §1 (Formspree
  is the current, endorsed handler) and the EU-migration enhancement
  [`../tasks/deferred/task-0003-eu-form-handler.md`](../tasks/deferred/task-0003-eu-form-handler.md).
- Visitors are told what happens to a contact submission: a short notice under the form links to the
  `/privacy` page (`src/pages/privacy.astro`, copy in `src/content/privacy.ts`), which discloses the
  processors and rights. The `/privacy` draft should get an owner legal review, and the privacy contact
  inbox (`privacy@eq-network.org`) must be confirmed to exist and route.
- Confirm whether GitHub Pages access logs are retained or accessible to the project; if not accessible,
  say so here.
