import type { ScenarioId } from '../engine/types';

/** One staged stretch of a run. Same activation semantics as StoryStep:
    apply the preset, cut to `tick`, then play to `playTo` at `speed`. */
export interface ShowcaseBeat {
  id: string;
  title: string;
  body: string;
  /** A view key from showcaseScenes[chapter.scenario]. */
  view: string;
  /** A preset id from the chapter scenario's registry entry — values are
      never duplicated here. Absent means the scenario's defaults. */
  preset?: string;
  /** Defaults to the scenario's own seed. */
  seed?: number;
  tick: number;
  playTo?: number;
  speed?: number;
}

export interface ShowcaseLink {
  href: string;
  label: string;
  description: string;
}

/** One simply-stated block of assumptions, optionally with what goes in and
    out (the model blocks carry In/Out; the scenario-outline blocks at the
    top of the page do not). */
export interface AssumptionBlock {
  id: string;
  title: string;
  assumptions: string[];
  input?: string;
  output?: string;
  /** The paper that specifies the model — absent means none does, and the
      output line says so plainly. */
  source?: string;
}

/** One column of the playable tray: four dials from the combined scenario's
    registry parameters, grouped by the system they touch. */
export interface DialGroup {
  id: string;
  label: string;
  blurb: string;
  params: [string, string, string, string];
}

/** The showcase crosses scenarios, so the chapter carries the scenario;
    a StoryStep is scoped inside one ScenarioDefinition and cannot. */
export interface ShowcaseChapter {
  id: string;
  kind: 'prose' | 'model' | 'assumptions' | 'playable';
  eyebrow: string;
  title: string;
  intro: string[];
  /** Model and playable chapters only. */
  scenario?: ScenarioId;
  /** One metric key from the scenario's registry entry, shown live. */
  headlineMetric?: string;
  /** Render the scenario's time-series charts under the stage. */
  charts?: boolean;
  /** Empty except for model chapters. */
  beats: ShowcaseBeat[];
  /** Assumptions chapters only. */
  blocks?: AssumptionBlock[];
  /** Playable chapters only. */
  dialGroups?: DialGroup[];
  presetChips?: string[];
  /** Outbound pointers, rendered as cards on any chapter. */
  links?: ShowcaseLink[];
}
