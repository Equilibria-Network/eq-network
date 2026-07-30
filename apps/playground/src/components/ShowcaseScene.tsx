import { useLayoutEffect, useRef } from 'react';
import type { ScenarioId, Trajectory } from '../engine/types';
import { scenarioScenes } from '../rendering/scenes';

interface Props {
  fraction: number;
  scenario: ScenarioId;
  tick: number;
  trajectory: Trajectory;
  view: string;
}

export default function ShowcaseScene({ fraction, scenario, tick, trajectory, view }: Props) {
  const staticRef = useRef<SVGGElement>(null);
  const dynamicRef = useRef<SVGGElement>(null);
  const layerRef = useRef<unknown>(null);
  const renderer =
    scenarioScenes[scenario].find((candidate) => candidate.key === view)?.renderer ??
    scenarioScenes[scenario][0].renderer;
  const safeTick = Math.max(0, Math.min(tick, trajectory.meta.T - 1));
  const safeFraction = Math.max(0, Math.min(fraction, 0.999));

  useLayoutEffect(() => {
    const staticGroup = staticRef.current;
    if (!staticGroup) return;
    staticGroup.replaceChildren();
    layerRef.current = renderer.layout(staticGroup, trajectory);
  }, [renderer, trajectory]);

  useLayoutEffect(() => {
    const dynamicGroup = dynamicRef.current;
    if (!dynamicGroup || !layerRef.current) return;
    dynamicGroup.replaceChildren();
    renderer.drawFrame(dynamicGroup, layerRef.current, trajectory, safeTick, safeFraction);
  }, [renderer, safeFraction, safeTick, trajectory]);

  return (
    <svg
      aria-label={`${scenario} simulation at tick ${safeTick}`}
      className="showcase-scene"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      viewBox="0 0 880 400"
    >
      <g ref={staticRef} />
      <g ref={dynamicRef} />
    </svg>
  );
}
