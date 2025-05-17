// src/components/Home/Lorenz/utils/lorenzUtils.js
/**
 * Utility functions and constants for Lorenz Attractor simulation.
 * 
 * This file contains core mathematical functions, system parameters, and helper 
 * utilities for the Lorenz Attractor simulation. It provides the foundation for
 * calculating trajectories and rendering the attractor.
 * 
 * Key exports:
 * - LORENZ_CONFIG: Default configuration for the system
 * - createInitialSeed: Creates starting points for simulation
 * - calculateNext: Calculates the next point in the system
 * - calculateRates: Gets rates of change for current point
 * - getCssColor: Utility to convert CSS variables to RGB
 * - preCalculatePoints: Generate initial points for animation start
 */

// System default parameters
export const LORENZ_CONFIG = {
  system: {
    sigma: 10,
    rho: 28,
    beta: 8/3,
    dt: 0.003,      // Time step
    noise: 0.00005  // Small noise for more natural animation
  },
  display: {
    bounds: {
      x: [-20, 20],
      z: [0, 50]
    }
  },
  animation: {
    maxPoints: 2000,
    startDrawingAt: 20,
    strokeInterval: 3,
    pointsPerFrame: 3,
    padding: 1,
    initialPoints: 300,
    initialSpeed: 4,
    transitionFrames: 45
  }
};

// Parameter descriptions for educational value
export const PARAMETER_DESCRIPTIONS = {
  sigma: "Controls fluid viscosity and mixing rate. Higher values create more turbulence.",
  rho: "Energy input parameter. Values above 24.74 create chaotic behavior.",
  beta: "Determines spatial scaling. Classic value of 8/3 creates the butterfly shape.",
  dt: "Time step for numerical integration. Smaller values give more accurate simulation.",
  noise: "Random fluctuation magnitude. Simulates real-world perturbations."
};

// Create initial seed point with slight randomization
export const createInitialSeed = () => ({
  x: -11.2 + (Math.random() - 0.5) * 2,
  y: 4.4 + (Math.random() - 0.5) * 2,
  z: 21.2 + (Math.random() - 0.5) * 2
});

// Calculate next point in Lorenz system
export const calculateNext = (point, system, speedMultiplier = 1) => {
  const { sigma, rho, beta, dt, noise } = system;
  const { x, y, z } = point;
  
  // For higher speeds, use multiple smaller steps instead of one large step
  const steps = Math.ceil(speedMultiplier);
  const stepDt = dt * speedMultiplier / steps;
  
  let currentX = x;
  let currentY = y;
  let currentZ = z;
  
  for (let i = 0; i < steps; i++) {
    const dx = sigma * (currentY - currentX);
    const dy = currentX * (rho - currentZ) - currentY;
    const dz = currentX * currentY - beta * currentZ;
    
    // Apply smaller noise at higher speeds to maintain stability
    const noiseScale = Math.min(1, 1/speedMultiplier);
    const appliedNoise = noise * noiseScale;
    
    currentX += dx * stepDt + (Math.random() - 0.5) * appliedNoise;
    currentY += dy * stepDt + (Math.random() - 0.5) * appliedNoise;
    currentZ += dz * stepDt + (Math.random() - 0.5) * appliedNoise;
  }
  
  return {
    x: currentX,
    y: currentY,
    z: currentZ
  };
};

// Calculate rates of change at current point
export const calculateRates = (point, system) => {
  const { sigma, rho, beta } = system;
  const { x, y, z } = point;
  
  const dx = sigma * (y - x);
  const dy = x * (rho - z) - y;
  const dz = x * y - beta * z;
  
  return { dx, dy, dz };
};

// Pre-calculate a batch of points for smoother animation start
export const preCalculatePoints = (seed, system, count, speed) => {
  const points = [seed];
  for (let i = 0; i < count; i++) {
    const current = points[points.length - 1];
    const next = calculateNext(current, system, speed);
    points.push(next);
  }
  return points;
};

// Project 3D point to 2D canvas based on selected perspective
export const projectPoint = (point, canvas, bounds, perspective = 'xz', padding = 1) => {
  const xRange = bounds.x[1] - bounds.x[0];
  const zRange = bounds.z[1] - bounds.z[0];
  
  const xScale = (canvas.width * padding) / xRange;
  const zScale = (canvas.height * padding) / zRange;
  const scale = Math.min(xScale, zScale);

  switch (perspective) {
    case 'xy':
      return {
        x: point.x * scale + canvas.width / 2,
        y: point.y * scale + canvas.height / 2
      };
    case 'yz':
      return {
        x: point.y * scale + canvas.width / 2,
        y: -point.z * scale + canvas.height / 2 + (zRange * scale / 2)
      };
    case 'xz':
    default:
      return {
        x: point.x * scale + canvas.width / 2,
        y: -point.z * scale + canvas.height / 2 + (zRange * scale / 2)
      };
  }
};

// Helper to get CSS variable color and convert to RGB
export const getCssColor = (variable) => {
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  
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
      b: parseInt(match[2])
    };
  }
  
  return { r: 0, g: 59, b: 126 };
};

// Create a perturbed starting point for the butterfly effect
export const createPerturbedSeed = (originalSeed, magnitude = 1e-6) => ({
  x: originalSeed.x + (Math.random() - 0.5) * magnitude * 2,
  y: originalSeed.y + (Math.random() - 0.5) * magnitude * 2,
  z: originalSeed.z + (Math.random() - 0.5) * magnitude * 2
});
