// src/content/standards.ts
//
// The simulation-standards page: one scroll story (why a simulation result
// needs a standard before it is reported), then the reporting requirements,
// the validation levels, and where to go next. Page copy and figure labels
// live here; figure geometry lives with the component (DIAGRAMS.md). The
// canonical text of the standard is STANDARDS.md in the Collective
// Intelligence Library repository; this page tells why.
import type { LegendEntry } from './research-areas/types';
import type { PageHeaderContent, PageSeo } from './types/page';

/** The seven steps of the story. The figure keys its scenes on this. */
export type StandardsStepState =
  'anything' | 'artifact' | 'traditions' | 'vary' | 'basins' | 'ladder' | 'unknowns';

export interface StandardsStep {
  state: StandardsStepState;
  /** Short stage label shown above the headline ("The problem", "The standard"). */
  stageLabel: string;
  headline: string;
  body: string;
}

/** Copy the figure draws inside the SVG. Geometry and seeds stay in the component. */
export interface StandardsFigureLabels {
  title: string;
  description: string;
  captions: Record<StandardsStepState, string>;
  annotations: Record<string, string>;
  legend: Record<StandardsStepState, LegendEntry[]>;
}

export interface RequirementItem {
  title: string;
  body: string;
}

export interface ValidationLevel {
  code: string;
  name: string;
  body: string;
}

export interface StandardsLink {
  href: string;
  label: string;
  description: string;
}

export interface StandardsPageContent {
  seo: PageSeo;
  header: PageHeaderContent;
  essay: {
    eyebrow: string;
    reference: string;
    title: string;
    intro: string[];
    figureLabel: string;
    steps: StandardsStep[];
  };
  figure: StandardsFigureLabels;
  requirements: {
    eyebrow: string;
    headline: string;
    intro: string[];
    items: RequirementItem[];
    note: string;
  };
  levels: {
    eyebrow: string;
    headline: string;
    intro: string;
    items: ValidationLevel[];
    note: string;
  };
  closing: {
    label: string;
    headline: string;
    body: string;
    links: StandardsLink[];
  };
  ui: {
    scrollPrompt: string;
    figureStatusLabel: string;
  };
}

const REPO_URL = 'https://github.com/eq-network/Collective-Intelligence-Library';

export const standardsContent: StandardsPageContent = {
  seo: {
    title: 'Simulation standards — Equilibria Network',
    description:
      'What a result from our simulations has to show before we report it: robustness across agent models and environment models, basin stability rather than point estimates, a declared validation level, and stated limitations. A standard we are proposing, versioned in the open.',
    canonicalPath: '/library/standards',
    type: 'article',
  },
  header: {
    eyebrow: 'CI LIBRARY / STANDARDS',
    title: 'Our simulation standards',
    subtitle: 'What a result from our simulations has to show before we report it.',
    summary:
      'A simulation can be made to support almost any conclusion. So a result is not evidence until it survives variation of the things we are uncertain about. This page explains why we hold ourselves to that rule and what a reported result has to include. The standard itself is a versioned document in the library repository; comment on it there.',
  },
  essay: {
    eyebrow: 'THE ARGUMENT',
    reference: 'library / simulation standards',
    title: 'Why we hold ourselves to a standard',
    intro: [
      'Agent-based models are the right tool exactly where the averaging behind equilibrium models breaks down: networked, heterogeneous, supply-chain-shaped systems. That is also where they are easiest to misuse. A model with forty parameters can be tuned to any conclusion, and a reader has no way to tell a finding from a parameter setting.',
      'Three research fields already have their own standards of evidence, and they do not agree. The standard below is our attempt to state, in one place and in the open, what a result from a simulation has to show before we report it. Scroll through the argument first; the requirements follow.',
    ],
    figureLabel: 'Fig. 01 / the same rules, run three times',
    steps: [
      {
        state: 'anything',
        stageLabel: 'The problem',
        headline: 'A simulation can support any conclusion',
        body: 'Adjust the agents, choose the random seed, choose how the outcome is measured, and cooperation appears or disappears on demand. That is not a flaw in one model. It is a property of simulation. The same rules, run three times with small changes nobody would notice, end in three different places.',
      },
      {
        state: 'artifact',
        stageLabel: 'The problem',
        headline: 'A single run is not a result',
        body: 'An outcome from one model, one agent type, one seed, and one way of measuring is an artifact until it survives variation of the things we are uncertain about. It might be a finding. It might be a parameter setting. Nothing in the run itself says which, and the run you would report looks exactly like the ones you would not.',
      },
      {
        state: 'traditions',
        stageLabel: 'The problem',
        headline: 'Three fields, three standards of evidence',
        body: 'Mechanism design asks for a formal proof: show that the incentives are compatible. Agent-based modelling asks for generative sufficiency: grow the pattern from simple rules. Ecology asks for a phase portrait: the stable states and how deep they are. Each is right about something, and none alone is enough. Elinor Ostrom made the same point about real institutions and combined all three streams: no single one suffices.',
      },
      {
        state: 'vary',
        stageLabel: 'The standard',
        headline: 'Robustness analysis: vary what is uncertain',
        body: 'Vary the agent model: rule-based agents, learning agents, language models, human subjects. Each relaxes a different assumption, and none is more realistic than the others in every respect. Vary the environment model too: a claim about a mechanism is strongest when it holds across structurally different models of the same domain. Report what survives both. Where results diverge, that is a finding, not a failure.',
      },
      {
        state: 'basins',
        stageLabel: 'The standard',
        headline: 'Basin stability, not point estimates',
        body: 'Ask how large a perturbation the system can absorb before it shifts regime, not only where it ends up. The answer has the shape of a basin of attraction: the set of initial states from which the desired outcome is still reached. Its size, as a function of the mechanism parameters, is the result. A single trajectory is an illustration. A phase boundary is a finding.',
      },
      {
        state: 'ladder',
        stageLabel: 'The standard',
        headline: 'Declare the validation level',
        body: 'Every model states how far it has been validated: it runs; it replicates a known result; it is calibrated to detect the phenomenon it was built to detect; it has been validated across agent models; it has been replicated or used independently. The levels rank the evidence, not the realism of the agents. The model documentation travels with the code.',
      },
      {
        state: 'unknowns',
        stageLabel: 'The standard',
        headline: 'State the known limitations',
        body: 'The methods break down in known places: while agents are still learning, when participants can change the rules or exit, and when a mechanism is enforced by construction. And stability says nothing about whether a state is desirable. A stable but harmful equilibrium is lock-in, not a success. Every stability claim is reported together with a separate welfare assessment.',
      },
    ],
  },
  figure: {
    title: 'The same simulation rules run under small changes, then the standard applied to them',
    description:
      'Seven scenes. Three runs from one initial state diverge; one is singled out as the run that would be reported; three research traditions are shown as separate loops; agents of different kinds and different environment models are attached to one mechanism; a potential landscape with a basin of attraction around the desired outcome; five validation levels with a model at the third; the landscape again with its known limitations marked.',
    captions: {
      anything: 'Same rules, three runs, three outcomes',
      artifact: 'Which run would you report?',
      traditions: 'Three fields, three standards of evidence',
      vary: 'Robustness across agent models and environment models',
      basins: 'The basin is the result, not the end point',
      ladder: 'How far has this model been validated?',
      unknowns: 'Known limitations',
    },
    annotations: {
      start: 'one initial state',
      runA: 'seed 1',
      runB: 'seed 2',
      runC: 'other reference frame',
      publish: 'the run you would report',
      artifactNote: 'finding or parameter setting?\nthe run alone cannot tell',
      proof: 'Formal proof',
      proofInner: 'incentive compatibility',
      grow: 'Generative sufficiency',
      growInner: 'micro rules, macro pattern',
      phase: 'Phase portrait',
      phaseInner: 'stable states and their depth',
      noSingle: 'no single evidence stream suffices',
      mechanism: 'mechanism',
      rules: 'rule-based',
      learner: 'learning agent',
      languageModel: 'language model',
      people: 'human subjects',
      worldA: 'environment A',
      worldB: 'environment B',
      worldC: 'environment C',
      varyNote: 'a result that holds across\nall of these is evidence',
      divergeNote: 'a result that does not\nis a finding too',
      outcome: 'the desired outcome',
      basin: 'basin of attraction: initial states that reach it',
      push: 'how large a perturbation\ncan it absorb?',
      basinNote: 'basin size as a function of\nthe parameters is the result',
      axisX: 'initial state',
      axisY: 'potential',
      r0: 'Level 0  runs',
      r1: 'Level 1  replicates a known result',
      r2: 'Level 2  calibrated to its target phenomenon',
      r3: 'Level 3  validated across agent models',
      r4: 'Level 4  independently replicated or used',
      thisModel: 'this model',
      ladderNote: 'declared with the\nmodel documentation',
      learning: 'non-stationary\nduring learning',
      exit: 'participants can exit',
      lockIn: 'stable but undesirable:\nlock-in',
      unknownsNote: 'stability is not desirability',
    },
    legend: {
      anything: [
        { glyph: 'circle', label: 'initial state' },
        { glyph: 'line', label: 'one run' },
        { glyph: 'dashed-line', label: 'same rules, other reference frame' },
      ],
      artifact: [
        { glyph: 'strong-line', label: 'the run you would report' },
        { glyph: 'dashed-line', label: 'the runs you would not' },
      ],
      traditions: [
        { glyph: 'dashed-loop', label: 'a research tradition' },
        { glyph: 'circle', label: 'an agent' },
        { glyph: 'line', label: 'its standard of evidence' },
      ],
      vary: [
        { glyph: 'triangle', label: 'AI agent, by kind' },
        { glyph: 'circle', label: 'human subjects' },
        { glyph: 'square', label: 'the mechanism' },
        { glyph: 'dashed-loop', label: 'an environment model' },
        { glyph: 'arrow', label: 'acts in' },
      ],
      basins: [
        { glyph: 'circle', label: 'the desired outcome' },
        { glyph: 'line', label: 'the potential landscape' },
        { glyph: 'bar', label: 'basin of attraction' },
      ],
      ladder: [
        { glyph: 'bar', label: 'a validation level' },
        { glyph: 'square', label: 'a model' },
      ],
      unknowns: [
        { glyph: 'circle', label: 'an outcome' },
        { glyph: 'line', label: 'the potential landscape' },
        { glyph: 'arrow', label: 'a deliberate exit' },
      ],
    },
  },
  requirements: {
    eyebrow: 'THE STANDARD / REPORTING REQUIREMENTS',
    headline: 'Ten reporting requirements',
    intro: [
      'These are not a gate. They are what a reader needs to re-run our reasoning and disagree with it precisely. The library provides tools for each requirement; the standard is written so that a model built elsewhere can meet the same requirements.',
      'The canonical text is STANDARDS.md in the library repository. It is versioned by pull request. If a requirement is wrong, open an issue that names the result it would have blocked or let through.',
    ],
    items: [
      {
        title: 'A comparative claim, not a forecast',
        body: '"Under mechanism M the desired outcome is reached from a larger set of initial states than under the alternative" is a claim we make. "This will happen" is not.',
      },
      {
        title: 'The reference frame',
        body: 'What was intervened on, over which distribution of initial states, measured by which observable. The choice of reference frame moves numbers, sometimes by a lot. It is stated every time.',
      },
      {
        title: 'Robustness analysis: what was varied, what was held fixed, and why',
        body: 'Two axes: the agent model (rule-based, learning, language model, human subjects; the kinds chosen are the ones that stress the assumption the claim depends on) and the environment model (structurally different models of the same domain, kept in a model register).',
      },
      {
        title: 'Basin stability, not point estimates',
        body: 'How large a perturbation the system absorbs before it shifts regime. The reported quantity is the basin fraction as a function of the mechanism parameters; phase boundaries are where it crosses one half. Headline results live on parameter sweeps; single trajectories are illustrations.',
      },
      {
        title: 'Statistical reporting',
        body: 'Comparative results use paired seeds (common random numbers) and a bootstrap confidence interval. A result is resolved when the interval excludes zero; otherwise it is reported as unresolved. No arbitrary sample sizes.',
      },
      {
        title: 'Pre-registered predictions',
        body: 'Predictions are recorded before a parameter sweep runs. A mismatch between the recorded prediction and the result is a finding and is reported as one. It is never tuned away.',
      },
      {
        title: 'Parameter provenance',
        body: 'Every parameter value is one of: anchored to a cited source or a replicated known result; chosen for legibility and labelled as such; or unanchored and swept. A value that is none of these does not appear.',
      },
      {
        title: 'Model documentation kept with the model',
        body: 'What the model takes the world to be, its assumptions, what it leaves out, which known result it replicates, and which parameter the claim turns on. Stored next to the code, in the spirit of the ODD protocol for describing agent-based models, so a fork carries its documentation with it.',
      },
      {
        title: 'Reproducible figures',
        body: 'Every figure regenerates from committed experiment artifacts. Nothing is hand-drawn and no numbers are typed into figure code. A figure that cannot be regenerated is not published.',
      },
      {
        title: 'Known limitations stated',
        body: 'An open question stated plainly is preferred to a proxy metric or a confident sentence. Unknowns are reported in place, as part of the result.',
      },
    ],
    note: 'Acceptance criterion, in words: a mechanism is robustly good for an outcome if, under every agent model and environment model tested, the outcome lies in a basin of attraction whose stability exceeds a threshold set relative to the alternative mechanisms in the same domain. This is a robustness claim across what was tested, not a guarantee about what was not, and not a claim of optimality.',
  },
  levels: {
    eyebrow: 'THE STANDARD / VALIDATION LEVELS',
    headline: 'Five validation levels, declared per model',
    intro:
      'Every model in the library is placed on the same five-level scale. The level is declared in the model documentation and enforced by its tests, so a reader knows how far to trust it. The scale ranks the evidence, not the agents: it says how thoroughly a model has been validated, not how realistic its agents are.',
    items: [
      { code: 'L0', name: 'Runs', body: 'Exists, compiles, produces trajectories.' },
      {
        code: 'L1',
        name: 'Replicates a known result',
        body: 'Reproduces at least one established result from the literature the model claims to belong to.',
      },
      {
        code: 'L2',
        name: 'Calibrated',
        body: 'With controlled agents, the environment demonstrably produces the target phenomenon and the observables demonstrably detect it. The instrument is calibrated before it is pointed at anything new.',
      },
      {
        code: 'L3',
        name: 'Validated across agent models',
        body: 'Environment fixed, a structurally different agent model substituted, and the level-2 signals measured for survival. The environment stays bit-exact; agent behaviour is pinned to a provider and version, with changes disclosed.',
      },
      {
        code: 'L4',
        name: 'Independently replicated or used',
        body: 'Reviewed, replicated, or built on by someone outside the group that built it.',
      },
    ],
    note: 'Known limitations of the method: while agents are still learning the landscape is non-stationary, so stability is measured at checkpoints or after convergence. When participants can change the rules or exit, measured exit times are upper bounds. A mechanism enforced by construction has a trivially infinite basin; the relevant question there is verification of the constraint. And a stable but harmful equilibrium is lock-in, not a success: every stability claim is paired with a separate welfare assessment.',
  },
  closing: {
    label: 'Where to go next',
    headline: 'This is our standard. Comment on it.',
    body: 'We are proposing it, not enforcing it on anyone else. It is a versioned document in the open, distilled from a paper in preparation and from practice already in the library. Apply it to a model built elsewhere; where it does not fit, that is exactly the comment we want.',
    links: [
      {
        href: REPO_URL,
        label: 'The standard, versioned',
        description:
          'STANDARDS.md in the Collective Intelligence Library repository. Changes by pull request.',
      },
      {
        href: '/showcase/',
        label: 'Showcase',
        description: 'The scenarios the standard applies to, as guided runs in the browser.',
      },
      {
        href: '/library/explanation/',
        label: 'Inside the library',
        description:
          'How the engine works: one state, pure transforms, a compiler for institutions.',
      },
      {
        href: '/research',
        label: 'Research areas',
        description: 'The four questions this standard is meant to make answerable.',
      },
    ],
  },
  ui: {
    scrollPrompt: 'Scroll',
    figureStatusLabel: 'Step',
  },
};
