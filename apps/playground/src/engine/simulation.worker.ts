/// <reference lib="webworker" />

import { runScenario } from './run';
import type { RunFailure, RunRequest, RunResult, Trajectory } from './types';

const worker = self as DedicatedWorkerGlobalScope;

function transferableBuffers(trajectory: Trajectory): ArrayBuffer[] {
  const buffers = new Set<ArrayBuffer>();
  const groups = [trajectory.global, trajectory.node, trajectory.static, trajectory.adj ?? {}];

  for (const group of groups) {
    for (const value of Object.values(group)) {
      buffers.add(value.buffer as ArrayBuffer);
    }
  }

  return [...buffers];
}

worker.addEventListener('message', ({ data }: MessageEvent<RunRequest>) => {
  if (data.type !== 'run') return;

  try {
    const startedAt = performance.now();
    const trajectory = runScenario(data.scenario, data.params, data.seed);
    const result: RunResult = {
      type: 'result',
      requestId: data.requestId,
      scenario: data.scenario,
      durationMs: performance.now() - startedAt,
      trajectory,
    };

    worker.postMessage(result, transferableBuffers(trajectory));
  } catch (error) {
    const failure: RunFailure = {
      type: 'error',
      requestId: data.requestId,
      message: error instanceof Error ? error.message : 'The simulation failed.',
    };
    worker.postMessage(failure);
  }
});
