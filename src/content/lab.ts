// src/content/lab.ts

export type ScenarioId = 'commons' | 'economic' | 'cultural' | 'political' | 'combined';
export type ScenarioStatus = 'live' | 'in-design';

export interface ScenarioAnchor {
  label: string;
  href?: string;
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

export interface LabContent {
  pageTitle: string;
  pageDescription: string;
  hero: {
    question: string;
    subline: string;
    kicker: string;
    honesty: string;
    scrollCtaLabel: string;
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
}

export const labContent: LabContent = {
  pageTitle: 'Lab - Equilibria Network',
  pageDescription:
    'Five toy models of AI-driven disempowerment, and the composable defenses that might prevent them — a benchmark suite for democratic resilience.',

  hero: {
    question: 'Which institutions survive AI?',
    subline:
      'As AI outcompetes people in the economy, culture, and politics, which mechanisms keep humans in control of the future?',
    kicker: 'Five toy scenarios. Composable defenses. Measured outcomes.',
    honesty:
      'These are toy models — the smallest systems where each failure dynamic appears clearly. They produce candidate indicators, not measurements of the world.',
    scrollCtaLabel: 'Explore the scenarios',
  },

  scenariosIntro: {
    title: 'The scenarios',
    body:
      'Each scenario is a named way people lose influence over their future, drawn from the research literature. Each gets a minimal simulated environment where that failure unfolds by default — and where coordination mechanisms can be composed, run, and measured on how much influence they preserve.',
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
      status: 'in-design',
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
      status: 'in-design',
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
        img: '/img/lab/pipeline-build.png',
        alt: 'Graph editor sketch: add nodes and edges, add a democracy (blue diamond) or a market (orange square) as first-class nodes, mark sub-networks as countries',
        title: 'Compose the world',
        body: 'Agents, relationships, and mechanisms are all first-class objects in a graph editor. Drop in a democracy, wire up a market, mark a sub-network as a country or a regulator.',
      },
      {
        img: '/img/lab/pipeline-schedule.png',
        alt: 'Schedule sketch: rows for Democracy, Network (Forum), and Market mechanisms, with blocks showing when each runs across timesteps T=1 to T=10',
        title: 'Schedule the mechanisms',
        body: 'Mechanisms are processes, not fixtures. A schedule says when each one runs — a vote every fourth step, a market open all quarter — and the schedule itself can change as the run unfolds.',
      },
      {
        img: '/img/lab/pipeline-run.png',
        alt: 'Simulation sketch: four panels T=1 to T=4 where a red dynamic spreads through a network of agents while a blue-hatched regulator system holds part of the graph',
        title: 'Run the simulation',
        body: 'Hundreds of steps of message passing, trust updates, and spreading dynamics. Sub-networks like a regulator system hold part of the graph while contagion tests the rest.',
      },
      {
        img: '/img/lab/pipeline-visualisations.png',
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
    note:
      'Read the last column: defenses that score well in a single domain tend to score worse when domains couple. That gap is the finding the Lab is built to measure.',
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
    body:
      'The Lab is open source: preset environments, composable mechanisms, shared metrics. Design a mechanism, run it against a scenario, and see how much influence it preserves. If you have an idea about how groups should decide, this is the wind tunnel.',
    links: [
      {
        href: 'https://github.com/eq-network/Collective-Intelligence-Library',
        label: 'The engine',
        description:
          'Coordination mechanisms as composable graph transformations. Python, open source.',
      },
      {
        href: '/products',
        label: 'The Lab in context',
        description:
          'How the Democratic Resilience Lab fits Equilibria’s open-source products.',
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
        description:
          'Researchers, mechanism designers, funders: tell us what you would test.',
      },
    ],
  },
};
