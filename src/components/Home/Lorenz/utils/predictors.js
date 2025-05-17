// src/components/Home/Lorenz_2/utils/predictors.js
/**
 * Prediction algorithms for the Lorenz Attractor.
 * 
 * This file contains various prediction algorithms that can forecast
 * future states of the Lorenz system based on recent trajectory history.
 * 
 * Each predictor follows the same interface:
 * - They take the current point, system parameters, and prediction horizon
 * - They return an array of predicted future points
 * - They handle their own internal state if needed
 * 
 * Available predictors:
 * - linearPredictor: Simple linear extrapolation based on current rates
 * - (More to be added in the future)
 */

import { calculateRates } from './lorenzUtils';

/**
 * Linear predictor for Lorenz system
 * 
 * Predicts future points by linear extrapolation from the current point
 * using the instantaneous rates of change at that point.
 * 
 * @param {Object} currentPoint - {x, y, z} coordinates of current point
 * @param {Object} system - System parameters (sigma, rho, beta, dt)
 * @param {number} steps - Number of steps to predict into the future
 * @param {number} stepSize - Size of each prediction step
 * @returns {Array} Array of predicted points
 */
export const linearPredictor = (currentPoint, system, steps = 100, stepSize = 0.5) => {
  // Start with the current point
  const predictions = [];
  
  // Get the current rates of change
  const rates = calculateRates(currentPoint, system);
  
  // Create a working copy of the current point
  let point = { ...currentPoint };
  
  // Generate predictions by simple linear extrapolation
  for (let i = 0; i < steps; i++) {
    // Linear extrapolation: p_next = p + v * dt
    point = {
      x: point.x + rates.dx * system.dt * stepSize,
      y: point.y + rates.dy * system.dt * stepSize,
      z: point.z + rates.dz * system.dt * stepSize
    };
    
    predictions.push(point);
  }
  
  return predictions;
};

/**
 * Euler predictor for Lorenz system
 * 
 * Predicts future points using Euler's method, recalculating
 * rates at each step for better accuracy than simple linear prediction.
 * 
 * @param {Object} currentPoint - {x, y, z} coordinates of current point
 * @param {Object} system - System parameters (sigma, rho, beta, dt)
 * @param {number} steps - Number of steps to predict into the future
 * @param {number} stepSize - Size of each prediction step
 * @returns {Array} Array of predicted points
 */
export const eulerPredictor = (currentPoint, system, steps = 100, stepSize = 0.5) => {
  // Start with the current point
  const predictions = [];
  
  // Create a working copy of the current point
  let point = { ...currentPoint };
  
  // Generate predictions using Euler's method
  for (let i = 0; i < steps; i++) {
    // Get rates at the current point
    const rates = calculateRates(point, system);
    
    // Update point using Euler's method
    point = {
      x: point.x + rates.dx * system.dt * stepSize,
      y: point.y + rates.dy * system.dt * stepSize,
      z: point.z + rates.dz * system.dt * stepSize
    };
    
    predictions.push({ ...point });
  }
  
  return predictions;
};

/**
 * Runge-Kutta (RK4) predictor for Lorenz system
 * 
 * Predicts future points using the fourth-order Runge-Kutta method,
 * which provides much better accuracy than Euler's method.
 * 
 * @param {Object} currentPoint - {x, y, z} coordinates of current point
 * @param {Object} system - System parameters (sigma, rho, beta, dt)
 * @param {number} steps - Number of steps to predict into the future
 * @param {number} stepSize - Size of each prediction step (usually 1.0 for RK4)
 * @returns {Array} Array of predicted points
 */
export const rk4Predictor = (currentPoint, system, steps = 100, stepSize = 1.0) => {
  const predictions = [];
  let point = { ...currentPoint };
  const { sigma, rho, beta, dt } = system;
  const h = dt * stepSize;
  
  // Helper function to calculate derivatives
  const deriv = (p) => ({
    dx: sigma * (p.y - p.x),
    dy: p.x * (rho - p.z) - p.y,
    dz: p.x * p.y - beta * p.z
  });
  
  for (let i = 0; i < steps; i++) {
    // RK4 implementation
    const k1 = deriv(point);
    
    const midPoint1 = {
      x: point.x + k1.dx * h / 2,
      y: point.y + k1.dy * h / 2,
      z: point.z + k1.dz * h / 2
    };
    const k2 = deriv(midPoint1);
    
    const midPoint2 = {
      x: point.x + k2.dx * h / 2,
      y: point.y + k2.dy * h / 2,
      z: point.z + k2.dz * h / 2
    };
    const k3 = deriv(midPoint2);
    
    const endPoint = {
      x: point.x + k3.dx * h,
      y: point.y + k3.dy * h,
      z: point.z + k3.dz * h
    };
    const k4 = deriv(endPoint);
    
    // Update point using weighted average of derivatives
    point = {
      x: point.x + (k1.dx + 2*k2.dx + 2*k3.dx + k4.dx) * h / 6,
      y: point.y + (k1.dy + 2*k2.dy + 2*k3.dy + k4.dy) * h / 6,
      z: point.z + (k1.dz + 2*k2.dz + 2*k3.dz + k4.dz) * h / 6
    };
    
    predictions.push({ ...point });
  }
  
  return predictions;
};

// Dictionary of available predictors
export const PREDICTORS = {
  'linear': {
    name: 'Linear Extrapolation',
    description: 'Simplest prediction using current velocity',
    fn: linearPredictor,
    status: 'available',
    color: { r: 160, g: 160, b: 160 } // Gray color
  },
  'euler': {
    name: 'Euler Method',
    description: 'Recalculates rates at each step for better accuracy',
    fn: eulerPredictor,
    status: 'available',
    color: { r: 100, g: 180, b: 100 } // Green color
  },
  'rk4': {
    name: 'Runge-Kutta (RK4)',
    description: 'Advanced numerical method with much higher accuracy',
    fn: rk4Predictor,
    status: 'available',
    color: { r: 60, g: 140, b: 220 } // Blue color
  },
  'rnn': {
    name: 'Recurrent Neural Network',
    description: 'Machine learning approach using neural networks',
    fn: null, // Not implemented yet
    status: 'in-training',
    color: { r: 220, g: 100, b: 120 } // Red color
  },
  'esn': {
    name: 'Echo State Network',
    description: 'Reservoir computing approach for chaotic systems',
    fn: null, // Not implemented yet
    status: 'in-training',
    color: { r: 180, g: 120, b: 220 } // Purple color
  }
};

/**
 * Get a predictor by id
 * 
 * @param {string} predictorId - ID of the predictor to get
 * @returns {Object|null} Predictor object or null if not found
 */
export const getPredictor = (predictorId) => {
  return PREDICTORS[predictorId] || null;
};

/**
 * Get a list of available predictors
 * 
 * @returns {Array} List of predictor objects with their IDs
 */
export const getAvailablePredictors = () => {
  return Object.entries(PREDICTORS)
    .filter(([_, predictor]) => predictor.status === 'available')
    .map(([id, predictor]) => ({ id, ...predictor }));
};

/**
 * Get a list of all predictors, including those in training
 * 
 * @returns {Array} List of all predictor objects with their IDs
 */
export const getAllPredictors = () => {
  return Object.entries(PREDICTORS)
    .map(([id, predictor]) => ({ id, ...predictor }));
};
