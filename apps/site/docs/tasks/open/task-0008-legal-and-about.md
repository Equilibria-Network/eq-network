# Publish legal identity and strengthen the About page

- Provenance: task-0008 (owner request)
- Links back to: [public company record](https://www.allabolag.se/foretag/equilibria-network/uppsala/f%C3%B6reningar/3OQ7T3KI63IGG),
  [`../done/task-0004-privacy-policy-page.md`](../done/task-0004-privacy-policy-page.md)
- Status: in progress — `/legal` shipped and registration details added 2026-07-29; broader About-page
  work remains
- Owner: unassigned
- Priority: soon

## Problem

The site explains the research programme and team but does not identify the registered organisation behind
it. Visitors, partners, funders, and people exercising privacy rights should be able to find the legal
entity and authoritative contact information without relying on a third-party company directory.

The About page also needs a clearer institutional account: what Equilibria Network is, how the research
network relates to the registered organisation, where it is based, and how to contact it.

## Done when

A linked `/legal` page publishes owner-verified legal identity and contact details, the About page explains
the organisation clearly, and the footer exposes both routes without duplicating facts across components.

## Notes

- The owner supplied organisation number `802556-9552`, registration date, legal form, status,
  registered municipality, and postal address on 2026-07-29. These now appear on `/legal` and in the
  organisation structured data.
- The Swedish E-commerce Act requires a service provider's name, establishment address, and email to be
  easily and permanently available where the Act applies, plus organisation number, VAT number, and
  supervisory-authority details where applicable. Before treating the notice as owner-approved, confirm
  whether the association is VAT-registered and whether any activity requires supervisory
  authorisation. The pasted registry text listed VAT, F-tax, and employer registration as headings but
  did not unambiguously show which registrations are active, so the site does not claim them.
- Swedish nonprofit associations do not generally have to explain their internal governance structure
  on a website. Publish board/officer details only when there is a concrete transparency reason and the
  affected people have approved the disclosure.
- Verify every fact against an official registration record before publishing. At minimum confirm the
  legal name, organisation number, legal form, registered municipality, postal address, and authorised
  contact route. Do not infer details from the directory URL.
- Put shared organisation facts in one typed content module consumed by Legal, About, Footer metadata, and
  structured data.
- Decide whether a postal address should be public and whether officers or board members belong on the
  page. Apply data minimisation; a company directory listing is not automatic permission to republish every
  personal detail.
- Reconcile the controller identity in the privacy policy once the legal wording is owner-approved.
- This is an informational page, not a substitute for legal review.
