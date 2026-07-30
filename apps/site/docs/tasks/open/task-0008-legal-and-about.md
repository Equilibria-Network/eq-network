# Publish legal identity and strengthen the About page

- Provenance: task-0008 (owner request)
- Links back to: [`../done/task-0004-privacy-policy-page.md`](../done/task-0004-privacy-policy-page.md)
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

- The owner supplied organisation number `802556-9552`, registration date, legal form, status, and
  registered municipality on 2026-07-29. Those organisation-level facts appear on `/legal`.
- The private postal address and named addressee were removed from `/legal`, the linked directory
  reference, and organisation structured data on 2026-07-29 at the affected person's request.
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
  legal name, organisation number, legal form, registered municipality, and authorised contact route.
  Do not infer or republish personal details from a directory.
- Put shared organisation facts in one typed content module consumed by Legal, About, Footer metadata, and
  structured data.
- Do not publish a private postal address or officers/board members without their explicit agreement and a
  concrete disclosure need. A directory listing is not permission to republish personal details.
- Reconcile the controller identity in the privacy policy once the legal wording is owner-approved.
- The broader About visual redesign and prototype are scoped in
  [`../deferred/task-0010-about-products-roadmap-redesigns.md`](../deferred/task-0010-about-products-roadmap-redesigns.md).
- This is an informational page, not a substitute for legal review.
