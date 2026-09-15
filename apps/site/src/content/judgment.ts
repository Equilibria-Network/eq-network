import type { PageHeaderContent, PageSeo } from './types/page';

/** /showcase/judgment — the WP4 model (delegated judgment, oversight
    erosion) as a replay page over an engine-exported bundle. Every number
    the page shows was computed by the Collective Intelligence Library and
    exported as a versioned artifact (delegated-judgment-erosion-v1); the
    page selects and draws, it never simulates. Copy lives here; cell
    coordinates and step timings live in the component's script. */

export interface JudgmentPageContent {
  seo: PageSeo;
  header: PageHeaderContent;
}

export const judgmentPageContent: JudgmentPageContent = {
  seo: {
    title: 'Where Does the Judgment Go? — Equilibria Network',
    description:
      'A small agent-based model of oversight erosion: workers hand decisions to an AI, judgment decays with disuse, and review catches mistakes only as well as the judgment left to do it. Built from an expert horizon scan’s causal loop.',
    canonicalPath: '/showcase/judgment',
    // Prototype gate: stays noindex until owner copy review.
    noindex: true,
  },
  header: {
    eyebrow: 'CI LAB / SHOWCASE / JUDGMENT',
    title: 'Where does the judgment go?',
    subtitle:
      'Watch an institution hand its decisions to an AI, lose the judgment to check them, and miss the day the AI breaks.',
    summary:
      'In 2026 the Odyssean Institute’s horizon scan drew one loop among many: delegate more decisions to AI, depend on it more, keep less independent judgment, catch fewer of its failures, and the window to correct it closes. This page runs the smallest model of that loop. Every run below was computed by the Collective Intelligence Library engine and exported; the page only selects and draws.',
  },
};

export const judgmentIntro: string[] = [
  'A causal loop diagram says which way each arrow points. It does not say how strong the arrows are, whether the loop has a threshold, whether it can be reversed, or what happens when the people in it differ from one another. So we built the smallest model that can answer those questions: thirty workers and one AI system, six one-line rules, every assumption a dial.',
  'How to read the stage: each circle is a worker, filled by how much judgment they have left. The square is the AI, shaded by how often it is right. The lines are decisions handed over, heavier the more a worker delegates. The four strips on the right are the institution’s vitals over time; the grey band is a fault, sixty ticks in which the AI is right only half the time and says nothing.',
];

export const judgmentRules = [
  'Decisions get made, and some go wrong. A worker’s own decisions are wrong as often as their judgment fails; delegated ones are wrong as often as the AI is.',
  'Review catches what the reviewer can see. Half of delegated decisions are reviewed, and a review catches an AI error only in proportion to the reviewer’s remaining judgment.',
  'Judgment is use-it-or-lose-it. It grows on the decisions you make yourself and decays on the ones you hand away.',
  'The institution believes what its reviews tell it. Reviewers who cannot see mistakes report few, so eroded judgment inflates trust. A slow public channel, benchmarks, says how good the AI is in general and never that it broke on your work.',
  'Workers delegate what looks cheaper today. Nobody prices tomorrow’s judgment. That omission is the mechanism.',
  'The institution may set a floor: a share of every worker’s decisions that must be made alone, whatever the worker prefers.',
];

export const judgmentClosing: string[] = [
  'The loop diagram’s arrow holds in every cell of the sweep: fewer human decisions, fewer AI errors caught. What the diagram cannot carry is what moves an institution along that arrow. Near the threshold, workers under time pressure erode first while cheap deciders hold; and whether the holdouts’ judgment protects anyone depends on who reviews whose work. Pool the reviews across the floor and the same institution keeps its belief honest and its delegation down. The review assignment is a variable the diagram has no node for.',
  'This is a model statement, not a forecast. It is calibrated to no institution, judgment is one number, the AI has no objective, and the workers do not plan. Read directions and orderings, never magnitudes. The model, its assumptions card, its validation ladder, and the experiment suite with predictions committed before the runs live in the library.',
];

export const judgmentLinks = [
  {
    href: 'https://github.com/eq-network/Collective-Intelligence-Library/tree/main/experiments/wp4_oversight',
    label: 'The experiment suite',
    description:
      'Sweeps, committed predictions, and the recorded mismatches, in the Collective Intelligence Library repository.',
  },
  {
    href: 'https://github.com/eq-network/Collective-Intelligence-Library/tree/main/src/cilib/environments/delegated_judgment',
    label: 'The model and its assumptions card',
    description: 'Six rules as code, every dial typed, fifteen permanent tests.',
  },
  {
    href: 'https://jfsdigital.org/2026/07/23/surfacing-vulnerabilities-mapping-governance-futures-and-anticipating-policy-pathways/',
    label: 'The horizon scan’s method',
    description: 'The Odyssean Institute on mapping governance futures with causal loops.',
  },
];
