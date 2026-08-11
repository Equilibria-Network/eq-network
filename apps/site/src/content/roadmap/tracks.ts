// src/content/roadmap/tracks.ts
// Typed content for the CI Library development roadmap. Promoted 2026-08-08
// (owner direction): the canonical page lives at /library/roadmap under the
// "CI Library" nav dropdown; /roadmap/prototype stays as the unlisted
// prototype route rendering the same component. The canonical /roadmap (the
// org-level phase roadmap) keeps consuming the phase files; this module is
// the six-track library structure, not a fork of the phase copy.

import type { PageHeaderContent, PageSeo } from '../types/page';

export type MilestoneStatus = 'done' | 'active' | 'next' | 'later';

export interface PipelineMilestone {
  id: string;
  /** Short label on the track line. Keep to a few words. */
  label: string;
  status: MilestoneStatus;
}

export interface PipelineTrack {
  id: string;
  /** Two-digit ordinal used in the lane header. */
  index: string;
  name: string;
  /** The one-line question the track answers, set as a mono annotation. */
  question: string;
  /** Reserved for a milestone detail view; not rendered in the lane demo. */
  description: string;
  /** Milestones in order, earliest first. */
  milestones: PipelineMilestone[];
}

export interface PipelinePhase {
  /** Mono micro-label above the phase name, e.g. "Phase 01 / Now". */
  label: string;
  name: string;
  note: string;
}

export interface PipelinePrototypeContent {
  seo: PageSeo;
  header: PageHeaderContent;
  ui: {
    trackLabelPrefix: string;
    statusLabels: Record<MilestoneStatus, string>;
    legendLabel: string;
    phasesRuleLabel: string;
    tracksRuleLabel: string;
    loopRuleLabel: string;
  };
  /** The two-phase band: construction & simulation now, practice after. */
  phases: [PipelinePhase, PipelinePhase];
  /** One sentence between the phase band and the track lanes. */
  tracksIntro: string;
  tracks: PipelineTrack[];
  loop: {
    title: string;
    body: string;
  };
}

const description =
  'How the Collective Intelligence Library grows: six independent tracks with their milestones, closing the loop from theory to practice.';

export const pipelinePrototypeContent: PipelinePrototypeContent = {
  seo: {
    title: 'Development Pipeline — prototype — Equilibria Network',
    description,
    canonicalPath: '/roadmap/prototype',
    noindex: true,
  },

  header: {
    eyebrow: 'CI Library',
    title: 'How the library grows',
    subtitle: 'Six independent tracks, one loop from theory to practice.',
    summary:
      'The Collective Intelligence Library is in its construction and simulation phase. The work runs as six tracks. Each track moves on its own, and each track can take outside contributions on its own.',
    prompt: 'Follow the tracks',
  },

  ui: {
    trackLabelPrefix: 'Track ',
    statusLabels: {
      done: 'Done',
      active: 'Active',
      next: 'Next',
      later: 'Later',
    },
    legendLabel: 'Milestone states',
    phasesRuleLabel: 'The two phases',
    tracksRuleLabel: 'The six tracks',
    loopRuleLabel: 'Where it ends',
  },

  phases: [
    {
      label: 'Phase 01 / Now',
      name: 'Construction & Simulation',
      note: 'Build the simulation infrastructure and test defences inside it. The six tracks below all belong to this phase.',
    },
    {
      label: 'Phase 02 / After',
      name: 'Practice',
      note: 'Test the policies and defences that win in simulation with real organisations, in the real world.',
    },
  ],

  tracksIntro:
    'Each track answers one question and moves through its own milestones. Together they turn the library from an engine into shared infrastructure.',

  tracks: [
    {
      id: 'metrics-coupling',
      index: '01',
      name: 'Metrics & Coupling',
      question: 'What should we measure, and how do systems connect?',
      description:
        'The foundation. Metrics come in two layers: the outcomes we want, and the processes we believe lead to those outcomes. Coupling is the contract that lets an economic model, a political model, and a cultural model run on one shared population.',
      milestones: [
        { id: 'metric-framework', label: 'Two-layer metric framework', status: 'done' },
        { id: 'metrics-catalog', label: 'Cross-disciplinary catalog', status: 'active' },
        { id: 'metrics-calibration', label: 'Calibration against known sources', status: 'next' },
        { id: 'coupling-contract', label: 'Multi-domain coupling contract', status: 'next' },
        { id: 'coupled-measured', label: 'Coupled system measured end to end', status: 'later' },
      ],
    },
    {
      id: 'scenarios',
      index: '02',
      name: 'Scenarios',
      question: 'Which failures should we be able to rehearse?',
      description:
        'Worked environments that produce a collective failure by default: a detailed economic model, a political model, a cultural model, and a coupled model that runs all three on one population.',
      milestones: [
        { id: 'first-benchmarked', label: 'First scenario benchmarked', status: 'done' },
        { id: 'economic-model', label: 'Detailed economic model', status: 'active' },
        { id: 'political-cultural', label: 'Political & cultural models', status: 'active' },
        { id: 'coupled-suite', label: 'Coupled disempowerment suite', status: 'next' },
        { id: 'ai-epistemics', label: 'AI epistemics scenario', status: 'next' },
        { id: 'canonical-futures', label: 'Runnable canonical futures', status: 'later' },
      ],
    },
    {
      id: 'mechanisms',
      index: '03',
      name: 'Mechanisms',
      question: 'Which parts can the field share?',
      description:
        'The library of parts: coordination mechanisms from economics, political science, and network science. Each mechanism declares what it reads and writes, so it composes safely with the rest, and other projects can import single mechanisms without adopting the whole library.',
      milestones: [
        { id: 'typed-declarations', label: 'Typed read/write declarations', status: 'done' },
        { id: 'core-catalog', label: 'Markets, voting, networks', status: 'active' },
        { id: 'more-disciplines', label: 'Imports from more disciplines', status: 'next' },
        { id: 'contribution-pathway', label: 'Contribution pathway', status: 'next' },
        { id: 'external-module', label: 'First external module merged', status: 'later' },
      ],
    },
    {
      id: 'interfaces',
      index: '04',
      name: 'Interface & Interoperability',
      question: 'Can people outside the code see the model?',
      description:
        'The surfaces people touch: visualisations, the interactive showcase, usability for researchers from other fields, and machine-readable scenario pages. Interoperability means working alongside other simulation systems and testbeds rather than competing with them.',
      milestones: [
        { id: 'showcase', label: 'Live showcase', status: 'done' },
        { id: 'assumption-views', label: 'Assumption-inspection views', status: 'active' },
        { id: 'machine-pages', label: 'Machine-readable scenario pages', status: 'next' },
        { id: 'interop', label: 'Interop with other testbeds', status: 'later' },
      ],
    },
    {
      id: 'agents',
      index: '05',
      name: 'Agents',
      question: 'Who can live inside a scenario?',
      description:
        'A ladder of decision-makers. The rungs near the top of the list come first: rule-based agents, learning agents, active inference agents, and deliberative reasoning agents. Language-model agents and large-scale language-model populations come later, on environments that are already verified. The same environment runs any rung, including humans.',
      milestones: [
        { id: 'rule-based', label: 'Rule-based agents', status: 'done' },
        { id: 'learning-agents', label: 'Learning agents', status: 'active' },
        { id: 'active-inference', label: 'Active inference agents', status: 'active' },
        { id: 'deliberative', label: 'Deliberative reasoning agents', status: 'next' },
        { id: 'llm-agents', label: 'Language-model agents', status: 'later' },
        { id: 'llm-populations', label: 'Large-scale LLM populations', status: 'later' },
      ],
    },
    {
      id: 'scale',
      index: '06',
      name: 'Performance & Scale',
      question: 'How large can a population get?',
      description:
        'The engineering that makes everything cheap to run: parallel execution in JAX, targeting simulations of 10,000 or more agents on a single GPU or a small cluster. Scale matters because population-level effects only show up in populations.',
      milestones: [
        { id: 'seed-parallel', label: 'Seed-parallel runs', status: 'done' },
        { id: 'profiling', label: 'Population-scale profiling', status: 'next' },
        { id: 'jax-paths', label: 'Parallel engine paths in JAX', status: 'next' },
        { id: 'ten-k', label: '10,000+ agents on one GPU', status: 'later' },
      ],
    },
  ],

  loop: {
    title: 'Closing the loop',
    body: 'All six tracks belong to the construction and simulation phase. The phase after it is practice: testing the policies and defences that win in simulation with real organisations. That closes the loop between theory and practice, and it is the point of the whole pipeline.',
  },
};

/** The canonical page under the CI Library nav dropdown — same body as the
    prototype, indexed and sitemapped. */
export const libraryRoadmapContent: PipelinePrototypeContent = {
  ...pipelinePrototypeContent,
  seo: {
    title: 'Development Roadmap — Collective Intelligence Library — Equilibria Network',
    description,
    canonicalPath: '/library/roadmap',
  },
};
