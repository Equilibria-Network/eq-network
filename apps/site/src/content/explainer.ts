// src/content/explainer.ts
import type { PageHeaderContent, PageSeo } from './types/page';

export interface ExplainerStep {
  id: number;
  headline: string;
  body: string;
  section: 'problem' | 'solution';
}

export interface ExplainerClosingLink {
  href: string;
  label: string;
  description: string;
}

export interface ExplainerContent {
  seo: PageSeo;
  header: PageHeaderContent;
  steps: ExplainerStep[];
  closing: {
    headline: string;
    body: string;
    links: ExplainerClosingLink[];
  };
  /** Copy used by the explainer's visual components: the per-section labels, the
   *  step-number prefix, the research-field block labels, and the bridge-node label. */
  ui: {
    sectionLabels: Record<ExplainerStep['section'], string>;
    stepPrefix: string;
    fieldLabels: {
      complexSystems: string;
      compSocialScience: string;
      cooperativeAI: string;
      agentFoundations: string;
    };
    fieldSubtitles: {
      complexSystems: string;
      compSocialScience: string;
      cooperativeAI: string;
      agentFoundations: string;
    };
    bridgeLabel: string;
  };
  prototype: {
    figureLabel: string;
    figureTitle: string;
    statusLabel: string;
    nodeCountLabel: string;
    edgeCountLabel: string;
    legend: {
      active: string;
      defecting: string;
      institution: string;
      weakTie: string;
    };
    stageLabels: string[];
    fieldCodes: string[];
    bridgeAnnotation: string;
    closingLabel: string;
    annotations: {
      cooperativeBasin: string;
      localOptimum: string;
      relationalDistance: string;
      institutionalAlignment: string;
      citationGap: string;
      possibleTies: string;
      coordinationProblem: string;
      fieldModels: string[];
    };
    storyLabels: {
      society: {
        human: string;
        aiAgent: string;
        institution: string;
        socialFabric: string;
        flows: string[];
      };
      defection: {
        collectiveWelfare: string;
        localPayoff: string;
        cooperate: string;
        defect: string;
        cascade: string;
      };
      equilibria: {
        landscape: string;
        betterForAll: string;
        stableButWorse: string;
        unilateralMove: string;
      };
      uncertainty: {
        ensemble: string;
        outcomes: string[];
        unknown: string;
      };
      knowledge: {
        sharedQuestion: string;
        lenses: string;
      };
      silos: {
        citationMatrix: string;
        differentVenues: string;
        differentFormalisms: string;
        missingSynthesis: string;
      };
      bridge: {
        translate: string;
        compose: string;
        test: string;
        coherentGovernance: string;
        newConnections: string;
      };
      interaction: {
        selectNode: string;
        selectedNeighborhood: string;
      };
    };
  };
}

export const explainerContent: ExplainerContent = {
  seo: {
    title: 'Cooperation in AI Agent Networks | Equilibria Network',
    description:
      'See how incentives, institutions, and research connections shape cooperation in AI agent networks through a seven-state interactive model.',
    type: 'website',
    keywords: ['AI agent networks', 'collective intelligence', 'cooperative AI', 'AI governance'],
  },
  header: {
    eyebrow: 'Thesis / working model',
    title: 'Cooperation is a property of the network.',
    claim: 'In short: capable agents do not produce cooperation on their own.',
    summary:
      'Cooperation depends on the incentives, institutions, and connections around them. Scroll through one network as it integrates, fragments, and reconnects.',
    prompt: 'Scroll to evolve the model',
  },
  steps: [
    {
      id: 1,
      section: 'problem',
      headline: 'AI agents are integrating into society',
      body: 'Autonomous systems are no longer isolated behind APIs. They trade, negotiate, allocate resources, and make decisions alongside people and institutions. The result is a social fabric — a network of humans, organizations, and AI agents connected through overlapping relationships and dependencies.',
    },
    {
      id: 2,
      section: 'problem',
      headline: 'But short-sightedness and self-interest create defection',
      body: "History is clear: when individual incentives diverge from collective welfare, agents defect. It doesn't require malice — just local optimization. Some connections fray, some commitments break, and the cooperative fabric begins to unravel. This pattern is as old as civilization, and AI accelerates it.",
    },
    {
      id: 3,
      section: 'problem',
      headline: 'This leads to bad equilibria',
      body: 'Once defection takes hold, it spreads. Cooperative clusters emerge — but so do non-cooperative ones. The network fragments into regions that play by different rules, with no mechanism to bridge them. Game theory calls these stable but suboptimal states "bad equilibria" — everyone could do better, but no one can move first.',
    },
    {
      id: 4,
      section: 'problem',
      headline: "That's the problem: agents in society, uncertain cooperation",
      body: "Zoom out and the picture is stark. A world of interconnected agents — human and artificial — with no guarantee that cooperation holds. Some regions cooperate, others don't, and the boundaries are shifting. This is the governance challenge of our generation.",
    },
    {
      id: 5,
      section: 'solution',
      headline: 'Governance of agent networks is a studied problem',
      body: "Multiple research fields already study how to make networks of agents more cooperative. Complex systems science models emergent behavior in large networks. Computational social science studies how institutions and norms shape collective outcomes. Cooperative AI designs mechanisms for agents to find joint strategies. And agent foundations builds the theoretical groundwork — not just for today's AI, but for any future autonomous system. The knowledge exists. It just isn't connected.",
    },
    {
      id: 6,
      section: 'solution',
      headline: 'But these fields are disconnected',
      body: "Cooperative AI, computational social science, agent foundations, complex systems — each field holds part of the answer. But they publish in different venues, use different formalisms, and rarely cite each other. The pieces exist. The picture doesn't.",
    },
    {
      id: 7,
      section: 'solution',
      headline: "We're building the connective tissue",
      body: 'A compositional bridging node — an organization that reads across all four fields and translates between them — can surface connections no single field would find alone. Mechanism design meets network science. Game theory meets organizational behavior. This is what Equilibria is building: the infrastructure for coherent multi-agent governance.',
    },
  ],
  closing: {
    headline: 'This is where we are',
    body: "Equilibria Network is a collective intelligence research organization building the bridges between cooperative AI, computational social science, agent foundations, and complex systems science. We're early, we're small, and we think this work is urgent.",
    links: [
      {
        href: '/roadmap',
        label: 'Research Roadmap',
        description: "Where we're headed and what we're building",
      },
      {
        href: '/products',
        label: 'Products & Publications',
        description: "What we've shipped so far",
      },
      {
        href: '/about',
        label: 'About Us',
        description: 'The team and our philosophy',
      },
    ],
  },
  ui: {
    sectionLabels: {
      problem: 'The Problem',
      solution: 'The Solution',
    },
    stepPrefix: 'Step ',
    fieldLabels: {
      complexSystems: 'Complex Systems',
      compSocialScience: 'Comp. Social Science',
      cooperativeAI: 'Cooperative AI',
      agentFoundations: 'Agent Foundations',
    },
    fieldSubtitles: {
      complexSystems: 'emergent behavior',
      compSocialScience: 'institutions & norms',
      cooperativeAI: 'joint strategies',
      agentFoundations: 'theoretical groundwork',
    },
    bridgeLabel: 'Equilibria',
  },
  prototype: {
    figureLabel: 'Fig. 01 / visual thesis model',
    figureTitle: 'Network state',
    statusLabel: 'State',
    nodeCountLabel: 'Nodes',
    edgeCountLabel: 'Ties',
    legend: {
      active: 'cooperative / active',
      defecting: 'defecting / isolated',
      institution: 'institution',
      weakTie: 'weak or broken tie',
    },
    stageLabels: [
      'Integrated society',
      'Local defection',
      'Fragmented equilibria',
      'Uncertain cooperation',
      'Research landscape',
      'Disconnected fields',
      'Compositional bridge',
    ],
    fieldCodes: ['CAI', 'CSS', 'AF', 'CS'],
    bridgeAnnotation: 'translation layer',
    closingLabel: 'Continue the inquiry',
    annotations: {
      cooperativeBasin: 'E₁ / cooperative basin',
      localOptimum: 'E₂ / local optimum',
      relationalDistance: 'y / relational distance',
      institutionalAlignment: 'x / institutional alignment',
      citationGap: 'translation gap',
      possibleTies: 'possible futures / unobserved ties',
      coordinationProblem: 'shared governance problem',
      fieldModels: ['joint utility', 'norm diffusion', 'agent models', 'network dynamics'],
    },
    storyLabels: {
      society: {
        human: 'human',
        aiAgent: 'AI agent',
        institution: 'institution',
        socialFabric: 'one interdependent social fabric',
        flows: ['resources', 'decisions', 'information'],
      },
      defection: {
        collectiveWelfare: 'collective welfare',
        localPayoff: 'local payoff',
        cooperate: 'cooperate',
        defect: 'defect',
        cascade: 'one local choice changes neighboring incentives',
      },
      equilibria: {
        landscape: 'coordination landscape',
        betterForAll: 'better for all',
        stableButWorse: 'stable but worse',
        unilateralMove: 'no agent can move first',
      },
      uncertainty: {
        ensemble: 'same network / different plausible futures',
        outcomes: [
          'cooperation holds',
          'partial fragmentation',
          'regional defection',
          'systemic unraveling',
        ],
        unknown: 'Which future becomes stable?',
      },
      knowledge: {
        sharedQuestion: 'How do networks of agents cooperate?',
        lenses: 'four mature lenses on one problem',
      },
      silos: {
        citationMatrix: 'cross-field citation density',
        differentVenues: 'different venues',
        differentFormalisms: 'different formalisms',
        missingSynthesis: 'the missing object is synthesis',
      },
      bridge: {
        translate: 'translate',
        compose: 'compose',
        test: 'test',
        coherentGovernance: 'coherent governance',
        newConnections: 'connections no field finds alone',
      },
      interaction: {
        selectNode: 'select a node to inspect its neighborhood',
        selectedNeighborhood: 'neighborhood selected',
      },
    },
  },
};
