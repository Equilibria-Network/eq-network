import type { NumericParams, RunFailure, RunRequest, RunResult, ScenarioId } from './types';

export class SimulationClient {
  private worker: Worker | null = null;
  private requestId = 0;

  run(scenario: ScenarioId, params: NumericParams, seed: number): Promise<RunResult> {
    this.cancel();
    const worker = new Worker(new URL('./simulation.worker.ts', import.meta.url), {
      type: 'module',
      name: `equilibria-${scenario}`,
    });
    this.worker = worker;
    const requestId = ++this.requestId;
    const request: RunRequest = { type: 'run', requestId, scenario, params, seed };

    return new Promise((resolve, reject) => {
      worker.addEventListener('message', ({ data }: MessageEvent<RunResult | RunFailure>) => {
        if (data.requestId !== requestId) return;
        worker.terminate();
        if (this.worker === worker) this.worker = null;
        if (data.type === 'error') {
          reject(new Error(data.message));
        } else {
          resolve(data);
        }
      });
      worker.addEventListener('error', (event) => {
        worker.terminate();
        if (this.worker === worker) this.worker = null;
        reject(new Error(event.message || 'The simulation worker stopped unexpectedly.'));
      });
      worker.postMessage(request);
    });
  }

  cancel(): void {
    this.worker?.terminate();
    this.worker = null;
  }

  dispose(): void {
    this.cancel();
  }
}
