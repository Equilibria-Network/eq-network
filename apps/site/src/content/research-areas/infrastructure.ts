// src/content/research-areas/infrastructure.ts
import type { ResearchArea } from './types';

export const infrastructure: ResearchArea = {
  id: 'infrastructure',
  index: 4,
  eyebrow: 'AREA 04 / SIMULATION INFRASTRUCTURE',
  name: 'One population, composable institutions',
  oneLiner:
    'The Collective Intelligence Library: a wind tunnel where the other three areas get tested.',
  intro: [
    'The first three areas make claims about boundaries, speed, and regulation. Claims like that need somewhere to be tested. Real institutions do not allow experiments. So we build a wind tunnel: agent-based models where a market, a polity, and a culture run on the same population and can be coupled, swapped, and measured.',
    'The Collective Intelligence Library is that tunnel. Every institution in it is a pure function that declares what it reads and writes, so the engine can derive the execution order and the models compose. This area holds the engine, the scenarios built on it, and the work on when a simulation result may be believed.',
  ],
  figureLabel: 'Fig. 04 / one state, three transforms',
  steps: [
    {
      state: 'question',
      stageLabel: 'The question',
      headline: 'Three models, three stories, no shared world',
      body: 'The usual picture of the AI transition comes as separate stories: an economic one, a political one, a cultural one. Each has its own model, its own assumptions, and no way to feed the others. So the couplings that matter most, money buying attention, attention moving votes, votes rewriting rules, are told in prose and never run.',
    },
    {
      state: 'why',
      stageLabel: 'Why it matters',
      headline: 'The same population under all three',
      body: 'Put one population underneath. The market, the polity, and the culture become transforms that read fields from that population and write fields back. Now a shock in one model reaches the others through the state they share, and the coupling is a thing you can turn up and down. This is what the showcase on this site runs.',
    },
    {
      state: 'shape',
      stageLabel: 'How it looks',
      headline: 'Declared effects, derived order, composable institutions',
      body: 'Each transform declares what it reads and writes. From those declarations the engine derives which transforms can run in parallel and which must wait, draws the system graph, and checks that a new institution composes with the old ones before anything runs. That is the engineering claim behind the library: institutions as functions that compose, on one typed state.',
    },
    {
      state: 'open',
      stageLabel: 'What is open',
      headline: 'What enters next, and when a result may be believed',
      body: 'Two open fronts. First, new kinds of actors: AI agents that adapt inside the simulation, and models that switch resolution when a tipping point is near. Second, evidence standards. A designed institution can be tested against game-theoretic agents, trained agents, language-model agents, and people, and each test is incomplete on its own. Working out how those tests add up is as much a part of this area as the engine.',
    },
  ],
  pieces: [
    {
      id: 'ci-library-code',
      title: 'The Collective Intelligence Library',
      kind: 'software',
      status: 'published',
      venue: 'GitHub',
      asks: 'Can markets, networks, and democracies be modelled in one composable framework instead of separate tools?',
      setup:
        'A JAX-based simulation library where institutions are typed graph transforms with declared read and write effects. Open source.',
      href: 'https://github.com/eq-network/Collective-Intelligence-Library',
    },
    {
      id: 'cilib-whitepaper',
      title: 'The CI Library whitepaper',
      kind: 'paper',
      status: 'working-paper',
      year: 2026,
      asks: 'What is the engine, how do contributions enter it, and when may a result from it be believed?',
      setup:
        'The framework paper: the engine, the contribution protocol, the measurement layer, and the ladder of rigor a result climbs before it counts.',
      href: '/pdfs/cilib-whitepaper.pdf',
    },
    {
      id: 'wp1-money',
      title: 'WP1: Where Does the Money Go?',
      kind: 'paper',
      status: 'working-paper',
      year: 2026,
      asks: 'How does influence drain from human hands in a capital economy with AI labour?',
      setup:
        'The capital-economy model behind the showcase: its assumptions, the survival threshold it uses, and how it was validated.',
      href: '/pdfs/wp1-where-does-the-money-go.pdf',
    },
    {
      id: 'wp2-attention',
      title: 'WP2: Who Fills Your Head?',
      kind: 'paper',
      status: 'working-paper',
      year: 2026,
      asks: 'How does an attention network pool and amplify influence?',
      setup:
        'The listening-network model behind the attention section of the showcase, and the defences aimed at attention itself.',
      href: '/pdfs/wp2-who-fills-your-head.pdf',
    },
    {
      id: 'wp3-power',
      title: 'WP3: Where Does the Power Go?',
      kind: 'paper',
      status: 'working-paper',
      year: 2026,
      asks: 'How does delegated voting concentrate power?',
      setup:
        'The delegative-polity model behind the votes section: conserved ballots, a power-weighted median, and a takeover threshold.',
      href: '/pdfs/wp3-where-does-the-power-go.pdf',
    },
    {
      id: 'ci-lab',
      title: 'CI Lab: A Functional Simulation Engine',
      kind: 'paper',
      status: 'working-paper',
      year: 2026,
      asks: 'Can a functional-programming approach to multi-agent simulation be both rigorous and fast?',
      setup:
        'An earlier framework paper, with a case study of democratic mechanisms under adversarial stress.',
      href: '/pdfs/ci-lab.pdf',
    },
    {
      id: 'adaptive-resolution',
      title: 'Adaptive Resolution Modelling',
      kind: 'paper',
      status: 'working-paper',
      year: 2026,
      asks: 'Can a simulation zoom into fine detail only near a tipping point, and stay coarse otherwise?',
      setup:
        'A framework proposal for agent-based models that switch resolution level as they run.',
      href: '/pdfs/adaptive-resolution.pdf',
    },
    {
      id: 'when-to-disaggregate',
      title: 'When to Disaggregate',
      kind: 'paper',
      status: 'draft',
      year: 2026,
      asks: 'Can a cheap aggregate model run by default, with a live test that says when to switch to the expensive detailed one?',
      setup:
        'A heterogeneous-agent economic simulation in JAX as ground truth, an online version of an established accuracy test as the trigger, compared across shock scenarios.',
    },
    {
      id: 'evidence-standards',
      title: 'Evidence Standards for Computational Mechanism Design',
      kind: 'paper',
      status: 'draft',
      year: 2026,
      asks: 'How should we judge whether a designed institution will hold up, when no single test method is complete?',
      setup:
        'A framework that tests an institution against structurally different participants (game theory, trained agents, language-model agents, humans) and scores stability with measures borrowed from ecology, shown on a shared-resource toy game.',
    },
    {
      id: 'system-level-safety',
      title: 'System Level Safety Evaluations',
      kind: 'post',
      status: 'published',
      year: 2025,
      venue: 'LessWrong',
      asks: 'Should AI safety evaluate whole multi-agent systems, not just single models?',
      setup: 'An essay arguing for system-level evaluation.',
      href: 'https://www.lesswrong.com/posts/AJo2HFT8TdY2B3wNJ/system-level-safety-evaluations',
    },
  ],
  figure: {
    title: 'Three models over one shared population, with the row that orders them',
    description:
      'Rounded squares are models: a market, a polity, and a culture. The capsule beneath them is the shared population state. Solid arrows are reads and writes. Dashed arrows are the couplings between models. The small numbered row shows the derived execution order. In the last beat a dashed triangle marks planned AI actors.',
    captions: {
      question: 'three models, three stories',
      why: 'the same population under all three',
      shape: 'declared effects, derived order',
      open: 'what enters next?',
    },
    annotations: {
      market: 'market',
      polity: 'polity',
      culture: 'culture',
      separate: 'its own world',
      population: 'one population',
      readWrite: 'reads and writes',
      coupling: 'money, attention, votes',
      compilerTitle: 'derived order',
      compilerNote: 'from what each\ndeclares it touches',
      planned: 'AI actors',
      openNote: 'new actors, new resolutions,\nand when a result may be believed',
      whyNote: 'a shock here\nreaches the others',
    },
    legend: [
      { glyph: 'square', label: 'model / transform' },
      { glyph: 'capsule', label: 'shared population' },
      { glyph: 'arrow', label: 'reads / writes' },
      { glyph: 'dashed-arrow', label: 'coupling' },
      { glyph: 'triangle', label: 'planned actor' },
    ],
  },
};
