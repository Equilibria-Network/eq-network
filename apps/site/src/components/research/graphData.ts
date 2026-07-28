// src/components/research/graphData.ts
// Pure data — no React Flow, no layout engine.

export const HEADERS = ['Foundations', 'Construction', 'Simulation', 'Validation'];

export const PHASE_DESCRIPTIONS = [
  'Formal language, process models, domain mapping, metrics, and experimental methodology',
  'Computational framework, mechanism library, and showcase environments',
  'Adversarial RL testing and LLM social simulation',
  'Digital democracy, DeSci, new markets, and partner implementations',
];

export interface CardDef {
  id: string;
  label: string;
  description: string;
  fullDescription: string;
  papers?: { title: string; pdf?: string; link?: string; status?: string }[];
  col: number;
  type: 'card' | 'apply';
  status: 'active' | 'early' | 'planned' | 'future';
}

export interface ArrowDef {
  source: string;
  target: string;
  label: string;
}

export const CARDS: CardDef[] = [
  // Column 0: Foundations
  { id: 'math-language', col: 0, type: 'card', status: 'active',
    label: 'Mathematical Language for CI',
    description: 'Describing coordination mechanisms as composable graph transforms',
    fullDescription: 'A formal framework for representing markets, networks, and democracies as operations on the same underlying structure — typed graphs with well-defined transformation rules. We seek a unified language where coordination mechanisms can be composed and analysed systematically.',
    papers: [
      { title: 'Spectral Signatures of Gradual Disempowerment', link: 'https://substack.com/home/post/p-187091496', status: 'published' },
      { title: 'A Spectral Model of Collective Active Inference', pdf: '/pdfs/spectral-collective-ai.pdf', status: 'wip' },
      { title: 'Convergent Structures in Collective Intelligence', pdf: '/pdfs/convergent-structures.pdf', status: 'wip' },
      { title: 'Towards a Langlands Program for CI', pdf: '/pdfs/towards-langlands-ci.pdf', status: 'wip' },
      { title: 'Spectral Theory of Memetic Evolution', pdf: '/pdfs/spectral-memetic-evolution.pdf', status: 'wip' },
    ],
  },
  { id: 'process-modelling', col: 0, type: 'card', status: 'active',
    label: 'Process-Based Modelling',
    description: 'Functions and compositions as a programming language of processes',
    fullDescription: 'A shift from object-oriented to function-oriented thinking about collective systems. Instead of asking "what are the agents?" we ask "what are the functions?" Processes compose over time, enabling a compositional view where mechanisms are built from reusable process primitives.',
    papers: [
      { title: 'System Level Safety Evaluations', link: 'https://www.lesswrong.com/posts/AJo2HFT8TdY2B3wNJ/system-level-safety-evaluations', status: 'published' },
      { title: 'A Phylogeny of Agents', link: 'https://www.lesswrong.com/posts/vqfT5QCWa66gsfziB/a-phylogeny-of-agents', status: 'published' },
      { title: 'A Taxonomy of Agents from the Intentional Stance', pdf: '/pdfs/taxonomy-of-agents.pdf', status: 'wip' },
      { title: 'A Natural History of Agency', pdf: '/pdfs/natural-history-agency.pdf', status: 'wip' },
      { title: 'Scalar Properties of Agency', pdf: '/pdfs/scalar-agency.pdf', status: 'wip' },
      { title: 'Active Inference and the Viable Systems Model', pdf: '/pdfs/active-inference-vsm.pdf', status: 'wip' },
    ],
  },
  { id: 'problem-domains', col: 0, type: 'card', status: 'active',
    label: 'Problem & Domain Specification',
    description: 'Mapping economics, political science, and social choice into one formal domain',
    fullDescription: 'Working with domain experts to express economic theory, political science, social choice theory in terms of one underlying mathematical domain. Which coordination problems matter most? How do existing theories translate?',
    papers: [
      { title: 'Open Questions in Collective Agent Foundations', pdf: '/pdfs/open-questions-caf.pdf', status: 'wip' },
      { title: 'Procedural Alignment', pdf: '/pdfs/procedural-alignment.pdf', status: 'wip' },
      { title: 'Predictive Governance', pdf: '/pdfs/predictive-governance.pdf', status: 'wip' },
    ],
  },
  { id: 'metric-framework', col: 0, type: 'card', status: 'active',
    label: 'Metric Framework',
    description: 'What ought to be — the outcomes we want and how to measure progress',
    fullDescription: 'Institutional performance decomposes into two layers. Outcomes: welfare, equity, sustainability. Processes: epistemic quality, robustness under adversarial pressure, incentive alignment, information flow quality.',
    papers: [
      { title: 'Open Problems in AI-Mediated Epistemic Resilience', pdf: '/pdfs/open-problems-epistemic.pdf', status: 'wip' },
    ],
  },
  { id: 'experimental-methodology', col: 0, type: 'card', status: 'early',
    label: 'Experimental Methodology',
    description: 'Factorial designs, bifurcation analysis — how we structure experiments',
    fullDescription: 'Social choice theorems tell us about mechanisms in isolation; simulation tells us about mechanisms in composition. Factorial designs crossing mechanism composition x schedule configuration x adversarial pressure.',
  },

  // Column 1: Construction
  { id: 'computational-framework', col: 1, type: 'card', status: 'early',
    label: 'Computational Framework',
    description: 'JAX-native simulation: scalability, compilation, hardware acceleration',
    fullDescription: 'A JAX-native framework: GraphState, Transform, Schedule, Composition operators. Pure and typed, participates in JAX compilation, vectorisation, and differentiation.',
    papers: [
      { title: 'CI-Lib: Composable Mechanism Simulation', pdf: '/pdfs/ci-lab.pdf', status: 'wip' },
      { title: 'Adaptive Resolution Modelling', pdf: '/pdfs/adaptive-resolution.pdf', status: 'wip' },
    ],
  },
  { id: 'mechanism-library', col: 1, type: 'card', status: 'early',
    label: 'Mechanism Library',
    description: 'Constructing actual mechanisms from the formal foundations',
    fullDescription: 'Institutional mechanisms decomposed into reusable sub-process transforms. Markets, networks, democratic processes — each composable with any other.',
  },
  { id: 'showcase-environments', col: 1, type: 'card', status: 'early',
    label: 'Showcase Environments',
    description: 'Demonstration environments where mechanism composition matters',
    fullDescription: 'Environments demonstrating why composition matters. The fishing commons composes market + network + democracy on a shared resource.',
    papers: [
      { title: 'Cultural Evolution of Cognitive Tools', pdf: '/pdfs/cultural-evolution-cognitive.pdf', status: 'wip' },
    ],
  },

  // Column 2: Simulation
  { id: 'adversarial-testing', col: 2, type: 'card', status: 'planned',
    label: 'Adversarial Testing',
    description: 'RL agents finding optimal exploits, resilience profiles',
    fullDescription: 'RL environments where strategic agents attempt to exploit each mechanism composition, producing resilience profiles across adversarial pressures.',
  },
  { id: 'llm-simulation', col: 2, type: 'card', status: 'planned',
    label: 'LLM Social Simulation',
    description: 'Language-model agents testing robustness under realistic dynamics',
    fullDescription: 'LLM-based agents simulating social dynamics. Tests whether mechanisms remain robust when participants behave like real people.',
  },

  // Column 3: Validation
  { id: 'digital-democracy', col: 3, type: 'apply', status: 'future',
    label: 'Digital Democracy',
    description: 'Governance mechanisms tested and deployed',
    fullDescription: 'Applying verified coordination mechanisms to digital governance.',
  },
  { id: 'desci-lab', col: 3, type: 'apply', status: 'future',
    label: 'DeSci Lab',
    description: 'Information flow in research networks',
    fullDescription: 'Applying verified mechanisms to research communities for cross-field bridging.',
    papers: [
      { title: 'The Atoms of Knowledge Aren\'t Universal', link: 'https://equilibria1.substack.com/p/bridges-not-primitives', status: 'published' },
      { title: 'Modelling Bottlenecks in Decentralised Science', pdf: '/pdfs/bottlenecks-desci.pdf', status: 'wip' },
    ],
  },
  { id: 'new-markets', col: 3, type: 'apply', status: 'future',
    label: 'New Markets & Blockchains',
    description: 'Novel coordination infrastructure',
    fullDescription: 'Applying mechanism design to novel market structures and blockchain coordination.',
  },
  { id: 'partner-orgs', col: 3, type: 'apply', status: 'future',
    label: 'Partner Implementations',
    description: 'Testing with existing organisations and governance platforms',
    fullDescription: 'Partnering with organisations already building governance infrastructure to test variations of their existing systems using verified mechanisms.',
  },
];

export const ARROWS: ArrowDef[] = [
  { source: 'math-language', target: 'computational-framework', label: 'formalises into' },
  { source: 'math-language', target: 'mechanism-library', label: 'provides grammar for' },
  { source: 'process-modelling', target: 'computational-framework', label: 'implements as' },
  { source: 'process-modelling', target: 'mechanism-library', label: 'decomposes into' },
  { source: 'problem-domains', target: 'mechanism-library', label: 'scopes what to build' },
  { source: 'problem-domains', target: 'showcase-environments', label: 'defines scenarios for' },
  { source: 'metric-framework', target: 'showcase-environments', label: 'sets success criteria' },
  { source: 'experimental-methodology', target: 'showcase-environments', label: 'structures tests for' },
  { source: 'computational-framework', target: 'adversarial-testing', label: 'runs' },
  { source: 'mechanism-library', target: 'adversarial-testing', label: 'stress-tests' },
  { source: 'showcase-environments', target: 'adversarial-testing', label: 'simulates in' },
  { source: 'showcase-environments', target: 'llm-simulation', label: 'simulates in' },
  { source: 'adversarial-testing', target: 'digital-democracy', label: 'deploys to' },
  { source: 'adversarial-testing', target: 'desci-lab', label: 'deploys to' },
  { source: 'llm-simulation', target: 'new-markets', label: 'validates for' },
  { source: 'llm-simulation', target: 'partner-orgs', label: 'validates for' },
];
