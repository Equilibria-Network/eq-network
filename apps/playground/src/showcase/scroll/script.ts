// The value import carries a .ts extension so node --test can traverse it
// under type stripping (test/scroll-contracts.test.js); type-only imports
// are erased and need none.
import { showcaseChapters } from '../script.ts';
import type { ShowcaseBeat, ShowcaseChapter } from '../types';
import type { RunStageSpec, ScrollItem, ScrollStep } from './types';

/** The scroll-story flow (task-0007 P1, v3 length cut, owner direction
    2026-08-06): confusion → the basic version of each model as one slide
    each → the combined model with its influence diagram → the
    building-blocks-and-forking close → the playable ending. Beats and the
    playable chapter are imported from ../script — staging and reused copy
    are single-sourced; the helpers throw when the canonical copy drifts so
    the contract test catches it. New copy is a draft pending the P3 owner
    pass. */

function chapterOf(id: string): ShowcaseChapter {
  const found = showcaseChapters.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`showcase chapter "${id}" is missing`);
  return found;
}

function beatOf(chapterId: string, beatId: string): ShowcaseBeat {
  const found = chapterOf(chapterId).beats.find((candidate) => candidate.id === beatId);
  if (!found) throw new Error(`showcase beat "${chapterId}/${beatId}" is missing`);
  return found;
}

function runStage(beat: ShowcaseBeat): RunStageSpec {
  return {
    kind: 'run',
    view: beat.view,
    preset: beat.preset,
    seed: beat.seed,
    tick: beat.tick,
    playTo: beat.playTo,
    speed: beat.speed,
  };
}

function beatStep(chapterId: string, beatId: string): ScrollStep {
  const beat = beatOf(chapterId, beatId);
  return {
    id: beat.id,
    stageLabel: `run · ${beat.preset ?? 'defaults'}`,
    headline: beat.title,
    body: beat.body,
    stage: runStage(beat),
  };
}

const collapseBeat = beatOf('coupled', 'collapse');

export const scrollFlow: ScrollItem[] = [
  {
    kind: 'segment',
    id: 'wall',
    eyebrow: '01 · The hypothesis',
    title: 'Gradual disempowerment, simulated',
    intro: [],
    scenario: 'combined',
    steps: [
      {
        id: 'coldopen',
        stageLabel: 'run · every channel open',
        headline: 'The hypothesis, run forward',
        body: 'Gradual disempowerment (Kulveit et al., 2025) is the hypothesis that humans lose influence over society through no single event: as AI systems substitute for human labour, cultural production, and political judgment, the feedback loops that keep societies responsive to their members erode together. This is one run of a small agent-based simulation of that hypothesis at its most permissive setting — twenty-six actors, three coupled subsystems, every cross-system channel open. The human shares of income, attention, and voting power all decline. The question is what, mechanically, produces that.',
        stage: runStage(collapseBeat),
      },
      {
        id: 'tame',
        stageLabel: 'the modelling problem',
        headline: 'Why the hypothesis resists analysis',
        body: 'It is a claim about coupled systems. The economy, the information network, and the polity are studied by different fields whose formalisms do not compose, and the feedback between them — money buying attention, attention moving votes, votes rewriting economic rules — is exactly what the hypothesis says matters. Our approach: money, attention, and votes are each a conserved quantity moving over a relation among the same actors, so all three subsystems can be written as one kind of object and run in one world. The next three screens show each subsystem in isolation; the combined model then couples them. Parameters are hand-set and the populations are small: these models support ordering claims — which mechanisms produce decline, and which defenses stop it — not forecasts.',
        stage: {
          kind: 'run',
          view: collapseBeat.view,
          preset: collapseBeat.preset,
          seed: collapseBeat.seed,
          tick: collapseBeat.playTo ?? collapseBeat.tick,
        },
      },
    ],
  },
  {
    kind: 'segment',
    id: 'money',
    eyebrow: '02 · Money',
    title: chapterOf('economy').title,
    intro: [],
    scenario: 'economy',
    headlineMetric: chapterOf('economy').headlineMetric,
    steps: [
      {
        id: 'baseline',
        stageLabel: 'run · baseline',
        headline: 'The economic strand',
        body: 'The hypothesis’ first strand — Kulveit et al.’s misaligned economy — is that human influence over production tracks how much the economy still needs people. This model isolates that mechanism: households work and spend, AI capital does sector work and pays upkeep out of its own revenue, and nothing else is in the model. That yields one governing quantity — capability against upkeep. Below the threshold, automation that cannot pay for itself goes extinct; above it, profit compounds into more capital and the human share of value added declines as far as the production recipes allow. This run sits just above the threshold: the difference between the two endings is a parameter crossing a line, not any actor’s decision.',
        stage: runStage(beatOf('economy', 'baseline')),
      },
    ],
  },
  {
    kind: 'segment',
    id: 'attention',
    eyebrow: '03 · Attention',
    title: chapterOf('culture').title,
    intro: [],
    scenario: 'culture',
    headlineMetric: chapterOf('culture').headlineMetric,
    steps: [
      {
        id: 'amplified',
        stageLabel: 'run · amplified',
        headline: 'The cultural strand',
        body: 'The second strand — misaligned culture — is that AI-originated content can out-replicate human-originated content in the competition for attention. This model isolates that mechanism: thirty people and four machine voices share one listening network, opinions pool along who-listens-to-whom, and attention drifts toward whoever is already attended to. Partway through the run, amplification makes the machine voices more attractive to listen to than their influence warrants. Listening concentrates on them and the shared consensus drifts away from the citizens’ own signals — with no censorship anywhere in the model. The mechanism is structural: prominence attracts prominence.',
        stage: runStage(beatOf('culture', 'amplified')),
      },
    ],
  },
  {
    kind: 'segment',
    id: 'votes',
    eyebrow: '04 · Votes',
    title: chapterOf('politics').title,
    intro: [],
    scenario: 'politics',
    headlineMetric: chapterOf('politics').headlineMetric,
    steps: [
      {
        id: 'captured',
        stageLabel: 'run · captured',
        headline: 'The political strand',
        body: 'The third strand — misaligned states — is that influence over collective decisions follows delegation, and delegation follows convenience. This model isolates that mechanism: ballots are conserved, one matrix records where each actor’s political voice ends up, and the enacted policy is the position of the power-weighted median ballot. Partway through the run, AI delegates become marginally easier to hand one’s voice to — no persuasion, no misinformation, no rule is changed. Delegation concentrates, and once one bloc holds the median ballot the enacted policy decouples from what the citizens want. The event is a share crossing one half.',
        stage: runStage(beatOf('politics', 'captured')),
      },
    ],
  },
  {
    kind: 'segment',
    id: 'combined',
    eyebrow: '05 · One world',
    title: chapterOf('coupled').title,
    intro: chapterOf('coupled').intro,
    scenario: 'combined',
    headlineMetric: chapterOf('coupled').headlineMetric,
    charts: true,
    steps: [
      beatStep('coupled', 'sealed'),
      beatStep('coupled', 'coupled'),
      {
        id: 'diagram',
        stageLabel: 'the influence diagram',
        headline: 'The variables, and how they couple',
        body: 'The hypothesis’ central claim — Kulveit et al.’s mutual reinforcement — is about this wiring: cross-system feedback can erode economic, cultural, and political influence together even when each subsystem alone is recoverable. The diagram shows the model’s six variables and every coupling between them. Circles are conserved ledgers, in two strengths. Attention and ballots are fixed budgets — each actor holds one unit of listening and one of political voice, so influence there is only ever redistributed. Money is not capped: production mints it and consumption burns it, so the total grows with the economy — but every other rule can only move it, which is what forces influence bought in one system to be paid for out of another. Boxes are ordinary state variables, free to grow or decay: capital compounds, enforcement erodes and repairs. Solid edges move conserved value, dashed edges move rates and structure, and the three emphasized channels are the couplings the presets seal. Each variable and edge maps onto named functions in the engine, and a test checks the figure against the model’s declared reads and writes, so the picture cannot drift from the code. To be explicit about status: this is an illustrative model of gradual disempowerment — it demonstrates the hypothesis’ structure in the smallest world that can carry it, and we do not claim a world this small makes progress on the problem itself. Models that track reality in considerably more detail are in development.',
        stage: { kind: 'diagram' },
      },
    ],
  },
  {
    kind: 'prose',
    id: 'blocks',
    eyebrow: '06 · The idea',
    title: 'Simple blocks, open to disagreement',
    paragraphs: [
      'Everything you just watched is built from deliberately simple blocks: small functions compose into mechanisms, mechanisms and influence functions compose into environments, and one engine runs them all. Each block is short enough to read, and each declares what it reads and writes — which is what lets a market, a listening network, and a polity click together into one world.',
      'That simplicity is the method. A page of simulations cannot settle whether gradual disempowerment is our future; what it can do is turn the hypothesis into inspectable, testable parts. If you think a block is wrong — the median-voter rule, the upkeep threshold, a coupling — fork exactly that block, rerun the world, and keep everything else. A fork produces a comparable run on the same seeds, not an argument. The intent is iterative: over time, the most plausible environments and the defenses that keep working are the ones that survive.',
    ],
    links: [
      {
        href: 'https://arxiv.org/abs/2501.16946',
        label: 'Kulveit et al., Gradual Disempowerment (2025)',
        description:
          'The hypothesis this page simulates: systemic existential risk from incremental AI development, through misaligned economies, cultures, and states reinforcing one another.',
      },
      {
        href: 'https://equilibria1.substack.com/p/stories-of-the-future-are-undermined',
        label: 'Models of Society Are Built on Models of Agents',
        description:
          'The argument behind this page: why stories of the future rest on hidden agent assumptions, and why coupled systems have to be run rather than reasoned through.',
      },
    ],
  },
  {
    kind: 'playable',
    id: 'play',
    eyebrow: chapterOf('play').eyebrow,
    chapter: chapterOf('play'),
  },
  {
    kind: 'leaderboard',
    id: 'scoreboard',
    eyebrow: '08 · The scoreboard',
    intro: [
      'Whatever you just built with the dials is, in the benchmark’s terms, a portfolio: a composition of mechanisms run together against a scenario. Each portfolio runs on the same seeds as the undefended baseline and is scored on how much collective human influence it preserves, so every row is comparable and the best cell in a column is the score to beat. A portfolio that wins a single machine tends to score worse in the coupled world — the transfer gap this suite exists to measure — and forked versions land as their own rows, which is how disagreeing with a defense becomes a number instead of an argument.',
      'This board is where we want the whole page to go. The plan is a growing family of small, visual, illustrative models like the ones above — one for each strand of disempowerment, and forecasting-oriented variants beyond them — each shipping with an undefended baseline and interventions specific to it: taxes and redistribution rules for the economy, attention caps and sortition for the listening network, ballot floors and re-delegation churn for the polity. From a mechanism-design perspective, that is the experiment each row reports: which composition of interventions moves a scenario from disempowerment toward empowerment, and by how much against its baseline.',
      'Because the baselines stay fixed and interventions stack on top of them, iteration compounds in both directions. The scenarios get harder — a future coupled scenario might hand defenders a limited budget, so that a portfolio has to spend scarce resources wisely instead of turning every dial at once — and the defenses get more detailed for each model as people fork what is already on the board. The numbers below are illustrative, sketching that trajectory; real benchmark rows replace them as the suite goes live.',
    ],
  },
];
