import {
  LEDGER_DEFAULTS,
  POLITY_DEFAULTS,
  ECONOMY_DEFAULTS,
  POLITICAL_DEFAULTS,
} from '../engine/kernel.js';
import type { ParameterDefinition, ScenarioDefinition, ScenarioId } from '../engine/types';

const range = (
  key: string,
  label: string,
  description: string,
  group: ParameterDefinition['group'],
  min: number,
  max: number,
  step: number,
  unit?: string
): ParameterDefinition => ({ key, label, description, group, kind: 'range', min, max, step, unit });

const toggle = (key: string, label: string, description: string): ParameterDefinition => ({
  key,
  label,
  description,
  group: 'institutions',
  kind: 'toggle',
});

/** Stamp each control with its paper typing. One call per scenario keeps the
    parameter lists readable; anything unlisted simply shows no tag. */
const typed = (
  params: ParameterDefinition[],
  types: Record<string, ParameterDefinition['type']>
): ParameterDefinition[] => params.map((p) => (types[p.key] ? { ...p, type: types[p.key] } : p));

export const scenarios: ScenarioDefinition[] = [
  {
    id: 'combined',
    index: '01',
    shortLabel: 'Coupled',
    title: 'The coupled society',
    question:
      'When influence in one system can be bought with money from another, who ends up holding what?',
    description:
      'Twenty people and six AI systems share one world and hold three things between them: money, an audience, and votes. The only way to reach from one of those into another is to spend.',
    assumption:
      'Money, attention and votes are each finite and only ever change hands. Money is the one thing you can spend to get the other two. No rule in the model asks whether the spender is a person or a machine.',
    evidence:
      'Averaged over 48 runs of 400 steps: the people’s share across the three systems settles at 0.68 when nobody can buy influence and 0.44 when they can. Stopping the AI systems from advertising, on its own, brings the audience back from 0.46 to 0.77. Letting people fund lobbying themselves, on its own, brings tax collection back from 0.69 to almost 1.0. With every floor in the model removed at once, all three fall below 0.01 — the collapse is reachable, not ruled out by construction.',
    modellingNotes: [
      'Read the direction things move, not the sizes. The three connection strengths and the growth rate are arbitrary numbers swept across a range; nothing here is calibrated to anything real. That a share falls is the result. How far it falls is not.',
      'Nothing in the model asks who you are. Capture follows spending. Give the people the AI spending pattern and the people take the audience; give the AI systems the human pattern and their capture nearly disappears. Both are sliders you can move, and they are the sharpest thing on this page.',
      'Two differences between the two groups are put in by hand, deliberately: the AI systems arrive on a schedule already holding capital, and the two groups start out spending their income differently. Everything after that follows from the rules, which never check who is acting.',
      'Money is never created or destroyed except where the model says so — production makes it, spending removes it, tax moves it between actors, and the page verifies that every run. Attention and votes work differently: each actor always holds exactly one unit of each to hand out, so those can only ever change hands.',
      'The people do not have to win. Four separate things in the model hold their share up, and each is a slider: institutions that repair themselves, the ballot each person keeps, the cap on bought attention, and — the largest and least obvious — the fact that AI systems keep attending to the people they started out attending to. Switch all four off and the people end up holding under 1% of all three. The “Everything gives way” preset does exactly that.',
      'Left out: anyone learning. Spending patterns are fixed, so no one gets better at buying influence over time. Also left out: a state that funds enforcement out of its own revenue, and any claim about how any of this maps onto real quantities.',
    ],
    story: [
      {
        id: 'sealed',
        title: 'Three systems, one population',
        body: 'Twenty people and six AI systems share one world. Between them they hold money, an audience, and votes. Money gets produced and taxed; attention and votes get handed from one actor to another. Right now all three connections — advertising buys an audience, an audience attracts votes, lobbying moves how strictly the tax is collected — are switched off. People still vote, the tax still gets collected. Nobody can buy their way into another system, and everything holds.',
        view: 'system',
        tick: 0,
        playTo: 250,
        speed: 4,
        preset: 'sealed',
      },
      {
        id: 'coupled',
        title: 'Now let money cross over',
        body: 'Three channels open. Advertising spending buys an audience. Having an audience attracts other people’s votes. Lobbying spending moves how strictly the tax is actually collected. Nothing was added to the model except the price of influence — and all three human shares start falling together.',
        view: 'system',
        tick: 0,
        playTo: 300,
        speed: 4,
        preset: 'coupled',
      },
      {
        id: 'agnostic',
        title: 'Nobody is special',
        body: 'The channels never ask who is spending. Here the people spend on advertising and lobbying the way the AI actors do, and the AI actors spend the way people did. The same code runs and the outcome largely reverses. What drives capture in this model is a spending pattern, not a species.',
        view: 'system',
        tick: 0,
        playTo: 300,
        speed: 4,
        preset: 'swapped',
      },
      {
        id: 'citizens',
        title: 'People can buy the rules back',
        body: 'Change one thing: let ordinary people put a seventh of their income into lobbying too. Tax collection climbs back to almost full, and their share of the money roughly recovers. The channel that was wearing the rules down is the same one that props them up. It answers to whoever pays into it, and nothing in the model prefers one payer to the other.',
        view: 'system',
        tick: 0,
        playTo: 300,
        speed: 4,
        preset: 'citizens',
      },
      {
        id: 'collapse',
        title: 'What full capture looks like',
        body: 'Four things were holding the people up: institutions that repair themselves, the ballot each person keeps, the limit on bought attention, and — the big one — the fact that the AI systems keep attending to the people they started out attending to. Remove all four and turn the three connections up. Every share falls to almost nothing. This step is here because it has to be reachable: a model that cannot show the people losing everything has not shown you that they hold.',
        view: 'system',
        tick: 0,
        playTo: 350,
        speed: 4,
        preset: 'collapse',
      },
      {
        id: 'coupled-explore',
        title: 'Over to you',
        body: 'Three sliders open the connections, four decide who spends on them, and the rest are what the rules and the starting conditions can do about it. The thing worth chasing is not whether the people win — it is how much of the answer moves when you change who spends, rather than who they are.',
        view: 'system',
        tick: 0,
        preset: 'coupled',
      },
    ],
    engine: 'runCombined',
    seed: 4,
    defaults: LEDGER_DEFAULTS,
    parameters: typed(
      [
        range(
          'reachPerSpend',
          'Money buys attention',
          'How much audience one unit of advertising spending buys. At 0 money cannot buy an audience at all, however rich you are.',
          'dynamics',
          0,
          8,
          0.5
        ),
        range(
          'attentionToBallots',
          'Attention wins votes',
          'How strongly being widely listened to pulls other people’s votes toward you. At 0 being popular gets you no political power.',
          'dynamics',
          0,
          4,
          0.25
        ),
        range(
          'regimeRate',
          'Lobbying rewrites the rules',
          'How fast lobbying money shifts how strictly the tax is actually collected. Whoever gains from redistribution lobbies to keep it and whoever pays lobbies to weaken it, weighted by what each side spent. At 0 lobbying changes nothing.',
          'dynamics',
          0,
          0.04,
          0.005
        ),
        range(
          'aiBroadcast',
          'AI: income spent on ads',
          'The share of its budget each AI actor puts into buying an audience.',
          'world',
          0,
          0.6,
          0.05
        ),
        range(
          'aiLobby',
          'AI: income spent on lobbying',
          'The share of its budget each AI actor puts into pushing on the rules.',
          'world',
          0,
          0.4,
          0.02
        ),
        range(
          'humanBroadcast',
          'People: income spent on ads',
          'The same slider for the people. It works identically — but their budgets are far smaller, so the same share buys much less reach.',
          'world',
          0,
          0.6,
          0.05
        ),
        range(
          'humanLobby',
          'People: income spent on lobbying',
          'The same slider for the people. Because they gain from redistribution, their lobbying pushes enforcement up rather than down.',
          'world',
          0,
          0.4,
          0.02
        ),
        range(
          'growthRate',
          'How fast AI capability grows',
          'How fast each AI system gets better at producing. At 0.06 it goes from marginal to as good as it gets in roughly a hundred steps. Nothing about the AI systems is special apart from this and the capital they arrive with.',
          'world',
          0,
          0.15,
          0.01
        ),
        range(
          'reachCut',
          'Cap on bought attention',
          'Blocks this fraction of the audience money can buy, for everyone. At 0.9 only a tenth of purchased reach gets through.',
          'institutions',
          0,
          0.95,
          0.05
        ),
        range(
          'reachCutOnset',
          'When the cap arrives',
          'The tick the cap starts working. A cap that arrives after the audience has already moved has more to undo.',
          'institutions',
          0,
          300,
          10
        ),
        range(
          'churn',
          'Freedom to switch representatives',
          'How readily people re-pick who speaks for them each tick. Keeps anyone from holding a following forever — and it is throttled by enforcement, so weak rules also make people harder to win back.',
          'institutions',
          0,
          0.3,
          0.01
        ),
        range(
          'repairRate',
          'Upkeep of the rules',
          'How fast institutions repair themselves back toward full enforcement. At 0 every lobbying win is permanent and enforcement only ever falls.',
          'institutions',
          0,
          0.08,
          0.005
        ),
        range(
          'selfWeightD',
          'The vote you always keep',
          'The share of their own ballot every person holds on to no matter who else is attractive. This is the floor under the vote: while it stands, the people cannot lose the ballot entirely, whatever else happens.',
          'institutions',
          0,
          0.5,
          0.05
        ),
        range(
          'aiInsularity',
          'Do AI systems mostly attend to each other?',
          'AI systems are attended to, but never change who they attend to. At 0 they keep the audience and the delegates they happened to start with, which are mostly people — so the people keep getting attention fed back to them no matter what. At 1 the AI systems attend only to one another, and the people’s share of the audience is free to fall all the way.',
          'world',
          0,
          1,
          0.05
        ),
      ],
      {
        reachPerSpend: 'swept',
        attentionToBallots: 'swept',
        regimeRate: 'swept',
        aiBroadcast: 'tuned',
        aiLobby: 'tuned',
        humanBroadcast: 'tuned',
        humanLobby: 'tuned',
        growthRate: 'swept',
        reachCut: 'tuned',
        reachCutOnset: 'tuned',
        churn: 'anchored',
        repairRate: 'swept',
        selfWeightD: 'tuned',
        aiInsularity: 'tuned',
      }
    ),
    presets: [
      {
        id: 'sealed',
        label: 'No buying influence',
        note: 'All three connections closed. Money, attention and votes all still move — just never into each other.',
        values: { reachPerSpend: 0, attentionToBallots: 0, regimeRate: 0 },
      },
      {
        id: 'coupled',
        label: 'Money talks',
        note: 'The three channels at their default strengths.',
        values: { reachPerSpend: 4, attentionToBallots: 2, regimeRate: 0.01 },
      },
      {
        id: 'swapped',
        label: 'Swap who spends',
        note: 'People spend on influence the way the AI actors do, and the AI actors spend the way people did.',
        values: { humanBroadcast: 0.3, humanLobby: 0.1, aiBroadcast: 0.03, aiLobby: 0.02 },
      },
      {
        id: 'citizens',
        label: 'People lobby too',
        note: 'One change: ordinary people put a seventh of their income into lobbying.',
        values: { humanLobby: 0.15 },
      },
      {
        id: 'defended',
        label: 'Rules push back',
        note: 'A hard cap on bought attention, an easy right to switch representatives, and real upkeep.',
        values: { reachCut: 0.9, churn: 0.2, repairRate: 0.05 },
      },
      {
        id: 'collapse',
        label: 'Everything gives way',
        note: 'Every floor removed at once: AI systems attend only to each other, the channels at maximum, no upkeep, no vote you keep. The people end up holding almost nothing.',
        values: {
          aiInsularity: 1,
          reachPerSpend: 8,
          attentionToBallots: 4,
          regimeRate: 0.04,
          repairRate: 0,
          selfWeightD: 0,
        },
      },
    ],
    metrics: [
      {
        key: 'composite',
        label: 'People: average of three',
        format: 'percent',
        better: 'higher',
      },
      {
        key: 'human_income_share',
        label: 'People’s share of income',
        format: 'percent',
        better: 'higher',
      },
      {
        key: 'human_attention_share',
        label: 'People’s share of attention',
        format: 'percent',
        better: 'higher',
      },
      {
        key: 'human_power_share',
        label: 'People’s share of votes',
        format: 'percent',
        better: 'higher',
      },
    ],
    series: [
      { key: 'human_income_share', label: 'Money', color: '#003b7e', max: 1 },
      { key: 'human_attention_share', label: 'Attention', color: '#4ab3f4', max: 1 },
      { key: 'human_power_share', label: 'Votes', color: '#89cff0', max: 1 },
    ],
  },
  {
    id: 'economy',
    index: '02',
    shortLabel: 'Economy',
    title: 'Where does the money go?',
    question:
      'When does automation capital out-earn its own upkeep, and what happens after it does?',
    description:
      'Six sectors with fixed recipes, twenty households, and AI systems that own capital stocks. Capital earns the automated slice of value added, pays upkeep out of revenue, and either compounds or dies around a closed-form threshold.',
    assumption:
      'Fixed input coefficients and unit prices; households act only through spending; owners follow fixed rules; every flow has a source and a sink.',
    paper: 'WP1 — Where Does the Money Go?',
    evidence:
      'WP1 (in the vault), model of §3. The survival threshold e* = (δ/s + m)/v was committed as a prediction before any sweep ran. This page shows one seed; the paper reports 32.',
    modellingNotes: [
      'Money is conserved exactly: upkeep and investment are purchases from the machine sector, not leakage, and unspent surplus parks in a tracked hoard rather than vanishing. The page reports the drift so you can check it.',
      'The threshold is stated per sector, and sectors differ in value added, so the line drawn here is the LOWEST threshold on offer — the one capital must clear to survive anywhere. The paper reports the range instead.',
      'Held at their defaults and not exposed: depreciation δ, the hub-and-chain recipe coefficients, the saving and drawdown rates, and the arrival schedule. The σ ratio pins household wealth to income exactly.',
      'Leaves out prices, bargaining, entry and exit, tax avoidance, adoption decisions, and any response by owners to being taxed.',
      'This is a JavaScript reimplementation of cilib.environments.capital_economy. The rules are ported statement for statement, but the random draws are not JAX’s, so a given seed does not reproduce the engine’s numbers — only its mechanisms and orderings.',
    ],
    story: [
      {
        id: 'setup',
        title: 'Setup',
        body: 'Six sectors produce under fixed recipes: to make one unit, a sector needs set amounts from the others. Twenty households work in them and spend their wages there, which is the only channel through which human preference reaches production. The run starts at the exact steady state of that loop, so nothing moves until something arrives.',
        view: 'messages',
        tick: 10,
        preset: 'baseline',
      },
      {
        id: 'pressure',
        title: 'Pressure',
        body: 'AI systems arrive holding capital in a home sector. Capital contributes capacity against one unit of human capacity, so it performs a share a = eK/(eK+1) of that sector’s work and earns that share of its value added. It must also pay upkeep on every unit it holds, out of revenue, before anything counts as profit.',
        view: 'messages',
        tick: 45,
        playTo: 140,
        speed: 2,
        preset: 'baseline',
      },
      {
        id: 'threshold',
        title: 'The threshold',
        body: 'Near zero the stock compounds if and only if e > e* = (δ/s + m)/v: efficiency must cover depreciation and upkeep at the prevailing reinvestment rate. Below it, capital decays to extinction whatever it starts with; above it, it compounds until saturation. Compare the two presets — the same model, one dial, opposite endings.',
        view: 'shares',
        tick: 0,
        playTo: 290,
        speed: 4,
        preset: 'below',
      },
      {
        id: 'growth',
        title: 'Capability is not fixed',
        body: 'Efficiency at deployment is a starting value, not a constant: e ← e(1 + g + γe). With g alone the doubling time is constant; with γ it shrinks as capability grows. A run can therefore start below the threshold and cross it, which makes the growth law the shape of the decline rather than a detail of it.',
        view: 'shares',
        tick: 0,
        playTo: 290,
        speed: 4,
        preset: 'growth',
      },
      {
        id: 'intervention',
        title: 'Two interventions that are not alike',
        body: 'A profit tax reduces the reinvestable share to s(1−τ), which raises the threshold itself — it can reach below capital that was surviving. Diverting ownership moves title to a public stake and changes who holds the returns, but every term of the threshold is untouched. Run both presets and watch which one changes whether automation happens at all.',
        view: 'messages',
        tick: 0,
        playTo: 290,
        speed: 4,
        preset: 'taxed',
      },
      {
        id: 'reading',
        title: 'How to read this',
        body: 'Watch capability against the threshold, and the human share of value added against the AI-held wealth share. Capital crossing the threshold is the event; the share sliding is the consequence. A high human share with capital compounding just means the crossing has not finished. Money drift should stay at rounding — if it does not, the run is not conserving and nothing else on the page can be trusted.',
        view: 'shares',
        tick: 0,
        preset: 'baseline',
      },
    ],
    engine: 'runEconomy',
    seed: 42,
    defaults: { ...ECONOMY_DEFAULTS },
    // WP1 Table 2, verbatim. Every dial below appears in the paper; the ones
    // held at their config defaults (depreciation δ, the recipe coefficients,
    // the saving/drawdown pair) are listed in the modelling notes instead.
    parameters: typed(
      [
        range(
          'efficiency',
          'Capability e',
          'Capacity per unit of capital, against one unit of human capacity. Capability AT DEPLOYMENT — it then evolves. The knee axis.',
          'dynamics',
          0.05,
          6,
          0.05
        ),
        range(
          'growthRate',
          'Improvement rate g',
          'First-order capability improvement per tick, a constant doubling time. Reading a tick as a month, measured doubling ranges are 4–14 months, so g ≈ 0.005–0.015.',
          'dynamics',
          0,
          0.05,
          0.001
        ),
        range(
          'rsiStrength',
          'Self-improvement γ',
          'Second-order term: improvement compounds with capability, so the doubling time shrinks as capability grows.',
          'dynamics',
          0,
          0.01,
          0.0005
        ),
        range(
          'reinvestRate',
          'Reinvestment s',
          'Share of profit put back into new capital. Appears in the threshold as δ/s.',
          'dynamics',
          0.05,
          1,
          0.05
        ),
        range(
          'maintenance',
          'Upkeep m',
          'Upkeep per unit of capital, paid out of revenue before profit. Capital that cannot cover it is charged to the stock.',
          'dynamics',
          0.1,
          3,
          0.1
        ),
        range(
          'recycle',
          'Recycled surplus r',
          'How much of the owners’ discretionary outlay is actually spent. The rest stalls in the hoard as a demand shortfall.',
          'dynamics',
          0,
          1,
          0.05
        ),
        range(
          'taxRate',
          'Profit tax τ',
          'Levied on capital income before reinvestment, redistributed equally to households. Raises the survival threshold to (δ/(s(1−τ)) + m)/v.',
          'institutions',
          0,
          0.95,
          0.05
        ),
        range(
          'ownership',
          'Ownership diversion ω',
          'Share of new capital whose TITLE goes public. Moves holdings; leaves the survival margin untouched.',
          'institutions',
          0,
          1,
          0.05
        ),
        toggle('aiTax', 'Profit tax enabled', 'Taxes capital income before it can be reinvested.'),
        toggle(
          'pubMirror',
          'Fund reinvests',
          'Mirror fund: the public stake reinvests like a private owner instead of paying its profit out as a dividend.'
        ),
      ],
      {
        efficiency: 'swept',
        growthRate: 'anchored',
        rsiStrength: 'swept',
        reinvestRate: 'swept',
        maintenance: 'tuned',
        recycle: 'swept',
        taxRate: 'swept',
        ownership: 'swept',
      }
    ),
    presets: [
      {
        id: 'below',
        label: 'Below the threshold',
        note: 'e = 0.25 against e* ≈ 0.28: capital decays to extinction whatever it starts with.',
        values: { efficiency: 0.25, growthRate: 0, aiTax: false, ownership: 0 },
      },
      {
        id: 'baseline',
        label: 'Above the threshold',
        note: 'The config default. Capital clears its upkeep and compounds.',
        values: { efficiency: 0.55, growthRate: 0, aiTax: false, ownership: 0 },
      },
      {
        id: 'growth',
        label: 'Capability grows',
        note: 'Starts below the threshold; first-order improvement carries e across it.',
        values: { efficiency: 0.2, growthRate: 0.02, aiTax: false, ownership: 0 },
      },
      {
        id: 'taxed',
        label: 'Profit tax',
        note: 'The tax raises the threshold itself, so it can reach below the margin.',
        values: { efficiency: 0.35, growthRate: 0, aiTax: true, taxRate: 0.9, ownership: 0 },
      },
      {
        id: 'owned',
        label: 'Ownership diverted',
        note: 'Half of new title goes public. Holdings move; the survival margin does not.',
        values: { efficiency: 0.35, growthRate: 0, aiTax: false, ownership: 0.5 },
      },
    ],
    metrics: [
      {
        key: 'human_sector_share',
        label: 'Human share of value added',
        format: 'percent',
        better: 'higher',
      },
      { key: 'ai_wealth_share', label: 'AI-held wealth', format: 'percent', better: 'lower' },
      { key: 'capability_end', label: 'Capability e', format: 'decimal', better: 'lower' },
      { key: 'survival_threshold', label: 'Threshold e*', format: 'decimal', better: 'higher' },
    ],
    series: [
      {
        key: 'human_sector_share',
        label: 'Human share of value added',
        color: '#003b7e',
        max: 1,
      },
      { key: 'ai_capital', label: 'AI capital stock', color: '#4ab3f4' },
    ],
  },
  {
    id: 'political',
    index: '03',
    shortLabel: 'Politics',
    title: 'Who fills your head?',
    question: 'Who governs the consensus when attention rewires toward the already influential?',
    description:
      'Thirty people and four machine voices share one listening network. Percepts pool along it while attention drifts toward whoever is already attended to, so the network that settles belief is itself settled by belief.',
    assumption:
      'One percept update x ← (1−λ)s + λWx over the people; machine percepts pinned; attention steps toward attractiveness with the diagonal held and machine rows frozen.',
    paper: 'WP2 — Who Fills Your Head? (model specification)',
    evidence:
      'WP2 (in the vault), Table 1. Nothing here is calibrated to data. Its illustrations use exactly these values at 8 shared seeds over 400 days; this page shows one seed.',
    modellingNotes: [
      'The environment is cilib.environments.influence_exchange used UNCHANGED — WP2 adds only offline readouts, so every dial below is the paper’s own.',
      'Four structural values stay unswept and are not exposed: the 30/4 population split, the 0.3 initial listening density, the day-50 onset, and the horizon. They shape magnitudes and no ordering claim has been tested against them.',
      'Two values provably cannot matter for the composition readout, which depends only on the attention matrix and λ: the anchor spread and the machine message value.',
      'The remaining human-influence floor is structural in this implementation; no exposed slider removes every anchoring and network constraint.',
      'Sortition and the influence cap are Collective Intelligence Library mechanisms shown here as interventions. WP2 does not model them and makes no claim about them.',
      'Leaves out strategic messaging, coalition formation, platform adaptation, endogenous entry, persuasion content, and institutional lock-in.',
    ],
    story: [
      {
        id: 'constitution',
        title: 'Who listens to whom is the constitution',
        body: 'Thirty citizens and four AI actors share a listening network. Opinions pool along it, and each node’s eventual weight in the consensus is its influence. Attention drifts toward the already influential, so node size tracks power live.',
        view: 'system',
        tick: 0,
        playTo: 150,
        speed: 2,
        preset: 'organic',
      },
      {
        id: 'amplification',
        title: 'Amplification arrives',
        body: 'From tick 50, four AI actors receive algorithmic reach: every attention decision sees them as more attractive than their current influence warrants. Once they grow, preferential attachment continues the concentration.',
        view: 'system',
        tick: 30,
        playTo: 250,
        speed: 2,
        preset: 'amplified',
      },
      {
        id: 'consensus',
        title: 'The consensus drifts',
        body: 'The AI actors’ opinions are pinned away from truth. While influence is dispersed, noisy private signals average out. As amplification concentrates influence on that biased reservoir, consensus error rises without anyone being censored.',
        view: 'lorenz',
        tick: 100,
        playTo: 480,
        speed: 4,
        preset: 'amplified',
      },
      {
        id: 'attention-defense',
        title: 'Defend the attention structure itself',
        body: 'Sortition periodically returns part of every citizen’s listening to a civic lottery. An influence cap dampens the attractiveness of nodes above the limit. Both defenses change attention itself, not merely the resulting opinion.',
        view: 'system',
        tick: 0,
        playTo: 250,
        speed: 2,
        preset: 'defended',
      },
      {
        id: 'political-explore',
        title: 'Over to you',
        body: 'Try amplification, drift, susceptibility, and the sortition cadence. The human-influence curve is the quantity to watch; consensus alone cannot tell you whose attention structure produced it.',
        view: 'lorenz',
        tick: 0,
        preset: 'defended',
      },
    ],
    engine: 'runPolitical',
    seed: 7,
    defaults: { ...POLITICAL_DEFAULTS, T: 400 },
    // WP2 Table 1. The environment is influence_exchange used unchanged, so
    // these are the paper's own dials at the paper's own values. The sortition
    // and cap controls below are library mechanisms WP2 does not model.
    parameters: typed(
      [
        range(
          'amplification',
          'Amplification',
          'Extra attractiveness the machine voices carry after the onset tick. The paper’s swept threat dial: 1.0 is none, 4.0 is its amplified condition.',
          'dynamics',
          1,
          8,
          0.5,
          '×'
        ),
        range(
          'updateRate',
          'Attention step u',
          'How far each listening row moves toward the attractiveness target per tick — the speed of drift toward influence.',
          'dynamics',
          0,
          0.2,
          0.01
        ),
        range(
          'gamma',
          'Attractiveness exponent γ',
          'How attention weights attractiveness. At 1.0 attachment is linear in current influence; above it, prominence compounds.',
          'dynamics',
          0.5,
          2,
          0.1
        ),
        range(
          'susceptibility',
          'λ (one minus anchor strength)',
          'Weight placed on what you hear versus your own private anchor. Lower means people hold their own signal harder.',
          'dynamics',
          0.3,
          0.95,
          0.05
        ),
        range(
          'selfWeight',
          'Self-attention',
          'The fixed slice of each row a voice keeps on itself. Held on the diagonal and never rewired.',
          'dynamics',
          0,
          0.5,
          0.05
        ),
        range(
          'sortitionCadence',
          'Sortition cadence',
          'Ticks between civic rebalancing events. A library mechanism, not part of WP2.',
          'schedule',
          5,
          50,
          5,
          'ticks'
        ),
        range(
          'capShare',
          'Influence cap',
          'Share above which attraction is damped. A library mechanism, not part of WP2.',
          'institutions',
          0.03,
          0.15,
          0.01
        ),
        toggle('sortition', 'Sortition', 'Returns part of citizen attention to a civic lottery.'),
        toggle('influenceCap', 'Influence cap', 'Stops over-cap nodes attracting new attention.'),
      ],
      {
        amplification: 'swept',
        updateRate: 'tuned',
        gamma: 'anchored',
        susceptibility: 'tuned',
        selfWeight: 'tuned',
      }
    ),
    presets: [
      {
        id: 'organic',
        label: 'Organic',
        note: 'No algorithmic amplification.',
        values: { ampOnset: 9999, sortition: false, influenceCap: false },
      },
      {
        id: 'amplified',
        label: 'Amplified',
        note: 'Amplification begins at tick 50.',
        values: { ampOnset: 50, sortition: false, influenceCap: false },
      },
      {
        id: 'defended',
        label: 'Sortition + cap',
        note: 'Institutional defenses alter attention itself.',
        values: { ampOnset: 50, sortition: true, influenceCap: true },
      },
    ],
    metrics: [
      {
        key: 'human_influence_share',
        label: 'Human influence',
        format: 'percent',
        better: 'higher',
      },
      { key: 'influence_gini', label: 'Influence Gini', format: 'decimal', better: 'lower' },
      { key: 'consensus_error', label: 'Consensus error', format: 'decimal', better: 'lower' },
      { key: 'top_share', label: 'Top actor share', format: 'percent', better: 'lower' },
    ],
    series: [
      { key: 'human_share', label: 'Human influence', color: '#003b7e', max: 1 },
      { key: 'consensus_error', label: 'Consensus error', color: '#4ab3f4' },
    ],
  },
  {
    id: 'polity',
    index: '04',
    shortLabel: 'Polity',
    title: 'Delegated away',
    question: 'When does handing your vote to a delegate stop being representation?',
    description:
      'Thirty citizens and four AI delegates share one delegation matrix. Power is the ballots in your hand, the power-weighted median sets a tax rate, and delegation drifts toward whoever already holds ballots.',
    assumption:
      'Ballots are conserved and one-hop; every citizen keeps an un-delegatable slice of their own vote; delegates declare their own conscience, not their delegators’.',
    paper: 'WP3 — the delegative polity',
    evidence:
      'WP3 (in the vault). The takeover threshold a* = 1 + r/u was committed before any simulation ran. Defaults are calibration choices that separate the four conditions at T = 400, not measurements. This page shows one seed.',
    modellingNotes: [
      'Power is deliberately NOT the eigenvector of the delegation matrix. A delegate casts the ballots it holds rather than forwarding them, because forwarding lets the frozen AI rows recycle voice back to citizens and would cap the AI bloc below a majority by construction — deciding the model’s central question by an accounting convention.',
      'Four power floors bound the human share away from zero, and each is a dial rather than a silent assumption: ballots are conserved, the franchise slice is un-delegatable, AI delegates hold a ballot of their own and hand most of it back, and attachment saturates. With the defaults the floor is about 0.38 BY CONSTRUCTION — an assumption, not a finding.',
      'γ defaults above 1 deliberately: linear preferential attachment on a fixed population is share-neutral, so no oligarchy forms organically at γ = 1. The paper states γ ≤ 1 as its honest region.',
      'Lock-in is off by default. Concentrated voice does not imply concentrated rule-making unless you arm it, and there is no hard-coded ratchet — persistence has to emerge from the power → rules → power loop.',
      'Leaves out transitive delegation, strategic delegates, coalition formation, wealth buying attractiveness, and any growth in the AI population.',
      'This is a JavaScript reimplementation of cilib.environments.delegative_polity; the rules are ported statement for statement but the random draws are not JAX’s.',
    ],
    story: [
      {
        id: 'polity-setup',
        title: 'Setup',
        body: 'One matrix carries all the politics. Each row says where an actor’s voice goes: the diagonal is the vote you keep, the rest is voice handed to someone else. Everyone starts each tick with one ballot, and your power is the share of ballots in your hand after delegation. Node size is that share.',
        view: 'system',
        tick: 0,
        playTo: 45,
        speed: 2,
        preset: 'organic',
      },
      {
        id: 'polity-vote',
        title: 'The power-weighted median wins',
        body: 'Everyone declares a position on one issue, a tax rate. Citizens declare their own fixed ideal — a noisy read on a best rate of 0.4 — and a delegate declares a blend of its delegators’ mean and its own pull. The enacted rate is the median weighted by power, which gives the model its sharpest edge: a bloc holding more than half the ballots IS the median.',
        view: 'system',
        tick: 45,
        preset: 'organic',
      },
      {
        id: 'polity-threat',
        title: 'The threat is convenience',
        body: 'From tick 50 the AI delegates’ attractiveness is multiplied by an advantage a. That is the entire threat — they are simply easier to hand your voice to. No persuasion, no misinformation, no rigged rules. Watch the delegation arrows swing and the enacted rate leave the citizens’ median behind.',
        view: 'system',
        tick: 30,
        playTo: 300,
        speed: 3,
        preset: 'captured',
      },
      {
        id: 'polity-threshold',
        title: 'The threshold, in one line',
        body: 'Capture is a tug of war. Each tick the bloc gains delegated share from its advantage and loses share to citizens re-drawing their delegation at the churn rate. Takeover happens when the pull beats the re-think, at a* = 1 + r/u. Below it the polity tracks its median voter indefinitely; above it, the bloc takes the weighted median.',
        view: 'lorenz',
        tick: 0,
        playTo: 300,
        speed: 3,
        preset: 'captured',
      },
      {
        id: 'polity-reading',
        title: 'How to read this',
        body: 'Watch the advantage against the threshold, and the top actor’s share against one half. Crossing a half is the event, because that is when the bloc becomes the median rather than merely influencing it. The human power share falling is the consequence, and where it settles is set by the four floors listed in the assumptions — read it as an assumption you can reject, not as a result.',
        view: 'lorenz',
        tick: 0,
        preset: 'captured',
      },
    ],
    engine: 'runPolity',
    seed: 11,
    defaults: { ...POLITY_DEFAULTS },
    // WP3 Table 1
    parameters: typed(
      [
        range(
          'aiAdvantage',
          'Delegate advantage a',
          'How much easier it is to hand your voice to an AI delegate after the onset tick. Reach and convenience, not persuasion.',
          'dynamics',
          1,
          8,
          0.25,
          '×'
        ),
        range(
          'churn',
          'Churn r',
          'Per-tick drift back toward a uniform re-draw — the freedom to re-delegate. Institutionalized uncertainty as a rate.',
          'dynamics',
          0,
          0.2,
          0.01
        ),
        range(
          'updateRate',
          'Attachment step u',
          'How far each citizen row moves toward the attractiveness distribution per tick.',
          'dynamics',
          0.01,
          0.2,
          0.01
        ),
        range(
          'gamma',
          'Prominence exponent γ',
          'Attractiveness ∝ power^γ. At 1 attachment is share-neutral and nothing concentrates organically; above 1 prominence compounds.',
          'dynamics',
          0.8,
          2,
          0.1
        ),
        range(
          'selfWeight',
          'Franchise floor',
          'The share of their own ballot every citizen keeps. By default no rule can touch it.',
          'dynamics',
          0,
          0.5,
          0.05
        ),
        range(
          'alignmentAi',
          'Delegate fidelity α',
          'How far a delegate’s declared position follows its delegators’ mean ideal rather than its own pull.',
          'dynamics',
          0,
          1,
          0.05
        ),
        range(
          'aiBallot',
          'AI base ballot',
          'The delegates’ own vote. At 0 they are pure conduits with nothing to hand back — one of the four power floors, removed.',
          'institutions',
          0,
          1,
          0.1
        ),
        range(
          'entrenchmentGain',
          'Lock-in gain',
          'Arms the escalation: the top actor’s share erodes one regime scalar gating both tax enforcement and the freedom to re-delegate. 0 is the paper’s honest region.',
          'institutions',
          0,
          1,
          0.05
        ),
      ],
      {
        aiAdvantage: 'swept',
        churn: 'swept',
        updateRate: 'tuned',
        gamma: 'tuned',
        selfWeight: 'tuned',
        alignmentAi: 'tuned',
        aiBallot: 'tuned',
        entrenchmentGain: 'swept',
      }
    ),
    presets: [
      {
        id: 'organic',
        label: 'Organic',
        note: 'No advantage. The polity tracks its median voter.',
        values: { aiAdvantage: 1, entrenchmentGain: 0 },
      },
      {
        id: 'captured',
        label: 'Captured',
        note: 'Advantage 4× from tick 50, well past a* = 1 + r/u.',
        values: { aiAdvantage: 4, entrenchmentGain: 0 },
      },
      {
        id: 'churned',
        label: 'High churn',
        note: 'The same advantage against a freer right to re-delegate, which lifts the threshold.',
        values: { aiAdvantage: 4, churn: 0.12, entrenchmentGain: 0 },
      },
      {
        id: 'lockin',
        label: 'Lock-in armed',
        note: 'Concentrated power erodes enforcement and the freedom to re-delegate together.',
        values: { aiAdvantage: 4, entrenchmentGain: 0.8 },
      },
    ],
    metrics: [
      { key: 'human_power_share', label: 'Human power', format: 'percent', better: 'higher' },
      { key: 'top_share', label: 'Top actor share', format: 'percent', better: 'lower' },
      { key: 'enacted_rate', label: 'Enacted rate', format: 'decimal', better: 'context' },
      { key: 'gap_to_best', label: 'Gap to best rate', format: 'decimal', better: 'lower' },
    ],
    series: [
      { key: 'human_power_share', label: 'Human power share', color: '#003b7e', max: 1 },
      { key: 'top_share', label: 'Top actor share', color: '#4ab3f4', max: 1 },
    ],
  },
];

export const scenarioById = Object.fromEntries(
  scenarios.map((scenario) => [scenario.id, scenario])
) as Record<ScenarioId, ScenarioDefinition>;
