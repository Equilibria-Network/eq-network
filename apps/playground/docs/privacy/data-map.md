# Playground data map

- Last reviewed: 2026-07-30
- Scope: `apps/playground`

## Summary

The playground computes entirely in the visitor's browser. It has no accounts, forms, analytics, cookies,
local storage, remote model calls, or application logging.

| Data                           | Source             | Processing               | Destination         | Retention               |
| ------------------------------ | ------------------ | ------------------------ | ------------------- | ----------------------- |
| Scenario parameters and seed   | Visitor controls   | In-memory simulation     | Browser memory only | Until page close/reload |
| URL hash (`#economy`, etc.)    | Visitor navigation | Selects a scenario       | Browser URL/history | Browser-controlled      |
| Shared-run query and URL       | Visitor action     | Encodes settings locally | Clipboard/history   | Browser-controlled      |
| Standard HTTP request metadata | Browser/host       | Static asset delivery    | GitHub Pages        | GitHub's hosting policy |

The playground itself is bundled into the Equilibria GitHub Pages deployment. Links to other pages,
the public source repository, and the working-paper PDF navigate only after the visitor activates them.
No third-party script, remote model API, or remote visual asset is loaded by the playground.

## Revisit when

Adding analytics, error reporting, a remote simulation engine, server-saved runs, forms, accounts, or any
other networked data flow requires a privacy review before implementation.
