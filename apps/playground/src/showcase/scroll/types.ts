import type { ScenarioId } from '../../engine/types';
import type { AssumptionBlock, ShowcaseChapter, ShowcaseLink } from '../types';

/** A staged stretch of a real run — same activation semantics as
    ShowcaseBeat: apply the preset, cut to `tick`, autoplay to `playTo`. */
export interface RunStageSpec {
  kind: 'run';
  /** A view key from showcaseScenes[segment.scenario]. */
  view: string;
  /** A preset id from the segment scenario's registry entry — values are
      never duplicated here. Absent means the scenario's defaults. */
  preset?: string;
  seed?: number;
  tick: number;
  playTo?: number;
  speed?: number;
}

/** A figure the diagram phase (task-0007 P2) will build. P1 renders the
    frame with its label and note so pacing is judgeable before the figure
    exists. */
export interface PlaceholderStageSpec {
  kind: 'placeholder';
  label: string;
  note: string;
}

/** The combined model's influence diagram (task-0007 P2), rendered from
    influenceDiagram.ts and traceability-tested against the engine fixture. */
export interface DiagramStageSpec {
  kind: 'diagram';
}

export type StageSpec = RunStageSpec | PlaceholderStageSpec | DiagramStageSpec;

/** One scroll-activated step: copy in the narrative column, a stage in the
    sticky figure. The id doubles as the VisualEssay state. */
export interface ScrollStep {
  id: string;
  stageLabel: string;
  headline: string;
  body: string;
  stage: StageSpec;
}

/** One essay segment — a sticky figure plus its scroll steps. Roughly one
    act of the task-0007 story. */
export interface ScrollSegment {
  kind: 'segment';
  id: string;
  eyebrow: string;
  title: string;
  intro: string[];
  /** Required when any step stages a run. */
  scenario?: ScenarioId;
  headlineMetric?: string;
  charts?: boolean;
  steps: ScrollStep[];
}

/** Full-width stated-plainly interlude between segments. */
export interface ScrollAssumptions {
  kind: 'assumptions';
  id: string;
  eyebrow: string;
  blocks: AssumptionBlock[];
}

/** A prose-only section (Act V — the discipline). */
export interface ScrollProse {
  kind: 'prose';
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  links?: ShowcaseLink[];
}

/** The defense leaderboard, reused from /lab. The table itself (columns,
    rows, the Illustrative badge) is the site's lab content rendered by the
    site's Leaderboard component — this item carries only the scroll page's
    framing copy, so the data stays single-sourced. */
export interface ScrollLeaderboard {
  kind: 'leaderboard';
  id: string;
  eyebrow: string;
  intro: string[];
}

/** The playable ending — the canonical playable chapter, reused verbatim,
    with only the eyebrow renumbered for this page's sequence. */
export interface ScrollPlayable {
  kind: 'playable';
  id: string;
  eyebrow: string;
  chapter: ShowcaseChapter;
}

export type ScrollItem =
  ScrollSegment | ScrollAssumptions | ScrollProse | ScrollLeaderboard | ScrollPlayable;
