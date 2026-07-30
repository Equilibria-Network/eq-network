import type { ScenarioId, Trajectory } from '../engine/types';

export interface SceneRenderer<Layer = unknown> {
  layout(group: SVGElement, trajectory: Trajectory): Layer;
  drawFrame(
    group: SVGElement,
    layer: Layer,
    trajectory: Trajectory,
    tick: number,
    fraction: number
  ): void;
}

export interface SceneView {
  key: string;
  label: string;
  renderer: SceneRenderer<unknown>;
}

export type ScenarioSceneCatalog = Record<ScenarioId, SceneView[]>;
