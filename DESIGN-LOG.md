# Design log — eq-network website

Shared, newest-first. One dated entry per working session: what changed, why,
what stays invariant, what's open. Anyone working in this repo (Jonas, Markov,
agents) appends here instead of carrying decisions in chat threads.

**Standing invariants** (Jonas):

- A visual graph-based view of the approximate dynamics, per scenario.
- The stats-over-time line charts.
- Every coupling arrow in the combined model is exactly neutral at κ = 0
  (the sealed same-seed twin is the causal instrument; never break it).
- Regime-showcase framing: the playground showcases the different regimes you
  can end up in under different assumptions — defaults make no likelihood
  claims and nothing is a forecast.

**The seam:** the CI Library stays a backend engine for now; this site is the
sample of how the interface might look. What crosses the seam is contracts and
recordings, never code. The backend white paper is a separate, decoupled track.

---

## 2026-07-29 (evening) — Pivot: paper-first models; flow tab withdrawn

Jonas's verdict on the shipped flow tab: unclear provenance, unjustified dials,
illegible scene, apparent duplicate of the Economic tab. Root causes owned in
the session log: visuals authored blind (never rendered before production), the
second structure shipped as a sibling tab instead of behind the robustness
switcher, dials without provenance notes.

**Decision:** models get built **paper-first** from now on — a small rigorous
working paper per model (assumptions enforced, pointable reference), starting
with economics at Farmer-school rigor. WP1 plan approved: LaTeX from the start;
implementation via the cilib register (`capital_economy`, a §7 fork of
`io_economy` with an owned AI-capital stock and upkeep-before-profit) plus an
`experiments/wp1_economy/` study; real literature sweep before drafting. The
playground's Economic tab gets rebuilt against the paper later (robustness
switcher); the flow tab is hidden from the scenario bar until then (module,
engine, and ladder rungs stay in the page — ladder still green).

## 2026-07-29 (later) — Act I lands: the flow economy; the monorepo arrives

**Act I spike** (`apps/site/prototypes/playground.html`, new sixth tab
"Economic · flows", orange sketch dot): a Leontief-lite flow economy — six
sectors with fixed IO coefficients (hub: machines feed everyone, plus a chain),
households that BUY, AI systems whose capital must out-earn upkeep before
profit. Money is strictly conserved: upkeep and reinvestment are machine-sector
purchases, savings drip back via wealth drawdown, AI hoards drain at 2%/tick.

- **The knee is real (threshold, not ramp):** below eff ≈ 0.3, automation
  cannot pay upkeep and dies — AI wealth share 0.00 forever. Across 0.30→0.40
  it jumps 0.07 → 0.32, saturating toward 0.67 (8 seeds). The machine sector
  ignites first (widest margins — it sells to everyone).
- **The better surprise: "richer, and not yours."** Output _grows_ 23 → 25
  while the AI wealth share goes 0 → 50%. GDP looks healthy through the whole
  event; concentration and collapse decouple.
- **Two levers separate:** AI wealth share 0.50 baseline → 0.39 redistribution
  → 0.36 ownership → 0.25 both; output pays no price for either.
- **The spike earned its keep by failing twice first:** v1's circular flow
  leaked (savings exited and never returned — income decayed 8%/tick, everyone
  died before the AI arrived); v2's `aiSpend` was unbacked money printing
  (dead AI kept spending 0.3/tick from nowhere). Both caught by probes, both
  fixed structurally. Verdict for the robustness switcher: the flow structure
  **earns Act I**.
- Ladder now **37/37** (4 flow rungs: conservation, knee, richer-not-yours,
  levers ordering).

**The repo restructured underneath the session** (~13:10–13:14): Markov's
engineering baseline merged from origin — pnpm monorepo (`apps/site`,
`apps/playground` placeholder, `packages/design-system`), CI, CHANGELOG,
CONTRIBUTING, MIT license. GitHub Desktop stashed the uncommitted working tree
to do it, and the dance **silently dropped**: (1) the morning's vote + flow
work, (2) the guard commit's (4f5f076) playground hunk during rebase, (3) the
_uncommitted_ page preamble ("these are toy models / nothing here pushes
back") and preamble self-test. All recovered from the unreachable stash object
(`bf25267`) and re-applied at the new path; content-diff vs the stash is now
empty except intentional additions. Lesson recorded: **uncommitted work in
this repo now gets stash-danced by syncs — commit early, and check
`git fsck --unreachable` before assuming loss.** The prototype's home is
`apps/site/prototypes/playground.html` per ADR-0005 (it migrates to
`apps/playground/` only when real playground development starts).

## 2026-07-29 — Act II lands: the vote (hollow democracy)

`prototypes/playground.html`, political tab. First step of the question-first
redesign (forest-walk session, same day — see below).

- **Engine:** every `voteCadence` (20) ticks the median citizen opinion is
  enacted — full turnout, nothing rigged. Enacted policy feeds nothing else in
  this tab (downstream lives in the combined tab's couplings); its job is the
  **responsiveness instrument**: `1 − |enacted − citizens' own median| / bias gap`.
  Pure addition — all prior trajectories bit-identical, ladder stayed green.
- **Result (port, 8 seeds):** responsiveness **0.73 organic / 0.39 amplified /
  0.61 defended**. The hollow-democracy surprise is real: the franchise stays
  perfect while the electorate is re-weighted upstream of the ballot box.
- **UI:** THE VOTE chart (enacted vs what-citizens-want), `vote responsiveness`
  badge (replaces top-actor share), new story beat, assumptions card rewritten
  (the "beliefs are a readout, not a lever" confession is deleted — beliefs now
  have a measured consequence, still not a material one).
- **Honesty labels:** colophon + card + anchors all say the vote is a
  website-side sketch, not yet in the engine. The pipeline DAG view was NOT
  extended (it derives from backend `@transform` metadata; the vote isn't there).
- **Validation ladder:** 33/33, new rung
  `political: the vote hollows out` (3-seed ordering with measured margins).
  Headless harness for the ladder: extract `@core` blocks, run in Node
  (no committed harness yet; scratchpad script, ~20 lines).

Democratic index now fully measurable on the tab: influence Gini + consensus
error + policy responsiveness.

## 2026-07-29 — Forest-walk session: the question-first model suite

Whiteboarding session (economist / computational social scientist / science
communicator / software engineer personas) on why the current suite "doesn't
make sense from the website's perspective" and what replaces it. Full output in
the session transcript; the load-bearing conclusions:

- **The bug is the taxonomy:** the suite is organized by backend mechanism
  family, not by visitor question. Target shape — four acts + a tutorial:
  - ACT I _Where does the money go?_ (wealth concentration; flow economy)
  - ACT II _Who still gets a say?_ (power concentration + the vote) ✅ started
  - ACT III _What do we end up believing?_ (contagion, ~as today, retitled)
  - ACT IV _Does it spiral?_ (backlash arrow → stable/oscillate/collapse map)
  - Tutorial: the commons, reassigned ("can rules we vote on actually hold?")
- **Every act needs a named surprise** a smart visitor would predict wrong
  (threshold-not-ramp; hollow democracy; two-dials-required; defenses-cause-
  the-cycle). Suite rule: every act's card ends with _what would change this
  answer_.
- **The robustness switcher** (strongest idea): one question, N structurally
  different worlds behind a switcher, with a visible verdict — _does the
  defense ranking survive changing the world?_ Structural robustness as a
  button, not a doc.
- **Two contracts** keep it cheap: (1) boundary — whatever crosses between
  domains is a signal `{value, bias, fidelity}`; info-flow as _interface_,
  never as ontology; (2) readout — every model emits the same small typed
  headline series (human share of wealth / voice / belief + a concentration
  index) so one renderer draws every act.
- **Predict-before-reveal** story steps operationalize the surprises.

**Decisions (Jonas, same day):** build directly in the playground (no prototype
ladder); Aug 8 no longer a scope constraint; Act IV backlash lives in
**attention reallocation** (not cultural reversion); Epoch anchors constrain
dial **ranges only**, never defaults; white paper decoupled — the contracts
live here and in code, not in a paper section.

**Parked** (deliberately, models first): story back-button; combined-view
display smoothing (position can interpolate, text cannot); params section
rename/collapse ("Initialization" → check-the-assumptions); agent-legibility
(a plain fetch of /lab/playground returns only the loading shell — all schema
text is JS-injected; fix by static digest + drift self-test); per-param
provenance notes (anchored / tuned-for-legibility / arbitrary-but-swept — no
invented citations). Blocked: papers strip on /lab (needs real links from
Jonas). Backlog: parameter-lattice recordings from the real engine to retire
the JS ports (never port JAX to the browser).

## 2026-07-28 — Planning call (Jonas / Markov / Aaron), decisions distilled

- The playground is **regime showcase, not forecast** — presets are the story,
  raw dials are the audit device ("the sliders let you check").
- Story navigation needs a real back affordance (dots exist but don't read as
  buttons).
- The combined view's flicker is a rendering issue, not a dynamics bug —
  cadenced series rendered raw at 80 ticks/sec.
- Audience: researchers/scenario-builders first; lay readers get stories told
  _by_ people who ran the sims. Growing channel: agents reading for people —
  pages must be legible to a plain fetch.
- Credibility: pair the playground with worked papers ("built with this") —
  the Conway posture: browser toy _and_ research instrument, visibly both.
