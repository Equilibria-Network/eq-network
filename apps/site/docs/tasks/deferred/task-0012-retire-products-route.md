# Retire the legacy Products route

- Provenance: task-0012 (owner direction)
- Links back to:
  [`../open/task-0009-page-prototype-programme.md`](../open/task-0009-page-prototype-programme.md),
  [`../../../../playground/docs/tasks/done/task-0001-integrated-playground-app.md`](../../../../playground/docs/tasks/done/task-0001-integrated-playground-app.md)
- Status: deferred — Playground is now the primary product; route removal needs an explicit redirect and
  content-retention decision
- Owner: unassigned
- Priority: after playground review

## Problem

The primary navigation now links to Playground instead of Products. The old `/products` route still builds,
appears in the sitemap, and owns content and components that are no longer part of the intended primary
journey.

## Done when

The owner selects a redirect, archive, or removal policy; every internal link and metadata reference is
reconciled; the route and now-unreferenced implementation are removed only after explicit confirmation;
and the static build and link checks pass.

## Notes

- Do not delete the route or its content as incidental playground cleanup.
- Preserve any product language that still belongs on About, Lab, or Playground before removal.
- If the route remains as an archive, remove it from the prototype programme and document its noindex or
  canonical policy explicitly.
