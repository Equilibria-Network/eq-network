/** The ONLY module that imports from src/data/library-explainer. Build-time
    JSON imports: a missing or renamed fixture fails the build, which is the
    asset-validation the prototype programme asks for. */
import manifestJson from '@/data/library-explainer/manifest.json';
import subsetsJson from '@/data/library-explainer/pipeline-subsets.json';
import systemsJson from '@/data/library-explainer/system-graphs.json';
import snippetsJson from '@/data/library-explainer/snippets.json';
import goldenJson from '@/data/library-explainer/schedule-golden.json';
import shapesJson from '@/data/library-explainer/state-shapes.json';
import scorecardJson from '@/data/library-explainer/scorecard.json';
import curveJson from '@/data/library-explainer/influence-curve.json';
import graphMatrixJson from '@/data/library-explainer/graph-matrix.json';
import baselineRun from '@/data/library-explainer/runs/governed_commons.baseline.json';
import quotaRun from '@/data/library-explainer/runs/governed_commons.quota_voting.json';
import sanctionsRun from '@/data/library-explainer/runs/governed_commons.graduated_sanctions.json';

import type {
  ExplainerManifest,
  GraphMatrixFixture,
  InfluenceCurveFixture,
  RunPayload,
  ScheduleGoldenFixture,
  ScorecardFixture,
  SnippetsFixture,
  StateShapesFixture,
  SubsetsFixture,
  SystemsFixture,
} from './types';

export const manifest = manifestJson as ExplainerManifest;
export const subsets = subsetsJson as unknown as SubsetsFixture;
export const systems = systemsJson as unknown as SystemsFixture;
export const snippets = snippetsJson as unknown as SnippetsFixture;
export const scheduleGolden = goldenJson as unknown as ScheduleGoldenFixture;
export const stateShapes = shapesJson as unknown as StateShapesFixture;
export const scorecard = scorecardJson as unknown as ScorecardFixture;
export const influenceCurve = curveJson as unknown as InfluenceCurveFixture;
export const graphMatrix = graphMatrixJson as unknown as GraphMatrixFixture;

export const runs: Record<string, RunPayload> = {
  baseline: baselineRun as unknown as RunPayload,
  quota_voting: quotaRun as unknown as RunPayload,
  graduated_sanctions: sanctionsRun as unknown as RunPayload,
};

/** Row lookup: the exporter orders rows so that row k's enabled set is the
    bit pattern of k over the transforms array (pinned by the engine's
    tests/test_library_explainer.py and the ajv validator). */
export function subsetRow(enabled: number[]) {
  const mask = enabled.reduce((m, i) => m | (1 << i), 0);
  return subsets.rows[mask];
}
