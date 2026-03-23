// src/components/research/graphData.ts
// Tech tree: 4 columns, river shape, direct arrows.

import { type Node, type Edge, Position } from '@xyflow/react';

// ─── Layout ──────────────────────────────────────────────────────

const COL_X = [0, 540, 1080, 1620];
const COL_GAP_Y = 130;
const CARD_W = 260;
const CARD_H = 72;
const HEADER_Y = 0;
const CARDS_START_Y = 60;
const HEADERS = ['Foundations', 'Construction', 'Simulation', 'Validation'];

// ─── Card data ───────────────────────────────────────────────────

export interface CardDef {
  id: string;
  label: string;
  description: string;
  fullDescription: string;
  papers?: { title: string; pdf?: string; link?: string; status?: string }[];
  col: number;
  row: number;
  type: 'card' | 'apply';
  status: 'active' | 'early' | 'planned' | 'future';
}

export const CARDS: CardDef[] = [
  // ─── Column 0: Foundations (5 items) ───────────────────────────
  {
    id: 'math-language', col: 0, row: 0, type: 'card', status: 'active',
    label: 'Mathematical Language for CI',
    description: 'Describing coordination mechanisms as composable graph transforms',
    fullDescription: 'A formal framework for representing markets, networks, and democracies as operations on the same underlying structure — typed graphs with well-defined transformation rules. We seek a unified language where coordination mechanisms can be composed and analysed systematically, treating them as message-passing on graphs with different transformation rules.',
    papers: [
      { title: 'Spectral Model of Collective Active Inference', pdf: '/pdfs/spectral-collective-ai.pdf', status: 'active' },
      { title: 'Convergent Structures in Collective Intelligence', pdf: '/pdfs/convergent-structures.pdf', status: 'draft' },
      { title: 'Towards a Langlands Program for CI', pdf: '/pdfs/towards-langlands-ci.pdf', status: 'draft' },
      { title: 'Spectral Theory of Memetic Evolution', pdf: '/pdfs/spectral-memetic-evolution.pdf', status: 'draft' },
    ],
  },
  {
    id: 'process-modelling', col: 0, row: 1, type: 'card', status: 'active',
    label: 'Process-Based Modelling',
    description: 'Functions and compositions as a programming language of processes',
    fullDescription: 'A shift from object-oriented to function-oriented thinking about collective systems. Instead of asking "what are the agents that rule the world?" we ask "what are the functions that rule the world?" Processes compose: you can take derivatives, higher-order processes, and compose them together — not just static snapshots in space, but functions that act over time. This enables a compositional view where mechanisms are built from reusable process primitives.',
    papers: [
      { title: 'A Taxonomy of Agents from the Intentional Stance', pdf: '/pdfs/taxonomy-of-agents.pdf', status: 'published' },
      { title: 'A Natural History of Agency', pdf: '/pdfs/natural-history-agency.pdf', status: 'draft' },
      { title: 'Scalar Properties of Agency', pdf: '/pdfs/scalar-agency.pdf', status: 'draft' },
      { title: 'Active Inference and the Viable Systems Model', pdf: '/pdfs/active-inference-vsm.pdf', status: 'draft' },
      { title: 'Agent Identification through TPMs & Markov Blankets', pdf: '/pdfs/agent-id-tpm.pdf', status: 'draft' },
      { title: 'Markov Blanket Discovery via Minimum Cut', pdf: '/pdfs/markov-blanket-mincut.pdf', status: 'draft' },
    ],
  },
  {
    id: 'problem-domains', col: 0, row: 2, type: 'card', status: 'active',
    label: 'Problem & Domain Specification',
    description: 'Mapping economics, political science, and social choice into one formal domain',
    fullDescription: 'Working with domain experts to figure out how to express economic theory, political science, social choice theory, and related fields in terms of one underlying mathematical domain. A big part of this is mapping out in general how we can describe these systems so that we can take them into the mechanism library and simulation environments. Which coordination problems matter most? What are the environments? How do existing theories translate?',
    papers: [
      { title: 'Open Questions in Collective Agent Foundations', pdf: '/pdfs/open-questions-caf.pdf', status: 'draft' },
      { title: 'Procedural Alignment', pdf: '/pdfs/procedural-alignment.pdf', status: 'draft' },
      { title: 'Predictive Governance', pdf: '/pdfs/predictive-governance.pdf', status: 'draft' },
    ],
  },
  {
    id: 'metric-framework', col: 0, row: 3, type: 'card', status: 'active',
    label: 'Metric Framework',
    description: 'What ought to be — the outcomes we want and how to measure progress',
    fullDescription: 'The normative question: what should good institutions produce? Institutional performance decomposes into two layers. Outcomes are what we ultimately want: welfare, equity, sustainability. Processes are the observable dynamics we hypothesise lead there: epistemic quality, robustness under adversarial pressure, incentive alignment, information flow quality. The relationship between these layers is itself an empirical question.',
    papers: [
      { title: 'Open Problems in AI-Mediated Epistemic Resilience', pdf: '/pdfs/open-problems-epistemic.pdf', status: 'draft' },
    ],
  },
  {
    id: 'experimental-methodology', col: 0, row: 4, type: 'card', status: 'early',
    label: 'Experimental Methodology',
    description: 'Factorial designs, bifurcation analysis — how we structure experiments',
    fullDescription: 'Systematic experimental methodology for empirical institutional design. Social choice theorems tell us about mechanisms in isolation; simulation tells us about mechanisms in composition. The theorems generate hypotheses; the simulations test them. Factorial designs crossing mechanism composition × schedule configuration × adversarial pressure. Bifurcation analysis to find critical thresholds.',
  },

  // ─── Column 1: Construction (3 items, aligned to foundation predecessors)
  {
    id: 'computational-framework', col: 1, row: 1, type: 'card', status: 'early',
    label: 'Computational Framework',
    description: 'JAX-native simulation: scalability, compilation, hardware acceleration',
    fullDescription: 'The computational backbone — a JAX-native framework built on four primitives: GraphState (immutable typed state), Transform (pure functions on state), Schedule (temporal orchestration), and Composition operators (sequential, parallel, conditional). Because everything is pure and typed, the framework participates natively in JAX\'s compilation (jit), vectorisation (vmap), and differentiation (grad).',
    papers: [
      { title: 'CI-Lib: Composable Mechanism Simulation', pdf: '/pdfs/ci-lab.pdf', status: 'draft' },
      { title: 'Adaptive Resolution Modelling', pdf: '/pdfs/adaptive-resolution.pdf', status: 'draft' },
    ],
  },
  {
    id: 'mechanism-library', col: 1, row: 2, type: 'card', status: 'early',
    label: 'Mechanism Library',
    description: 'Constructing actual mechanisms from the formal foundations',
    fullDescription: 'Institutional mechanisms decomposed into reusable sub-process transforms. Markets (centralised auctions), networks (sparse local graphs for information sharing), democratic processes (periodic collective voting). Each is a self-contained Transform that composes with any other. The interesting questions are about combinations — how do three mechanisms interact when operating simultaneously on the same population at different timescales?',
  },
  {
    id: 'showcase-environments', col: 1, row: 3, type: 'card', status: 'early',
    label: 'Showcase Environments',
    description: 'Demonstration environments where mechanism composition matters',
    fullDescription: 'Environments that make the framework tangible and demonstrate why composition matters. The fishing commons experiment composes market + network + democracy mechanisms on a shared resource. The schedule itself is an experimental variable: different temporal configurations produce qualitatively different resilience profiles.',
    papers: [
      { title: 'Cultural Evolution of Cognitive Tools in Multi-Agent AI Systems', pdf: '/pdfs/cultural-evolution-cognitive.pdf', status: 'draft' },
    ],
  },

  // ─── Column 2: Simulation (2 items) ───────────────────────────
  {
    id: 'adversarial-testing', col: 2, row: 2, type: 'card', status: 'planned',
    label: 'Adversarial Testing',
    description: 'RL agents finding optimal exploits, resilience profiles',
    fullDescription: 'Reinforcement learning environments where strategic agents attempt to game, exploit, or break each mechanism composition. Agents use multiplicative weights bandits to learn strategies. A fraction are adversarial; the remainder are cooperative. Each composition is tested across a sweep of adversarial pressures, producing resilience profiles.',
  },
  {
    id: 'llm-simulation', col: 2, row: 3, type: 'card', status: 'planned',
    label: 'LLM Social Simulation',
    description: 'Language-model agents testing robustness under realistic dynamics',
    fullDescription: 'LLM-based environments simulating social dynamics: agents that argue, persuade, form coalitions, and coordinate in natural language. Tests whether mechanisms remain robust when participants behave like real people. RL finds theoretical worst cases; LLM simulation finds realistic ones.',
  },

  // ─── Column 3: Validation (4 items) ───────────────────────────
  {
    id: 'digital-democracy', col: 3, row: 1, type: 'apply', status: 'future',
    label: 'Digital Democracy',
    description: 'Governance mechanisms tested and deployed',
    fullDescription: 'Applying verified coordination mechanisms to digital governance — voting systems, deliberation platforms, collective decision-making tools.',
  },
  {
    id: 'desci-lab', col: 3, row: 2, type: 'apply', status: 'future',
    label: 'DeSci Lab',
    description: 'Information flow in research networks',
    fullDescription: 'The DeSci Bridging Lab — applying verified mechanisms to research communities. Researchers control their own information environment and tune discovery for cross-field bridging.',
    papers: [
      { title: 'Modelling Bottlenecks in Decentralised Science', pdf: '/pdfs/bottlenecks-desci.pdf', status: 'draft' },
    ],
  },
  {
    id: 'new-markets', col: 3, row: 3, type: 'apply', status: 'future',
    label: 'New Markets & Blockchains',
    description: 'Novel coordination infrastructure',
    fullDescription: 'Applying the mechanism design framework to novel market structures and blockchain-based coordination systems.',
  },
  {
    id: 'partner-orgs', col: 3, row: 4, type: 'apply', status: 'future',
    label: 'Partner Implementations',
    description: 'MetaGov, existing orgs testing variations',
    fullDescription: 'Partnering with organisations already building governance infrastructure to test variations of their existing systems based on verified mechanisms.',
  },
];

// ─── Arrows ──────────────────────────────────────────────────────

const ARROWS: { source: string; target: string }[] = [
  // Foundations → Construction
  { source: 'math-language', target: 'computational-framework' },
  { source: 'math-language', target: 'mechanism-library' },
  { source: 'process-modelling', target: 'computational-framework' },
  { source: 'process-modelling', target: 'mechanism-library' },
  { source: 'problem-domains', target: 'mechanism-library' },
  { source: 'problem-domains', target: 'showcase-environments' },
  { source: 'metric-framework', target: 'showcase-environments' },
  { source: 'experimental-methodology', target: 'showcase-environments' },

  // Construction → Simulation
  { source: 'computational-framework', target: 'adversarial-testing' },
  { source: 'mechanism-library', target: 'adversarial-testing' },
  { source: 'showcase-environments', target: 'adversarial-testing' },
  { source: 'showcase-environments', target: 'llm-simulation' },

  // Simulation → Validation
  { source: 'adversarial-testing', target: 'digital-democracy' },
  { source: 'adversarial-testing', target: 'desci-lab' },
  { source: 'llm-simulation', target: 'new-markets' },
  { source: 'llm-simulation', target: 'partner-orgs' },
];

// ─── Build graph ─────────────────────────────────────────────────

export function buildGraph(
  _detailLevel: number,
  _expandedNodes: Set<string>
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Column headers
  for (let ci = 0; ci < HEADERS.length; ci++) {
    nodes.push({
      id: `header-${ci}`,
      type: 'header',
      data: { label: HEADERS[ci] },
      position: { x: COL_X[ci] + CARD_W / 2 - 60, y: HEADER_Y },
      selectable: false,
      draggable: false,
    });
  }

  // Group cards by column and center each column around the same midpoint
  const cardsByCol: Map<number, CardDef[]> = new Map();
  for (const card of CARDS) {
    if (!cardsByCol.has(card.col)) cardsByCol.set(card.col, []);
    cardsByCol.get(card.col)!.push(card);
  }

  // Midpoint: center of the tallest column (Foundations, 5 cards)
  const maxCount = Math.max(...[...cardsByCol.values()].map((c) => c.length));
  const midY = CARDS_START_Y + ((maxCount - 1) * COL_GAP_Y) / 2;

  for (const [col, colCards] of cardsByCol) {
    const count = colCards.length;
    const totalHeight = (count - 1) * COL_GAP_Y;
    const startY = midY - totalHeight / 2;

    for (let i = 0; i < colCards.length; i++) {
      const card = colCards[i];
      nodes.push({
        id: card.id,
        type: card.type === 'apply' ? 'apply' : 'card',
        data: {
          label: card.label,
          description: card.description,
          status: card.status,
        },
        position: {
          x: COL_X[card.col],
          y: startY + i * COL_GAP_Y,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });
    }
  }

  // Arrows
  for (const arrow of ARROWS) {
    edges.push({
      id: `arrow-${arrow.source}-${arrow.target}`,
      source: arrow.source,
      target: arrow.target,
      sourceHandle: 'right',
      targetHandle: 'left',
      type: 'direct',
      style: { stroke: '#003B7E', strokeWidth: 1.5, opacity: 0.35 },
      markerEnd: { type: 'arrowclosed' as any, color: '#003B7E60' },
    });
  }

  return { nodes, edges };
}
