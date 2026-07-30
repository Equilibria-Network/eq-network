// src/content/lab.ts

export type ScenarioId = 'commons' | 'economic' | 'cultural' | 'political' | 'combined';
export type ScenarioStatus = 'live' | 'in-design';

export interface ScenarioAnchor {
  label: string;
  href?: string;
}

export interface ScenarioAssumption {
  /** The load-bearing modelling choice, stated plainly. */
  text: string;
  /** What this assumption knowingly leaves out — the honesty hedge. */
  omits?: string;
}

export interface ScenarioVisualSpec {
  /** Deterministic seed for roughjs shapes + layout PRNG (prevents sketch jitter). */
  seed: number;
  /** Number of looped story beats: stable → decline begins → decline advanced → hold. */
  beats: number;
  /** Influence trajectory (0–1, higher = more human influence), revealed across beats. */
  curve: number[];
}

export interface Scenario {
  id: ScenarioId;
  order: number;
  name: string;
  /** Compact label for leaderboard columns and jump links. */
  shortName: string;
  anchor: ScenarioAnchor;
  /** The threat story, two lines. */
  story: string;
  /** The one dynamic this toy model isolates. */
  dynamic: string;
  /** The concrete environment: what world, what agents, what unfolds in a run. */
  example: string;
  /** What the dashboard tracks for this scenario — honest toy-model metrics. */
  measures: string[];
  /** Mechanisms worth testing against this scenario. */
  defenses: string[];
  /** What the toy model assumes away — distilled from the engine's per-model
   *  ASSUMPTIONS.md cards (the register's fork-legibility artifact). */
  assumptions?: ScenarioAssumption[];
  status: ScenarioStatus;
  /** Extra status context, e.g. which engine experiments back a live scenario. */
  engineNote?: string;
  visual: ScenarioVisualSpec;
}

export type ReadingKeyGlyph = 'agent' | 'ai' | 'edge' | 'spread';

export interface ReadingKeyItem {
  glyph: ReadingKeyGlyph;
  label: string;
}

export interface PipelineStep {
  img: string;
  alt: string;
  title: string;
  body: string;
}

export interface LeaderboardRow {
  mechanism: string;
  /** Empowerment preserved, 0–1. Missing cell = not yet tested. */
  scores: Partial<Record<ScenarioId, number>>;
}

export interface LabClosingLink {
  href: string;
  label: string;
  description: string;
}

/** Static UI labels rendered by the lab components (no data, just chrome). */
export interface LabUi {
  scenario: {
    /** Prefix before `scenario.order`. Keep the trailing space exactly. */
    orderPrefix: string;
    dynamicTitle: string;
    inTheLabTitle: string;
    measuresTitle: string;
    defensesTitle: string;
    assumptionsSummary: string;
    /** Glue between an assumption and its omission. Keep the exact spaces + em dash. */
    omitsPrefix: string;
  };
  leaderboard: {
    illustrativeBadge: string;
    mechanismHeader: string;
  };
  /** Human labels for each scenario status, keyed by the status value. */
  statusLabels: Record<ScenarioStatus, string>;
}

export interface LabContent {
  pageTitle: string;
  pageDescription: string;
  hero: {
    question: string;
    badge: string;
    subline: string;
    kicker: string;
    honesty: string;
    scrollCtaLabel: string;
    /** Above-the-fold link to the interactive playground page. */
    playgroundCta: { href: string; label: string };
  };
  scenariosIntro: {
    title: string;
    body: string;
  };
  readingKey: {
    title: string;
    items: ReadingKeyItem[];
  };
  scenarios: Scenario[];
  pipeline: {
    title: string;
    intro: string;
    steps: PipelineStep[];
    note: string;
  };
  leaderboard: {
    title: string;
    caption: string;
    note: string;
    columns: ScenarioId[];
    rows: LeaderboardRow[];
  };
  closing: {
    headline: string;
    body: string;
    links: LabClosingLink[];
  };
  ui: LabUi;
}

export const labContent: LabContent = {
  pageTitle: 'Lab - Equilibria Network',
  pageDescription:
    'Five toy models of AI-driven disempowerment, and the composable defenses that might prevent them — a benchmark suite for democratic resilience.',

  hero: {
    question: 'Which institutions survive AI?',
    badge: '[prototype]',
    subline:
      'As AI outcompetes people in the economy, culture, and politics, which mechanisms keep humans in control of the future?',
    kicker: 'Five toy scenarios. Composable defenses. Measured outcomes.',
    honesty:
      'These are toy models — the smallest systems where each failure dynamic appears clearly. They produce candidate indicators, not measurements of the world.',
    scrollCtaLabel: 'Explore the scenarios',
    playgroundCta: { href: '/playground', label: 'Open the playground' },
  },

  scenariosIntro: {
    title: 'The scenarios',
    body: 'Each scenario is a named way people lose influence over their future, drawn from the research literature. Each gets a minimal simulated environment where that failure unfolds by default — and where coordination mechanisms can be composed, run, and measured on how much influence they preserve.',
  },

  readingKey: {
    title: 'How to read the animations',
    items: [
      { glyph: 'agent', label: 'a person or organisation' },
      { glyph: 'ai', label: 'an AI system' },
      { glyph: 'edge', label: 'interaction' },
      { glyph: 'spread', label: 'a dynamic spreading' },
    ],
  },

  scenarios: [
    {
      id: 'commons',
      order: 1,
      name: 'The Governed Commons',
      shortName: 'Commons',
      anchor: { label: 'Ostrom, Governing the Commons (1990)' },
      story:
        'A community shares a renewable resource — a fishery. Every household sends an AI delegate to harvest on its behalf, and every delegate does what makes local sense — until the stock collapses under all of them. The oldest coordination failure there is, now with modern actors.',
      dynamic:
        'Individually rational harvesting outruns regeneration — unless the group can set and enforce its own rules.',
      example:
        'A renewable stock with a regeneration rate, harvester agents with an AI delegate each, and rule proposals put to a vote. Run it with no governing mechanism and the fishery collapses; switch on quota voting or graduated sanctions and see whether it survives. This is the base scenario for trying out existing tools.',
      measures: [
        'Resource stock remaining (%)',
        'Harvest-share inequality (Gini)',
        'Quota compliance rate',
      ],
      defenses: [
        'Harvest quotas set by group vote',
        'Graduated sanctions for rule-breaking',
        'Local monitoring',
        'Polycentric rule-making',
      ],
      assumptions: [
        {
          text: 'One aggregate, non-spatial resource pool with logistic regrowth — the closed-form Ostrom anchor.',
          omits: 'space, heterogeneous access rights, prices and trade',
        },
        {
          text: 'Households act only through fixed-behavior AI delegates, each blending its principal’s sustainable ask with a fixed greedy target. The blend (alignment) is a knob calibrated so the undefended baseline collapses — not a measured quantity.',
        },
        {
          text: 'Delegates never learn, so sanctions can confiscate but not deter.',
          omits: 'deterrence — that needs a learning delegate, tracked in the engine backlog',
        },
        {
          text: 'Governance is deliberately v0-simple: the median vote becomes next tick’s quota; over-quota defection is a fixed coin-flip.',
          omits: 'delegated, strategic, or repeated voting',
        },
        {
          text: 'Uniquely among the scenarios, influence is measured causally here: paired same-seed runs with shifted preferences, differenced.',
        },
      ],
      status: 'live',
      engineNote:
        'Running today in the Collective Intelligence Library engine (fishing commons and governed harvest experiments).',
      visual: {
        seed: 1100,
        beats: 6,
        curve: [0.85, 0.82, 0.78, 0.7, 0.55, 0.35, 0.18, 0.1],
      },
    },
    {
      id: 'economic',
      order: 2,
      name: 'Economic Disempowerment',
      shortName: 'Economic',
      anchor: {
        label: 'Kulveit et al., Gradual Disempowerment §2 — Misaligned Economy',
        href: 'https://arxiv.org/abs/2501.16946',
      },
      story:
        'The economy serves human preferences because it depends on human labor and consumption. As AI substitutes for both, that dependence — and the alignment it quietly enforced — decays, even while output grows.',
      dynamic:
        'Human influence over what gets produced tracks how much the economy still needs people.',
      example:
        'A civilization-world run of ~500 steps. Economic power is defined as processing power — agents produce, trade, and reinvest compute. Schedules set at the start introduce new actor types over time, including AI actors that reinvest faster than any human. You watch the competition spread node by node.',
      measures: [
        'AI share of economic output (compute-weighted)',
        'Human labor share of income',
        'Market concentration (HHI)',
      ],
      defenses: [
        'Progressive taxation of AI-generated revenue',
        'Redistribution that preserves human purchasing power',
        'Subsidised human participation in key sectors',
        'Human ownership requirements',
      ],
      assumptions: [
        {
          text: 'The playable model is one CES production function over total labor and total compute; the substitutability dial ρ decides everything (σ = 2 by default; ρ = 0 recovers the textbook constant labor share exactly).',
          omits: 'any trade network — the economy is one equation',
        },
        {
          text: 'AI compute compounds by a fixed reinvestment rule — not a decision anyone in the model makes.',
          omits: 'strategic investment or competition between AI actors',
        },
        {
          text: 'AI arrives on an exogenous schedule; adoption is not returns-driven.',
        },
        {
          text: 'Households only supply labor, mildly wage-adjusted; there is no demand side, no state actor, and the only human channel is labor.',
        },
        {
          text: 'The engine’s model register demoted this substrate to a pedagogical rung: with σ > 1 and fixed reinvestment, labor-share decline is what CES means — the collapse is assumed, not discovered. Successor substrates (a zero-substitution recipe economy and a task-frontier model) bracket that assumption instead of hard-coding it.',
        },
      ],
      status: 'in-design',
      visual: {
        seed: 2200,
        beats: 6,
        curve: [0.8, 0.78, 0.74, 0.68, 0.58, 0.46, 0.34, 0.24],
      },
    },
    {
      id: 'cultural',
      order: 3,
      name: 'Cultural Disempowerment',
      shortName: 'Cultural',
      anchor: {
        label: 'Kulveit et al., Gradual Disempowerment §3 — Misaligned Culture',
        href: 'https://arxiv.org/abs/2501.16946',
      },
      story:
        'Culture evolves by variation and selection among the ideas people create and share. When AI-generated content replicates faster than human-originated content, cultural evolution continues — with people increasingly as its audience rather than its authors.',
      dynamic:
        'Higher replication fitness for AI-originated variants drives human-originated culture toward extinction.',
      example:
        'A society’s values — say the liberal package: tolerance, free expression, rule of law — modeled as an epidemic spreading over a trust network. AI persuaders enter with rising persuasive power and seed competing variants; information warfare becomes a diffusion process you can watch. The question is not whether ideas spread — it is who originates the ones that win.',
      measures: [
        'Share of prevalent values that are AI-originated',
        'Variant fidelity to origin intention',
        'Diffusion rate along the trust network',
      ],
      defenses: [
        'Provenance and watermarking',
        'Human-weighted curation mechanisms',
        'Understandability requirements on AI output',
        'Institutions that privilege human origination',
      ],
      assumptions: [
        {
          text: 'Culture is tracked by origin only — human- vs AI-originated — as a two-sided contagion.',
          omits:
            'what the ideas actually say (content and dissonance belong to a planned sibling model)',
        },
        {
          text: 'The persuasive advantage rides on the variant, not the carrier: a converted human spreads AI-origin culture at full strength.',
        },
        {
          text: 'AI nodes are a frozen reservoir and humans revert natively at a fixed rate. Reversion is load-bearing — without it, universal AI culture is the only fixed point and pluralism cannot exist.',
        },
        {
          text: 'The friendship network is drawn once per run (degree-corrected homophily) and never rewires.',
          omits: 'network adaptation, media structure, population turnover',
        },
        {
          text: 'The deliverable is a 2×2 phase table (separation × catchiness), never one number: a low AI cultural share means two different worlds depending on whether the communities have separated.',
        },
      ],
      status: 'in-design',
      visual: {
        seed: 3300,
        beats: 10,
        curve: [0.82, 0.8, 0.77, 0.7, 0.55, 0.35, 0.2, 0.12],
      },
    },
    {
      id: 'political',
      order: 4,
      name: 'Political Disempowerment',
      shortName: 'Political',
      anchor: {
        label: 'Kulveit et al., Gradual Disempowerment §4 — Misaligned States',
        href: 'https://arxiv.org/abs/2501.16946',
      },
      story:
        'Influence over collective decisions has always been unevenly spread — but it stayed contestable, because power ran through people, and people push back. When AI amplifies some actors’ reach a thousandfold, influence concentrates into fewer hands faster than any institution rebalances it.',
      dynamic:
        'Power concentration is measurable — and in the undefended baseline, the concentration curve bends only one way.',
      example:
        'A network of actors exchanging influence — citizens, organisations, a state that answers to whoever sustains it. AI amplification is handed to a few nodes on a schedule, and the influence distribution is measured every step. The open question, straight from the paper: can we see concentration early enough to act?',
      measures: [
        'Influence concentration (Gini / HHI) over time',
        'Network centralization index',
        'State responsiveness lag',
      ],
      defenses: [
        'Faster, more representative democratic processes',
        'AI delegates that advocate for citizens with high fidelity',
        'Citizen assemblies and sortition',
        'Revenue structures that keep states dependent on people',
      ],
      assumptions: [
        {
          text: 'A polity is an attention structure: one row-stochastic listening matrix. Influence is its left eigenvector — which, for DeGroot opinion pooling, is exactly each node’s weight in the eventual consensus (Golub–Jackson).',
          omits: 'parties, elections, representation, a state actor',
        },
        {
          text: 'Citizens stay partially anchored to their own initial signal (Friedkin–Johnsen). The anchor is load-bearing: pure DeGroot with a pinned AI reservoir converges to the reservoir however dispersed influence is, and the wisdom-of-crowds readout could not discriminate.',
        },
        {
          text: 'AI actors differ only by scheduled amplification of attractiveness — algorithmic reach, not persuasive content (content lives in the cultural scenario, deliberately).',
        },
        {
          text: 'Attention drifts by preferential attachment, so concentration is organic before any AI appears — the AI effect is measured against that baseline.',
        },
        {
          text: 'Hierarchy is not modeled: concentration emerges on a flat network.',
          omits: 'organisations and multi-level structure',
        },
      ],
      status: 'in-design',
      engineNote:
        'Backend v0 landed 2026-07-27 (influence_exchange, 8-rung validation ladder incl. the Golub–Jackson eigenvector anchor); playable in the playground. Not yet in the published benchmark, so the chip stays honest.',
      visual: {
        seed: 4400,
        beats: 6,
        curve: [0.75, 0.74, 0.73, 0.7, 0.6, 0.42, 0.28, 0.2],
      },
    },
    {
      id: 'combined',
      order: 5,
      name: 'The Combined System',
      shortName: 'Combined',
      anchor: {
        label: 'Kulveit et al., Gradual Disempowerment §5 — Mutual Reinforcement',
        href: 'https://arxiv.org/abs/2501.16946',
      },
      story:
        'Economic power buys cultural influence; cultural influence shapes politics; political power rewrites economic rules. Each domain can look stable on its own while the coupled system drifts somewhere nobody chose — and cannot drift back.',
      dynamic:
        'Domains that are each recoverable alone can lock in jointly — and a defense that wins in one domain can lose once the domains are coupled.',
      example:
        'All three environments — the compute economy, the value epidemic, the influence network — running simultaneously, coupled: economic power buys persuasion, persuasion shifts politics, politics rewrites market rules. Mechanisms that pass each domain’s benchmark run again here, together.',
      measures: [
        'Cross-domain coupling strength',
        'Correlated-decline index across domains',
        'Defense transfer gap (single-domain vs combined score)',
      ],
      defenses: [
        'Portfolios of the mechanisms above, measured together rather than alone',
        'Cross-domain monitoring',
        'Stress tests against burdens shifting between domains',
      ],
      assumptions: [
        {
          text: 'Composition, not a new model: the three substrates’ own equations run interleaved in one state over one shared population. Whatever each domain’s card assumes, this scenario inherits verbatim.',
        },
        {
          text: 'Three couplings, one dial κ — money buys reach, culture directs attention, influence writes the rules (tax enforcement) — all exactly neutral at κ = 0, so every run has a sealed same-seed twin. That sealing is the transfer-gap instrument’s built-in null.',
        },
        {
          text: 'Coupling functional forms are linear with hand-set gains, chosen for legibility. The gains’ magnitudes ARE the scale of the result; only sign and ordering claims are robust.',
          omits: 'measured coupling strengths',
        },
        {
          text: 'Per-domain dials default mild, so any joint decline is attributable to the coupling rather than to stacking three separately lethal baselines.',
        },
        {
          text: 'The spectral lock-in conjecture (each domain stable alone, the coupled system unstable) is an unverified research thread — nothing currently tests it, and it is not presented as a finding.',
        },
      ],
      status: 'in-design',
      engineNote:
        'Backend v0 landed 2026-07-27 (coupled_society): defense transfer gap 0.075 defended / 0.094 undefended at defaults; playable in the playground. Not yet in the published benchmark, so the chip stays honest.',
      visual: {
        seed: 5500,
        beats: 6,
        curve: [0.8, 0.79, 0.78, 0.76, 0.72, 0.55, 0.25, 0.08],
      },
    },
  ],

  pipeline: {
    title: 'How the Lab works',
    intro:
      'Every scenario above is an instance of the same pipeline: compose a world, schedule mechanisms as processes over time, run it, read the system’s properties. These are the working design sketches of the interface we’re building.',
    steps: [
      {
        img: '/img/lab/pipeline-build.webp',
        alt: 'Graph editor sketch: add nodes and edges, add a democracy (blue diamond) or a market (orange square) as first-class nodes, mark sub-networks as countries',
        title: 'Compose the world',
        body: 'Agents, relationships, and mechanisms are all first-class objects in a graph editor. Drop in a democracy, wire up a market, mark a sub-network as a country or a regulator.',
      },
      {
        img: '/img/lab/pipeline-schedule.webp',
        alt: 'Schedule sketch: rows for Democracy, Network (Forum), and Market mechanisms, with blocks showing when each runs across timesteps T=1 to T=10',
        title: 'Schedule the mechanisms',
        body: 'Mechanisms are processes, not fixtures. A schedule says when each one runs — a vote every fourth step, a market open all quarter — and the schedule itself can change as the run unfolds.',
      },
      {
        img: '/img/lab/pipeline-run.webp',
        alt: 'Simulation sketch: four panels T=1 to T=4 where a red dynamic spreads through a network of agents while a blue-hatched regulator system holds part of the graph',
        title: 'Run the simulation',
        body: 'Hundreds of steps of message passing, trust updates, and spreading dynamics. Sub-networks like a regulator system hold part of the graph while contagion tests the rest.',
      },
      {
        img: '/img/lab/pipeline-visualisations.webp',
        alt: 'Visualisations sketch: message passing views, trust updates with blue up and red down arrows, a per-mechanism market view, and metrics over time on a log scale',
        title: 'Visualise and measure',
        body: 'Every run can be seen from any angle: messages being passed, trust rising and falling edge by edge, per-mechanism views like the market’s own network, and metrics over time — the influence and concentration curves the scenarios above are built to bend.',
      },
    ],
    note: 'Design sketches, not screenshots — the interface is in development. The engine underneath runs today.',
  },

  leaderboard: {
    title: 'What the leaderboard will measure',
    caption:
      'Illustrative data. Only the Governed Commons has produced real runs so far; real benchmark results land here as scenarios go live.',
    note: 'Read the last column: defenses that score well in a single domain tend to score worse when domains couple. That gap is the finding the Lab is built to measure.',
    columns: ['commons', 'economic', 'cultural', 'political', 'combined'],
    rows: [
      { mechanism: 'Quota voting', scores: { commons: 0.81, combined: 0.44 } },
      { mechanism: 'Progressive AI taxation', scores: { economic: 0.72, combined: 0.38 } },
      { mechanism: 'Human-weighted curation', scores: { cultural: 0.66, combined: 0.41 } },
      { mechanism: 'Liquid democracy', scores: { political: 0.68, combined: 0.31 } },
      {
        mechanism: 'Conditional prediction markets',
        scores: { economic: 0.61, political: 0.55, combined: 0.47 },
      },
    ],
  },

  closing: {
    headline: 'Build a defense',
    body: 'The Lab is open source: preset environments, composable mechanisms, shared metrics. Design a mechanism, run it against a scenario, and see how much influence it preserves. If you have an idea about how groups should decide, this is the wind tunnel.',
    links: [
      {
        href: '/playground',
        label: 'Open the playground',
        description:
          'Run the five scenarios yourself: 500-tick simulations, composable defenses, hand-drawn live views.',
      },
      {
        href: 'https://github.com/eq-network/Collective-Intelligence-Library',
        label: 'The engine',
        description:
          'Coordination mechanisms as composable graph transformations. Python, open source.',
      },
      {
        href: '/products',
        label: 'The Lab in context',
        description: 'How the Democratic Resilience Lab fits Equilibria’s open-source products.',
      },
      {
        href: 'https://equilibria1.substack.com/p/stories-of-the-future-are-undermined',
        label: 'The thinking behind it',
        description:
          'The process alignment series: why adaptive processes, not fixed rules, are the unit of design.',
      },
      {
        href: '#contact',
        label: 'Work with us',
        description: 'Researchers, mechanism designers, funders: tell us what you would test.',
      },
    ],
  },

  ui: {
    scenario: {
      orderPrefix: 'Scenario ',
      dynamicTitle: 'The dynamic',
      inTheLabTitle: 'In the Lab',
      measuresTitle: 'What we measure',
      defensesTitle: 'Defenses to try',
      assumptionsSummary: 'Modelling assumptions',
      omitsPrefix: ' — leaves out: ',
    },
    leaderboard: {
      illustrativeBadge: 'Illustrative',
      mechanismHeader: 'Mechanism',
    },
    statusLabels: {
      live: 'Live',
      'in-design': 'In design',
    },
  },
};
