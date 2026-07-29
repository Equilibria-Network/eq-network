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
  - ACT I *Where does the money go?* (wealth concentration; flow economy)
  - ACT II *Who still gets a say?* (power concentration + the vote) ✅ started
  - ACT III *What do we end up believing?* (contagion, ~as today, retitled)
  - ACT IV *Does it spiral?* (backlash arrow → stable/oscillate/collapse map)
  - Tutorial: the commons, reassigned ("can rules we vote on actually hold?")
- **Every act needs a named surprise** a smart visitor would predict wrong
  (threshold-not-ramp; hollow democracy; two-dials-required; defenses-cause-
  the-cycle). Suite rule: every act's card ends with *what would change this
  answer*.
- **The robustness switcher** (strongest idea): one question, N structurally
  different worlds behind a switcher, with a visible verdict — *does the
  defense ranking survive changing the world?* Structural robustness as a
  button, not a doc.
- **Two contracts** keep it cheap: (1) boundary — whatever crosses between
  domains is a signal `{value, bias, fidelity}`; info-flow as *interface*,
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
  *by* people who ran the sims. Growing channel: agents reading for people —
  pages must be legible to a plain fetch.
- Credibility: pair the playground with worked papers ("built with this") —
  the Conway posture: browser toy *and* research instrument, visibly both.
