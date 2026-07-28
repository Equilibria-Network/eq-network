# Runbook: build, deploy, and rollback

Genre: how-to (Diátaxis). The operational procedures for shipping the site.

## Normal deploy

1. Merge or push to `main`.
2. `.github/workflows/deploy.yml` runs: install → `pnpm build` (`astro check` + `astro build`) → upload
   `dist/` → publish to GitHub Pages.
3. Confirm the run succeeded in the repository's Actions tab and load `https://eq-network.org`.

A failed build does not publish. The previously published site stays live.

## Manual deploy

Trigger the workflow from the Actions tab using `workflow_dispatch` (the workflow allows it).

## The build fails in CI

| Symptom                             | First step                                                                                                       |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `astro check` type errors           | Reproduce locally with `pnpm build`; fix the type error at its source                                            |
| Dependency install fails            | Confirm `pnpm-lock.yaml` is committed and consistent with `package.json`                                         |
| Missing `PUBLIC_FORMSPREE_ENDPOINT` | Confirm the repository secret of that name still exists; the contact form degrades but the build should not fail |

## Rollback

There is no server state to roll back. To revert the published site, revert the offending commit on
`main` (or `git revert`) and let the workflow republish the previous content. GitHub Pages also keeps
prior deployments in the environment history if an immediate re-publish is needed.

## Custom domain

The domain `eq-network.org` is bound by `public/CNAME`. If the domain stops resolving to the site,
confirm `public/CNAME` still contains `eq-network.org` and that the DNS record still points at GitHub
Pages.
