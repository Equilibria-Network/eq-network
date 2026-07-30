import {
  LORENZ_CONFIG,
  calculateNext,
  projectPoint,
  type Point3D,
  type SystemParams,
} from '@components/home/lorenzUtils';

export interface LorenzMarkCandidate {
  id: string;
  name: string;
  note: string;
  path: string;
  strokes: LorenzStroke[];
  params: string;
}

export interface LorenzStroke {
  d: string;
  width: number;
  opacity: number;
}

interface TraceConfig {
  seed: Point3D;
  burnIn: number;
  count: number;
  sampleEvery: number;
  system: Partial<SystemParams>;
}

const VIEWPORT = { width: 240, height: 240 };

function lorenzTrace(config: TraceConfig) {
  const system: SystemParams = {
    ...LORENZ_CONFIG.system,
    noise: 0,
    ...config.system,
  };
  let point = { ...config.seed };

  for (let index = 0; index < config.burnIn; index += 1) {
    point = calculateNext(point, system);
  }

  const points: Array<{ x: number; y: number }> = [];
  for (let index = 0; index < config.count; index += 1) {
    point = calculateNext(point, system);
    if (index % config.sampleEvery !== 0) continue;
    const projected = projectPoint(
      point,
      VIEWPORT,
      LORENZ_CONFIG.display.bounds,
      LORENZ_CONFIG.animation.padding
    );
    const x = Math.round(projected.x * 100) / 100;
    const y = Math.round(projected.y * 100) / 100;
    points.push({ x, y });
  }

  const path = points.map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'}${x} ${y}`).join('');
  const strokes: LorenzStroke[] = [];
  const pointsPerStroke = 4;

  for (let start = 0; start < points.length - 1; start += pointsPerStroke) {
    const end = Math.min(points.length - 1, start + pointsPerStroke);
    const progress = end / (points.length - 1);
    const fadeProgress = Math.max(0, Math.min(1, (progress - 0.68) / 0.32));
    const smoothFade = fadeProgress * fadeProgress * (3 - 2 * fadeProgress);
    const entryProgress = Math.min(1, progress / 0.12);
    const entryEase = entryProgress * entryProgress * (3 - 2 * entryProgress);
    const width = (0.68 + entryEase * 0.32) * (1 - smoothFade * 0.94);
    const opacity = 1 - smoothFade * 0.88;
    const segment = points
      .slice(Math.max(0, start - 1), end + 1)
      .map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'}${x} ${y}`)
      .join('');
    strokes.push({ d: segment, width, opacity });
  }

  return { path, strokes };
}

const baseSeed = { x: -11.2, y: 4.4, z: 21.2 };
const variants: Array<Omit<LorenzMarkCandidate, 'path' | 'strokes'> & TraceConfig> = [
  {
    id: '01',
    name: 'Unequal basins',
    note: 'A canonical orbit with one established wing and one smaller return.',
    params: 'σ10 / ρ28 / β8⁄3',
    seed: baseSeed,
    burnIn: 2500,
    count: 850,
    sampleEvery: 1,
    system: {},
  },
  {
    id: '02',
    name: 'Right weighted',
    note: 'The same system caught during a longer right-hand orbit.',
    params: 'σ10 / ρ28 / β8⁄3',
    seed: baseSeed,
    burnIn: 2000,
    count: 700,
    sampleEvery: 1,
    system: {},
  },
  {
    id: '03',
    name: 'Left weighted',
    note: 'A later phase reverses the hierarchy while keeping the Lorenz silhouette.',
    params: 'σ10 / ρ28 / β8⁄3',
    seed: baseSeed,
    burnIn: 5250,
    count: 850,
    sampleEvery: 1,
    system: {},
  },
  {
    id: '04',
    name: 'Quiet return',
    note: 'Fewer revolutions leave clearer counters and a restrained crossover.',
    params: 'σ10 / ρ28 / β8⁄3',
    seed: baseSeed,
    burnIn: 6375,
    count: 750,
    sampleEvery: 1,
    system: {},
  },
  {
    id: '05',
    name: 'Lower energy',
    note: 'A nearby Lorenz regime with tighter turns.',
    params: 'σ10 / ρ26 / β8⁄3',
    seed: baseSeed,
    burnIn: 2500,
    count: 900,
    sampleEvery: 1,
    system: { rho: 26 },
  },
  {
    id: '06',
    name: 'Higher energy',
    note: 'A nearby Lorenz regime with wider basin changes.',
    params: 'σ10 / ρ30 / β8⁄3',
    seed: baseSeed,
    burnIn: 4750,
    count: 760,
    sampleEvery: 1,
    system: { rho: 30 },
  },
  {
    id: '07',
    name: 'Slow coupling',
    note: 'Lower sigma stretches the exchange between variables.',
    params: 'σ9 / ρ28 / β8⁄3',
    seed: baseSeed,
    burnIn: 2500,
    count: 850,
    sampleEvery: 1,
    system: { sigma: 9 },
  },
  {
    id: '08',
    name: 'Fast coupling',
    note: 'Higher sigma tightens each pass through the center.',
    params: 'σ12 / ρ28 / β8⁄3',
    seed: baseSeed,
    burnIn: 4750,
    count: 800,
    sampleEvery: 1,
    system: { sigma: 12 },
  },
  {
    id: '09',
    name: 'Low dissipation',
    note: 'A lower beta creates a taller, more open trajectory.',
    params: 'σ10 / ρ28 / β2.4',
    seed: baseSeed,
    burnIn: 2500,
    count: 900,
    sampleEvery: 1,
    system: { beta: 2.4 },
  },
  {
    id: '10',
    name: 'High dissipation',
    note: 'A higher beta compresses the repeated returns.',
    params: 'σ10 / ρ28 / β3',
    seed: baseSeed,
    burnIn: 5000,
    count: 900,
    sampleEvery: 1,
    system: { beta: 3 },
  },
  {
    id: '11',
    name: 'Perturbed start',
    note: 'The canonical system from a nearby deterministic seed.',
    params: 'Δx + 0.8 / canonical',
    seed: { x: -10.4, y: 4.4, z: 21.2 },
    burnIn: 2500,
    count: 850,
    sampleEvery: 1,
    system: {},
  },
  {
    id: '12',
    name: 'Perturbed phase',
    note: 'A second nearby seed after a shorter burn-in.',
    params: 'Δy − 0.7 / canonical',
    seed: { x: -11.2, y: 3.7, z: 21.2 },
    burnIn: 5250,
    count: 850,
    sampleEvery: 1,
    system: {},
  },
];

export const lorenzMarkCandidates: LorenzMarkCandidate[] = variants.map((variant) => {
  const trace = lorenzTrace(variant);
  return {
    id: variant.id,
    name: variant.name,
    note: variant.note,
    params: variant.params,
    ...trace,
  };
});
