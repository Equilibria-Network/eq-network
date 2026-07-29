# @eq-network/playground

Placeholder for the interactive agent-based-model playground — a browser-run simulation with tweakable
parameters (agent count, iteration settings, etc.), serving the accessible tier of the modelling tools.
The full high-powered engine lives in a separate repository.

Not yet implemented. The current prototype is served by the site from `apps/site/prototypes/playground.html`
(imported raw at build time). When playground development starts, that prototype migrates here into a real
app with its own build, its own `docs/adr/tasks/`, and its own deploy target (a header-capable static host,
since multi-threaded WebAssembly needs `SharedArrayBuffer` / COOP+COEP headers that GitHub Pages cannot set).

See [`../../docs/adr/0005-repo-topology.md`](../../docs/adr/0005-repo-topology.md) and
[`../../docs/adr/0001-astro-static-github-pages.md`](../../docs/adr/0001-astro-static-github-pages.md).
