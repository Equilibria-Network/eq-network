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
  This is a recorded, accepted trade-off for a low-volume static site — see
  [`../adr/0002-formspree-contact-form.md`](../adr/0002-formspree-contact-form.md).
- The site does not yet tell a visitor what happens to a contact submission. A short privacy note next to
  the form (or a linked privacy page) would close that gap. Tracked as
  [`../tasks/audit-0001-privacy-notice.md`](../tasks/audit-0001-privacy-notice.md).
- Confirm whether GitHub Pages access logs are retained or accessible to the project; if not accessible,
  say so here.
