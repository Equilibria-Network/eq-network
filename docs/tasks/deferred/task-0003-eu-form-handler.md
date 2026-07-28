# Migrate the contact form to an EU-resident handler (future enhancement)

- Provenance: task-0003 (house privacy stance; `CONTRIBUTING.md` §1)
- Links back to: [`../../privacy/data-map.md`](../../privacy/data-map.md)
- Status: deferred (future enhancement) — owner will pick a handler later; not part of the current cleanup phase
- Owner: unassigned
- Priority: later (enhancement)

## Problem

The contact form works today on **Formspree (US)** — this is the endorsed, shipping handler (see
`CONTRIBUTING.md` §1). Formspree is US-headquartered (Cloud-Act exposure), and the house preference is
self-hosted or EU-resident processing. This task is the **optional enhancement** of switching to an
EU-resident (or self-hosted) handler that does the same job. It is not a removal: Formspree stays until a
chosen replacement is live.

## Done when

The contact form submits to an EU-resident (or self-hosted) handler; the data map and `env.example` are
updated; the old Formspree endpoint/secret is retired.

## Options (researched 2026-07-28, provider docs/privacy pages; verify before committing)

The integration is small: `ContactForm.tsx` posts name/email/message to an endpoint from a `PUBLIC_*` env
var; most handlers accept a plain form POST, so the swap is endpoint + field-name mapping + spam protection.

Genuinely EU / self-hostable candidates (US options — Formspree, Basin, Formcarry, Web3Forms, Getform —
rejected on jurisdiction):

| Option                     | HQ / data location                           | Fit                                                                      | Free tier                          | Caveats                                                                           |
| -------------------------- | -------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------- | --------------------------------------------------------------------------------- |
| **Form.taxi**              | Austria HQ; data hosted ALL-INKL, Dresden DE | Plain HTML `action` endpoint — cleanest drop-in                          | 3 forms / 40 submissions per month | Email via Mailjet (EU), captcha via Friendly Captcha (DE) — both EU subprocessors |
| **Formlite** (self-host)   | Your EU VPS                                  | MIT, single Docker + SQLite; honeypot, domain allowlist, signed webhooks | free (self-run)                    | You run it; use an EU SMTP. Best privacy per house preference                     |
| **Formlander** (self-host) | Your EU VPS                                  | Docker + SQLite, dashboard, Turnstile/rate-limit                         | free (self-run)                    | Email via SMTP/Mailgun depending on config                                        |
| **Formspark**              | Belgium HQ; data in Ireland                  | Formspree-style endpoint                                                 | check pricing                      | Subprocessors unverified                                                          |
| **nForms**                 | Germany HQ                                   | HTML POST                                                                | 100/month                          | Runs on Cloudflare + Resend (US email) — weaker on the US-subprocessor goal       |

## Not yet a recommendation — the choice needs a privacy deep dive

The table above is a feature/jurisdiction shortlist, not a decision. Per
[ADR-0004](../../adr/0004-privacy-review-before-integration.md), the choice must rest on a proper privacy
deep-dive (legal entity, exact data location, full subprocessor chain, DPA terms, retention, transfer
mechanism) — not a marketing-page comparison.

Two finalists to run that deep dive on:

- **Form.taxi** (hosted, EU) — the zero-ops candidate.
- **Self-hosted Formlite** on an EU VPS — the house-preference-maximal candidate (self-host > EU-hosted).

## Done when (updated)

A privacy deep-dive report exists for the finalists (attached here), the owner picks one, and the contact
form is migrated: endpoint swapped, [`../../privacy/data-map.md`](../../privacy/data-map.md) and `env.example`
updated, the Formspree secret retired, and the choice linked from the privacy policy page
([`task-0004-privacy-policy-page.md`](task-0004-privacy-policy-page.md)).

## Next step

Produce the ADR-0004 privacy deep-dive on Form.taxi and self-hosted Formlite, then bring the two to the
owner to choose. (Offer standing: this can be run now on request.)
