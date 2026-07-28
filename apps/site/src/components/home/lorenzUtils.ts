// src/components/home/lorenzUtils.ts

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface SystemParams {
  sigma: number;
  rho: number;
  beta: number;
  dt: number;
  noise: number;
}

export interface DisplayBounds {
  x: [number, number];
  z: [number, number];
}

export const LORENZ_CONFIG = {
  system: {
    sigma: 10,
    rho: 28,
    beta: 8 / 3,
    dt: 0.003,
    noise: 0.00005,
  },
  display: {
    bounds: {
      x: [-25, 25] as [number, number], // Explicit tuple type
      z: [0, 60] as [number, number], // Explicit tuple type
    },
  },
  animation: {
    maxPoints: 2000,
    pointsPerFrame: 3,
    padding: 0.85, // More padding = smaller
    initialPoints: 300,
    initialSpeed: 4,
  },
  butterfly: {
    perturbation: 1e-6, // Initial separation between trajectories
  },
  colors: {
    primary: { r: 0, g: 59, b: 126 }, // Dark blue
    secondary: { r: 34, g: 197, b: 94 }, // Green
  },
};

// Create initial seed point
export const createInitialSeed = (): Point3D => ({
  x: -11.2 + (Math.random() - 0.5) * 2,
  y: 4.4 + (Math.random() - 0.5) * 2,
  z: 21.2 + (Math.random() - 0.5) * 2,
});

// Calculate next point using RK4 integration
export const calculateNext = (
  point: Point3D,
  system: SystemParams,
  speedMultiplier: number = 1
): Point3D => {
  const { sigma, rho, beta, dt, noise } = system;
  const { x, y, z } = point;

  const steps = Math.ceil(speedMultiplier);
  const stepDt = (dt * speedMultiplier) / steps;

  let currentX = x;
  let currentY = y;
  let currentZ = z;

  for (let i = 0; i < steps; i++) {
    const dx = sigma * (currentY - currentX);
    const dy = currentX * (rho - currentZ) - currentY;
    const dz = currentX * currentY - beta * currentZ;

    const noiseScale = Math.min(1, 1 / speedMultiplier);
    const appliedNoise = noise * noiseScale;

    currentX += dx * stepDt + (Math.random() - 0.5) * appliedNoise;
    currentY += dy * stepDt + (Math.random() - 0.5) * appliedNoise;
    currentZ += dz * stepDt + (Math.random() - 0.5) * appliedNoise;
  }

  return { x: currentX, y: currentY, z: currentZ };
};

// Pre-calculate points for smooth animation start
export const preCalculatePoints = (
  seed: Point3D,
  system: SystemParams,
  count: number,
  speed: number
): Point3D[] => {
  const points = [seed];
  for (let i = 0; i < count; i++) {
    const current = points[points.length - 1];
    const next = calculateNext(current, system, speed);
    points.push(next);
  }
  return points;
};

// Project 3D point to 2D canvas (XZ perspective)
export const projectPoint = (
  point: Point3D,
  canvas: { width: number; height: number },
  bounds: DisplayBounds,
  padding: number = 1
): Point2D => {
  const xRange = bounds.x[1] - bounds.x[0];
  const zRange = bounds.z[1] - bounds.z[0];

  const xScale = (canvas.width * padding) / xRange;
  const zScale = (canvas.height * padding) / zRange;
  const scale = Math.min(xScale, zScale);

  return {
    x: point.x * scale + canvas.width / 2,
    y: -point.z * scale + canvas.height / 2 + (zRange * scale) / 2,
  };
};

// Get CSS color and convert to RGB
export const getCssColor = (variable: string): { r: number; g: number; b: number } => {
  if (typeof window === 'undefined') {
    return { r: 0, g: 59, b: 126 };
  }

  const color = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return { r, g, b };
  }

  const match = color.match(/\d+/g);
  if (match) {
    return {
      r: parseInt(match[0]),
      g: parseInt(match[1]),
      b: parseInt(match[2]),
    };
  }

  return { r: 0, g: 59, b: 126 };
};

// Create perturbed seed for butterfly effect
export const createPerturbedSeed = (originalSeed: Point3D, magnitude: number = 1e-6): Point3D => ({
  x: originalSeed.x + (Math.random() - 0.5) * magnitude * 2,
  y: originalSeed.y + (Math.random() - 0.5) * magnitude * 2,
  z: originalSeed.z + (Math.random() - 0.5) * magnitude * 2,
});
