# Lab content review — modelling-assumptions cards (2026-07-27)

Standing review for future revisions of eq-network.org/lab and the playground.
Sources: a four-reader cold-read panel of the per-scenario "Modelling
assumptions" cards (reaction files + synthesis in the engine repo at
`Collective Intelligence Library/cold-read/lab-assumptions-cards-2026-07-27/`)
plus a collapse audit of the coupled model
(`experiments/assumption_audits/collapse_audit.py` in the engine repo; numbers
reproduced below). Panel: an
Ostrom-tradition ABM scholar (fresh-careful), a 17-year-old who played the
sliders first (the register's own bar; distracted), a JASSS-editor-like ABM
standards reader (90 seconds, hostile), a Gradual-Disempowerment-co-author-like
ally (substantive). All four are simulations of readers *like* those people,
not the people themselves.

---

## 1. The headline finding

**Every reader independently converged on the author's own suspicion: the
model's non-collapse is partly manufactured, and the cards don't say so.**
The high-schooler's exit: "still don't know if there's a hidden floor they're
not telling me about — probably go back and try to make the pond hit exactly
zero myself." The cards' candor currently works as *disclaimer* ("this is a
knob") when readers need it to work as *explanation* ("here is the floor, here
is what sets it, here is what removing it does — we checked").

### The audited floors (keep these numbers current if dynamics change)

| Domain | Floor at defaults | Verdict | The floor-setter |
|---|---|---|---|
| Culture | share ≈ 0.54–0.59 coupled-undefended | **Manufactured** — recovery 0 ⇒ share 0.008 (total collapse) | constant native `recovery` (0.15/tick), never scaled by whether a human-culture community remains to revert into |
| Politics | human share ≈ 0.45–0.50 | **Structural, undocumented** — insensitive to self_weight (0.15→0.01), update_rate, amplification 8 | AI listening rows are frozen *pointing at citizens*: AI actors never stop attending to humans, perpetually returning eigenvector mass to the demos |
| Economy | income share 0.07 (T=500) → 0.018 (T=1500, all-out) | **No floor** — genuinely still sliding | — (honest collapse) |
| Consensus | error bounded below `ai_bias` | Structural by design | Friedkin–Johnsen anchor (documented on the card — the one floor that is) |

Two structural facts no card mentions: **opinions feed back into nothing**
(consensus is a pure readout), and **undefended politics is a sink** (without a
tax to erode, influence loss has zero downstream consequence).

---

## 2. What works — do not lose in any revision

- **The "leaves out" candor discipline.** All four readers, at every attention
  level, credited it as the reason they kept reading. The JASSS-editor reader:
  the calibrated-knob admission is "the sentence that never appears in the
  papers I reject."
- **Bullets phrased in the language of things the visitor just touched.** The
  high-schooler understood alignment/sanctions/coin-flip bullets *because they
  matched sliders she had dragged*; the κ=0 sentence ("money buys reach,
  culture directs attention, influence writes the rules — all exactly neutral
  at κ=0") was her favorite on the page.
- **The causal-twin instrument** (same-seed pairs, differenced) — the experts'
  favorite methodological move. Keep it; translate it (see §3).
- **"The collapse is assumed, not discovered"** (economic card) — the experts'
  model of what an assumptions line should be. Its shape: state the
  circularity, then point at the successor that fixes it.

---

## 3. Card-writing rules for the next revision

1. **Name the floor, every card.** One line in slider language: "crank
   everything against the humans and X still won't go below Y — because of Z;
   remove Z and it goes to zero; we checked." §1's table supplies Z per
   scenario. This single line converts candor from disclaimer to explanation
   and answers "was the demo rigged" in both directions.
2. **Candor must carry information.** Every "this is a knob" line should say
   whether the knob was swept and what the sweep showed ("only sign and
   ordering survive the hand-set range — tested, not asserted"). The sweeps
   exist (tuning scripts, collapse audit, cadence scan); the cards never say so,
   so the hostile expert couldn't tell tested from asserted.
3. **Slider-first phrasing.** Lead each bullet with the dial the visitor can
   touch, then the mechanism. Currently regrowth-rate — the first slider anyone
   drags — gets no "why this value" anywhere.
4. **Jargon budget: one term of art per card, translated inline.** Confirmed
   bounces at the high-schooler bar: "the Ostrom anchor" (unexplained proper
   noun), "paired same-seed runs, differenced" (three re-reads, skipped),
   "principal" (school principal collision). Confirmed passes: "coin-flip,"
   "logistic" (recognized from biology), the three-arrows κ sentence.
5. **The omissions inventory must include the *known-strongest* omissions,
   not just the convenient ones.** Missing today, flagged by the panel:
   - **Communication / cheap talk** (commons) — the single strongest treatment
     effect in the CPR experimental literature (Ostrom–Walker–Gardner 1992);
     its absence from the "leaves out" line is the tell that reads as
     "AI-safety people borrowing Ostrom's vocabulary."
   - **Irreversibility / basins** (everywhere) — GD's actual endpoint; nothing
     in the build is a basin, everything is a rate or level. Say so.
   - **§2's consumption channel** (economic) — the card says "no demand side"
     but not that this makes *half of GD §2 unrepresentable* in the substrate.
   - **§4's state dependence** (political) — the card measures *voice*; the
     paper's claim is about tax base / coercive capacity / legitimacy. The only
     trace is the words "tax enforcement" inside a coupling label. Flag it.
   - **Additional couplings** (combined) — the ring is the minimum viable loop,
     not the paper's mesh; add a "leaves out: further arrows" line.
6. **Fix staleness:** the combined card still says "three couplings" — there
   are five since the flywheel landed (regulatory_capture, converts_capitalize).
   Cards must be updated in the same commit as dynamics changes.
7. **Chips must match playability.** Political/cultural/combined say IN-DESIGN
   while their playground tabs feel finished — this cost trust ("what else on
   this site is labeled wrong?"). Either flip the chips, or add an intermediate
   state ("playable v0 — not yet benchmarked"), but reconcile.
8. **Card order mirrors attention:** readers open the card for the tab they
   played, read ~5 bullets, and stop. Put the floor line and the slider-meaning
   lines in the first three bullets; move lineage/register talk to the end.

---

## 4. Model-backlog candidates raised by the review

(Engine work, not copy — record here so website claims can track them.)

- **Couple `recovery` to the remaining human-culture share** — the "community
  to revert into" story. Removes the manufactured culture floor honestly; the
  displacement corner then has a true absorbing state, which is the paper's
  actual claim.
- **Let AI listening drift toward AI** (remove/relax the frozen-rows
  assumption) — closes full political capture structurally; models the machine
  economy attending to itself.
- **Rescue probe for irreversibility** — run collapse, switch the full defense
  portfolio on at t≈300 via the schedule, measure what recovers vs. what is
  locked in. Cheapest honest operationalization of "basin"; machinery already
  exists (schedules + same-seed twins).
- **Consumption channel** for the economic substrate (GD §2's second half);
  **state-dependence substrate** for §4 (tax base / coercion / legitimacy as
  its own model, not a coupling label); **communication mechanism** for the
  commons (the missing strongest lever); **wire opinions to something** or
  demote consensus to an explicitly-decorative readout.
- **Sensitivity note**: publish the sweeps that already exist (defense grids,
  cadence scan, collapse audit) wherever the cards claim robustness.

---

## 5. Standing review checklist for future lab-page changes

Before shipping copy that describes the models:

- [ ] Does every scenario card name its floor and what sets it?
- [ ] Does every "knob" admission say swept-or-not and what the sweep showed?
- [ ] Can a smart high schooler who just played the sliders parse every bullet
      (≤1 untranslated term of art per card)?
- [ ] Do the "leaves out" lines include the strongest known omission, not just
      the comfortable ones?
- [ ] Do chips match what's actually playable?
- [ ] Were the cards updated in the same commit as any dynamics change?
- [ ] Re-run a cold read after major rewrites (the panel is cheap; the
      register's bar is explicit).
