# Interface references

## Epoch AI GATE playground

- Reviewed: 2026-07-30
- Source: <https://epoch.ai/gate>
- Relationship: interaction reference, not a model or visual clone

Useful patterns:

- A prominent **Edit parameters** surface lives next to the simulation results.
- Outputs are grouped into conceptual sections rather than presented as an undifferentiated chart wall.
- Model consistency failures are shown in the interface instead of being hidden in developer tooling.
- “About” content covers model structure, interpretation, parameters, and FAQs close to the playground.
- Parameter documentation separates its name, explanation, units, default, and reasoning.
- The interface explicitly describes outputs as conditional forecasts and warns that qualitative dynamics
  are more trustworthy than precise quantitative predictions.

Application here:

- Keep parameters adjacent to the animated system and make presets the primary interaction.
- Keep live results and charts visible with the simulation rather than behind output tabs.
- Nest interpretation guidance beneath each scenario in the chapter rail; reserve the optional right rail
  for granular settings, evidence anchors, and modelling assumptions.
- Keep model scope in Settings so validation and forecast caveats do not interrupt the scenario story.
- Use guided scenario stories and same-seed counterfactuals instead of copying GATE's Simulation A/B
  layout. The five-domain composition is the distinctive product requirement here.
- Treat richer parameter rationale as a follow-up content contract rather than stuffing long explanations
  into tooltips.

The GATE model is an economic integrated-assessment model. This playground uses smaller graph-based toy
models across commons, economic, cultural, political, and coupled domains, so model assumptions and
outputs are not interchangeable.
