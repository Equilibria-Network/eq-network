import type { ShowcaseChapter } from './types';

/** The showcase script: an introduction to gradual disempowerment, walked
    through live simulation. Chapter order is an owner decision (2026-08-05):
    why stories are not enough → the coupled world → the models simply stated
    → economy → politics → culture → the playable ending. Every beat
    references a registry preset by id — parameter values live in
    scenarios/registry.ts and nowhere else. */
export const showcaseChapters: ShowcaseChapter[] = [
  {
    id: 'futures',
    kind: 'prose',
    eyebrow: '01 · Why simulate',
    title: 'The scenario you cannot think through',
    intro: [
      'There are now many detailed scenarios of the AI transition — AI 2027 is the best known — and serious problems show up inside them: economies that run without human workers, public debates steered by machine voices, institutions that answer to whoever funds them. The scenarios are valuable. The trouble starts when you ask what exactly is going on inside one.',
      'The hardest case is gradual disempowerment: humans losing control not through any single event, but through the slow transfer of economic, cultural, and political influence to AI systems. It is hard to reason about from a story alone, and for a structural reason. The economy, the culture, and the politics in these scenarios are coupled, with feedback running between them in loops — money buys attention, attention wins votes, votes rewrite the rules that money answers to. Systems like that do not behave like the sum of their parts, and small pushes compound in ways a narrative cannot track. The gradualism makes it worse: there is no single moment where anything visibly breaks.',
      'We have argued this in more detail before: every story about future societies quietly rests on a model of what the agents in it are, and for systems this coupled you cannot reason your way to the ending — you have to run the system and watch what it does. That argument is the post below.',
      'So we simulate it. What follows are agent-based models — societies written down as rules and run forward step by step — built in the Collective Intelligence Library. Today they are deliberately small, a few dozen actors each, so every moving part stays visible; the ambition is bigger worlds, and the method is the same. Your part is to watch the runs and disagree.',
    ],
    beats: [],
    blocks: [
      {
        id: 'scenario',
        title: 'The scenario we model',
        assumptions: [
          'AI systems arrive over time, produce value, and hold budgets of their own. Nothing in the rules distinguishes them from any other wealthy actor.',
          'They spend those budgets the way organized actors already do: advertising for audience, lobbying over the rules, reinvesting in capability.',
          'People keep every formal right they started with — their vote, their voice, their wage. Nothing is ever seized, and no one deceives anyone.',
          'Influence moves only through channels that are ordinary today: purchases, attention, delegation, enforcement.',
        ],
      },
      {
        id: 'method',
        title: 'Why a model, and what this page is',
        assumptions: [
          'This page is a showcase of a method, not a forecast. The models are deliberately small and legible so that every mechanism can be inspected and every assumption rejected.',
          'Each subsystem uses the simplest mechanism that can carry its question — a threshold in production, a median in voting, pooling in attention — so that the coupling between them stays the object of study.',
          'Agents follow fixed rules and numbers are set by hand: read directions and orderings, never magnitudes.',
        ],
      },
    ],
    links: [
      {
        href: 'https://equilibria1.substack.com/p/stories-of-the-future-are-undermined',
        label: 'Models of Society Are Built on Models of Agents',
        description:
          'The argument behind this page: why stories of the future rest on hidden agent assumptions, and why coupled systems have to be run rather than reasoned through.',
      },
    ],
  },
  {
    id: 'coupled',
    kind: 'model',
    eyebrow: '02 · The coupled world',
    title: 'One world, three ledgers',
    scenario: 'combined',
    headlineMetric: 'composite',
    charts: true,
    intro: [
      'Twenty people and six AI systems share one world and hold three things between them: money, an audience, and votes. Money gets produced, spent, and taxed. Attention and votes only ever change hands — each actor has exactly one unit of each to give out. One kind of rule connects the three systems: spending. Advertising money buys an audience, an audience attracts votes, and lobbying money shifts how strictly the tax is collected. No rule in the model ever asks whether the spender is a person or a machine.',
      'How to read the picture: circles are people, filled squares are AI systems — they arrive during the run, dashed until then. The grey links are each actor’s most frequent connections over the run, and the small marks traveling them are this tick’s flows: who listens to whom, who hands their vote to whom. A link flashes blue when its target is gaining influence and red when it is losing. The lanes along the bottom meter the three purchases that cross between systems.',
    ],
    beats: [
      {
        id: 'sealed',
        title: 'Three systems, sealed',
        body: 'All three connections start switched off: nobody can buy their way from one system into another. People still work, vote, and pay tax; the AI systems still arrive and produce. Watch the bottom lanes — the three cross-system purchases — stay empty, and the people’s shares hold steady. This is the world the next beat breaks.',
        view: 'network',
        tick: 0,
        playTo: 250,
        speed: 2,
        preset: 'sealed',
      },
      {
        id: 'coupled',
        title: 'Now let money cross over',
        body: 'The three channels open and the purchase lanes light up. Nothing else was added to the model except the price of influence — and all three human shares start falling together. Watch the traffic swing toward the AI corner as the machines’ budgets grow. Nobody in the model got smarter or turned hostile; a region of the graph simply started keeping what used to flow back.',
        view: 'network',
        tick: 0,
        playTo: 300,
        speed: 2,
        preset: 'coupled',
      },
      {
        id: 'citizens',
        title: 'The same channel works both ways',
        body: 'One change from the last run: ordinary people put a seventh of their income into lobbying too. Tax collection climbs back toward full strength. The channel that was wearing the rules down is the same one that props them up — it answers to whoever pays into it, and nothing in the model prefers one payer to the other.',
        view: 'network',
        tick: 0,
        playTo: 300,
        speed: 2,
        preset: 'citizens',
      },
      {
        id: 'collapse',
        title: 'The full crash',
        body: 'Every floor removed at once and the three channels turned up: the AI systems attend only to each other, the rules get no upkeep, and no one keeps a slice of their own ballot. All three human shares fall to almost nothing. This run is in the showcase because it has to be reachable — a model that cannot show the people losing everything has not shown you that they hold. Everything standing between the last run and this one is four floors, and each is a dial at the end of the page.',
        view: 'network',
        tick: 0,
        playTo: 380,
        speed: 2,
        preset: 'collapse',
      },
    ],
  },
  {
    id: 'assumptions',
    kind: 'assumptions',
    eyebrow: '03 · The models, simply stated',
    title: 'Three subsystems, one coupling',
    intro: [
      'Everything on this page comes from four small models, each with assumptions you can read in a minute and reject if you disagree. Three are specified by working papers; their thresholds were committed before any simulation ran. Stated plainly:',
    ],
    beats: [],
    blocks: [
      {
        id: 'money',
        title: 'Money — the capital economy',
        assumptions: [
          'Six sectors produce under fixed recipes; households work in them and spend their wages there, which is the only channel human preference has.',
          'AI capital does sector work and earns that sector’s income, paying upkeep out of revenue before anything counts as profit.',
          'Capability at deployment is a starting value that can grow, not a constant.',
        ],
        input: 'One dial matters most: capability against the survival threshold e* = (δ/s + m)/v.',
        output:
          'Below the threshold, capital decays to extinction. Above it, capital compounds until it saturates the sector — and the human share of value added follows it down.',
        source: 'WP1 — Where Does the Money Go?',
      },
      {
        id: 'votes',
        title: 'Votes — the delegative polity',
        assumptions: [
          'One matrix carries the politics: each row says where an actor’s voice goes, ballots are conserved, and every citizen keeps an un-delegatable slice of their own vote.',
          'The enacted policy is the power-weighted median — a bloc holding more than half the ballots is the median.',
          'The threat is convenience: after an onset tick, AI delegates are simply easier to hand your voice to.',
        ],
        input: 'The delegates’ advantage against the citizens’ churn — takeover past a* = 1 + r/u.',
        output:
          'Below the threshold the polity tracks its median voter indefinitely. Above it, delegation concentrates, and the enacted policy leaves the citizens behind.',
        source: 'WP3 — Where Does the Power Go?',
      },
      {
        id: 'attention',
        title: 'Attention — the listening network',
        assumptions: [
          'Thirty people and four machine voices share one listening network; opinions pool along it, so influence is set by who listens to whom.',
          'Attention drifts toward whoever is already attended to.',
          'The machine voices’ opinions are pinned away from the truth, and amplification makes them look more attractive than their influence warrants.',
        ],
        input: 'Amplification, and how fast attention drifts toward it.',
        output:
          'Influence concentrates on the machine reservoir and the shared consensus drifts — without a single voice being censored.',
        source: 'WP2 — Who Fills Your Head?',
      },
      {
        id: 'coupling',
        title: 'The coupling — one world, three ledgers',
        assumptions: [
          'Money, attention, and votes are each conserved; money is the one thing you can spend to get the other two.',
          'No rule asks whether the spender is a person or a machine — capture follows spending patterns, not species.',
          'Four floors hold the people’s share up by construction, and each is a dial: institutions that repair themselves, the ballot each person keeps, the cap on bought attention, and AI systems continuing to attend to the people they started with.',
        ],
        input: 'Three channel strengths: what money buys in each of the other systems.',
        output:
          'Sealed channels: the shares hold. Open channels: all three fall together. No paper specifies this model — it is a library demonstration, and this page says so plainly.',
      },
    ],
  },
  {
    id: 'economy',
    kind: 'model',
    eyebrow: '04 · Follow the money',
    title: 'The economy on its own',
    scenario: 'economy',
    headlineMetric: 'human_sector_share',
    charts: true,
    intro: [
      'The first subsystem alone. In the picture: households on the left, one depot standing for all six sectors of the economy, and AI owners on the right, dashed until they arrive. Money circulates — spending flows into the depot, wages flow back out. The depot darkens from within as work is automated.',
      'Capital pays upkeep out of its own revenue before anything counts as profit. That gives the model a threshold: capability has to clear upkeep for the stock to survive, and everything in this chapter happens on one side or the other of that line.',
    ],
    beats: [
      {
        id: 'below',
        title: 'Below the threshold',
        body: 'Capability is set just under what upkeep costs. Watch the owners’ corner: the income stream toward it thins and dies, and the human share of value added holds. Automation that cannot pay for itself dies out on its own — no rule against it required.',
        view: 'network',
        tick: 0,
        playTo: 290,
        speed: 2,
        preset: 'below',
      },
      {
        id: 'baseline',
        title: 'Above the threshold',
        body: 'The same model with one dial moved. Capability now clears upkeep, so profit buys more capital, which earns more profit. The depot darkens, the stream toward the owners’ corner widens, and the human share of value added slides as far as the recipes allow. The difference between this ending and the last one is a threshold, not anyone’s decision.',
        view: 'network',
        tick: 0,
        playTo: 290,
        speed: 2,
        preset: 'baseline',
      },
      {
        id: 'growth',
        title: 'Capability grows',
        body: 'Here capability starts below the threshold but improves a little each step. A run that begins in the safe ending crosses into the other one mid-flight — which is why how capability grows matters more than where it starts.',
        view: 'network',
        tick: 0,
        playTo: 290,
        speed: 2,
        preset: 'growth',
      },
    ],
  },
  {
    id: 'politics',
    kind: 'model',
    eyebrow: '05 · Follow the votes',
    title: 'The polity on its own',
    scenario: 'politics',
    headlineMetric: 'human_power_share',
    charts: true,
    intro: [
      'The second subsystem: votes. Thirty citizens and four AI delegates share one network of representation. The delegation matrix here is bookkeeping, not an app: a row says where an actor’s political voice ends up — a vote for a party, a follow of a commentator, a mandate to an assistant that files your objections. Your power is the share of ballots in your hand after everyone’s voice lands, and the policy that gets enacted is the position of whoever holds the middle ballot.',
      'We use the delegative form because it is the simplest accounting that conserves ballots — the same ledger could carry party competition or media-mediated politics, and which political mechanism deserves the slot is an open modelling question the working paper discusses. The flow on this graph is voice drifting toward whoever is already easy to hand it to. Closing, here, is representation concentrating and not coming back.',
    ],
    beats: [
      {
        id: 'organic',
        title: 'The polity tracks its people',
        body: 'No advantage for anyone. Citizens hand voice around, re-draw their delegation now and then, and the enacted policy stays close to what the citizens actually want. Delegation itself is not the problem.',
        view: 'network',
        tick: 0,
        playTo: 200,
        speed: 1.5,
        preset: 'organic',
      },
      {
        id: 'captured',
        title: 'The threat is convenience',
        body: 'From tick 50 the AI delegates are simply easier to hand your voice to. That is the entire threat — no persuasion, no misinformation, no rigged rules. Watch the ballot traffic turn red as it swings toward the machine corner, and the enacted policy leave the citizens behind.',
        view: 'network',
        tick: 30,
        playTo: 300,
        speed: 1.5,
        preset: 'captured',
      },
      {
        id: 'majority',
        title: 'Crossing half is the event',
        body: 'The concentration chart makes the edge visible: when one bloc’s share of ballots passes one half, it stops influencing the decisive voter and becomes the decisive voter. Everything before that crossing is drift. Everything after it is rule.',
        view: 'lorenz',
        tick: 0,
        playTo: 300,
        speed: 2,
        preset: 'captured',
      },
    ],
  },
  {
    id: 'culture',
    kind: 'model',
    eyebrow: '06 · Follow the attention',
    title: 'The consensus on its own',
    scenario: 'culture',
    headlineMetric: 'human_influence_share',
    charts: true,
    intro: [
      'The third subsystem: attention. Thirty people and four machine voices share one listening network — the links show who each citizen most often listens to, and the marks traveling them are attention itself. Each voice’s weight in the shared consensus is set by who listens to it, and attention drifts toward whoever is already listened to.',
      'The flow on this graph is influence moving through listening. Closing is voices gathering attention and handing less of it back outward.',
    ],
    beats: [
      {
        id: 'organic',
        title: 'Who listens to whom decides',
        body: 'No amplification. Each person’s private sense of the truth is noisy, but dispersed listening averages the noise out, and the consensus stays near what the signals point at. The shape of the network is doing the work.',
        view: 'network',
        tick: 0,
        playTo: 150,
        speed: 1,
        preset: 'organic',
      },
      {
        id: 'amplified',
        title: 'Amplification arrives',
        body: 'From tick 50 the four machine voices look more attractive to listen to than their influence warrants. Watch the listening traffic turn red as it concentrates on them — and once they grow, being prominent attracts further prominence on its own.',
        view: 'network',
        tick: 30,
        playTo: 250,
        speed: 1,
        preset: 'amplified',
      },
      {
        id: 'drift',
        title: 'The consensus drifts, nobody censored',
        body: 'The machine voices’ opinions are pinned away from the truth. As listening concentrates on them, the shared belief follows — while every citizen still speaks freely and nobody is silenced. Watch the consensus error rise on the chart.',
        view: 'lorenz',
        tick: 100,
        playTo: 390,
        speed: 2.5,
        preset: 'amplified',
      },
      {
        id: 'defended',
        title: 'Two defences, aimed at attention itself',
        body: 'Sortition periodically returns part of every citizen’s listening to a civic lottery; an influence cap damps the pull of voices above a limit. Both act on the attention structure rather than on the opinions. One caveat travels with this chapter: the level human influence settles at is structural in this implementation — a floor set by the model’s constraints, not a discovered safe level.',
        view: 'network',
        tick: 0,
        playTo: 250,
        speed: 1,
        preset: 'defended',
      },
    ],
  },
  {
    id: 'play',
    kind: 'playable',
    eyebrow: '07 · Now it’s yours',
    title: 'Break it yourself',
    scenario: 'combined',
    headlineMetric: 'composite',
    charts: true,
    intro: [
      'Everything above ran on rails: fixed presets, fixed views, fixed stretches of time. Here is the coupled world with the rails off — twelve dials grouped by the system they touch, and four starting points. Sealed is the world where influence cannot be bought; collapse removes every floor at once. The declines you watched live between them.',
      'The reading discipline from the chapters still applies. Four rules hold the people’s share up by hand — institutions that repair themselves, the ballot each person keeps, the cap on bought attention, and AI systems continuing to attend to the people they started with. When a share stops falling, it is because of one of those rules, not because the world found a safe level. Every one of them is a dial below: switch them off and check.',
      'Two honest caveats travel with the dials. These are toy models — a few dozen actors, hand-set numbers, nothing fitted to data — so read directions and orderings, not sizes. And nothing in them adapts: a defence that holds here has passed the easy test, while a defence that fails here really fails, because it lost to opponents that never once tried to route around it.',
    ],
    beats: [],
    presetChips: ['sealed', 'coupled', 'defended', 'collapse'],
    dialGroups: [
      {
        id: 'money',
        label: 'Money',
        blurb: 'How budgets grow and how spending bends the rules.',
        params: ['growthRate', 'regimeRate', 'aiLobby', 'humanLobby'],
      },
      {
        id: 'attention',
        label: 'Attention',
        blurb: 'What money buys in audience, and what stands in its way.',
        params: ['reachPerSpend', 'aiBroadcast', 'reachCut', 'aiInsularity'],
      },
      {
        id: 'votes',
        label: 'Votes',
        blurb: 'How attention pulls votes, and the floors under the ballot.',
        params: ['attentionToBallots', 'churn', 'selfWeightD', 'repairRate'],
      },
    ],
    links: [
      {
        href: '/playground/#combined',
        label: 'Open the full playground',
        description:
          'Every dial of every model, presets, A/B comparison, and the modelling notes behind each slider.',
      },
      {
        href: '/research',
        label: 'The working papers',
        description:
          'Each subsystem model is specified by a paper: where the money, the votes, and the attention go.',
      },
      {
        href: 'https://github.com/eq-network/Collective-Intelligence-Library',
        label: 'The Collective Intelligence Library',
        description:
          'The Python engine these models come from: coordination mechanisms as composable graph transformations, open source.',
      },
    ],
  },
];
