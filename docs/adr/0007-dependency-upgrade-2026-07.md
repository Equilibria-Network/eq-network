# ADR-0007: dependency and toolchain upgrade (2026-07)

- Status: Accepted
- Date: 2026-07-28

## Context

The baseline shipped on frameworks that were one to three majors behind: Astro 4.16, React 18.3,
`@astrojs/react` 3.6, `@formspree/react` 2.5, `lucide-react` 0.460, plus a root lint/format toolchain
on ESLint 9 and the GitHub Actions pinned to older majors. Staying behind accrues security debt (the
repo carried a backlog of Dependabot alerts) and makes each future upgrade larger and riskier. The
owner authorised a single deliberate upgrade pass across the board.

The risk is real: three Astro majors and a React major have breaking changes, and the newest
TypeScript is the rewritten native compiler, which the Astro tooling does not yet support.

## Decision

Upgrade to the current majors, in verified layers, each proven with `pnpm check` (format, lint,
`astro check`, build) plus a browser smoke test of the hydrated React islands:

- **Astro 4.16 -> 7.1**, `@astrojs/react` 3.6 -> 6.0, `@astrojs/check` 0.9.6 -> 0.9.10.
- **React 18.3 -> 19.2** (`react`, `react-dom`, `@types/react`, `@types/react-dom`).
- **`@formspree/react` 2.5 -> 3.0** (`useForm` / `ValidationError` API unchanged for our usage).
- **`lucide-react` 0.460 -> 1.27.**
- **TypeScript 5.9 -> 6.0** (see the exception below).
- **Root toolchain:** ESLint 9 -> 10, `eslint-plugin-astro` 1 -> 3, `@eslint/js` 10, `globals` 15 -> 17,
  `eslint-config-prettier` 10, Prettier 3.9.
- **GitHub Actions:** `checkout` 4 -> 7, `setup-node` 4 -> 7, `upload-pages-artifact` 3 -> 5,
  `deploy-pages` 4 -> 5, `pnpm/action-setup` 4 -> 6.

### Exception: TypeScript held at 6.x, not 7.x

TypeScript 7.0 (the native "corsa" compiler) is published but the Astro tooling does not yet support
it: `@astrojs/check` 0.9.10 declares `typescript@^5 || ^6`, and `typescript-eslint` 8.65 declares
`>=4.8.4 <6.1.0`. Installing TS 7 made `astro check` run without resolving the project's `tsconfig`
(a flood of spurious "change `lib` to es2015" and "esModuleInterop" errors). TypeScript 6.0.3 is the
newest release both tools accept, so we pin there. TS 7 is deferred until `@astrojs/check` and
`typescript-eslint` add native-compiler support (tracked in task-0001 C5 / a future ADR).

## Consequences

- **Code changes required by the majors (minimal):**
  - React 19 removed the zero-argument `useRef` overload; `LorenzAttractor`'s
    `useRef<number>()` became `useRef<number | undefined>(undefined)`.
  - React 19's automatic JSX runtime makes `import React from 'react'` dead in components that never
    reference the `React` namespace. Removed from 28 files; kept where `React.*` is still used
    (`AboutTeam`, `ResearchGraph`). `forwardRef` (in `StepNarrative`) is soft-deprecated but still works.
- **Verification:** `pnpm check` green; every route serves 200 under `astro preview`; the React
  islands (Lorenz canvas, roughjs explainer visuals, the research tech-tree dialog) hydrate and
  interact with zero console errors or warnings.
- **Security:** clears the bulk of the outstanding Dependabot alerts by moving off the old majors.
- **Node floor:** Astro 7 requires Node `>=22.12`; CI pins Node 22 (latest 22.x) and satisfies it.
- **Follow-up:** revisit TypeScript 7 when the tooling supports it; a full `astro:assets` image
  migration (task-0001 P3) remains a separate deferred effort.

## Sources

`pnpm outdated` and the npm registry (versions and peer ranges verified 2026-07-28); React 19 upgrade
notes (`useRef`, the JSX transform, `forwardRef`); Astro 7 `engines` (`node >=22.12`); the peer-range
declarations of `@astrojs/check` and `typescript-eslint` cited above.
