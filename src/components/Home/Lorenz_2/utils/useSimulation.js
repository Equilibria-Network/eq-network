// src/components/Home/Lorenz_2/utils/useSimulation.js
/**
 * Custom hook for managing Lorenz attractor simulation state.
 * 
 * This hook encapsulates the simulation logic for the Lorenz attractor,
 * including state management, animation loop, and trajectory calculations.
 * It separates the simulation concerns from rendering and UI.
 * 
 * Responsibilities:
 * - Manages simulation state (points, parameters)
 * - Handles animation timing and frame updates
 * - Calculates trajectories for both primary and secondary points
 * - Provides play/pause and reset functionality
 * - Exposes simulation data for rendering
 * 
 * Dependencies:
 * - lorenzUtils.js: For calculation functions and system parameters
 */

import { useState, useRef, useEffect } from 'react';
import { 
  LORENZ_CONFIG, 
  createInitialSeed, 
  createPerturbedSeed,
  calculateNext, 
  calculateRates, 
  preCalculatePoints 
} from './lorenzUtils';

// Export the hook function directly (no default export)
export function useSimulation(initialConfig = LORENZ_CONFIG) {
  // Configuration state
  const [config, setConfig] = useState(initialConfig);
  
  // Animation state
  const [isPlaying, setIsPlaying] = useState(true);
  const [transitionComplete, setTransitionComplete] = useState(false);
  
  // Frame tracking
  const requestRef = useRef(null);
  const frameCountRef = useRef(0);
  
  // Points tracking
  const initialSeed = useRef(createInitialSeed());
  const pointsRef = useRef([initialSeed.current]);
  const secondaryPointsRef = useRef([createPerturbedSeed(initialSeed.current, 1e-6)]);
  
  // Current state for display
  const [currentPoint, setCurrentPoint] = useState({
    x: initialSeed.current.x,
    y: initialSeed.current.y,
    z: initialSeed.current.z
  });
  
  const [currentRates, setCurrentRates] = useState({
    dx: 0, dy: 0, dz: 0
  });
  
  // System parameters state (for UI and API)
  const [systemParams, setSystemParams] = useState({
    sigma: config.system.sigma,
    rho: config.system.rho,
    beta: config.system.beta,
    dt: config.system.dt,
    noise: config.system.noise,
    pointsPerFrame: config.animation.pointsPerFrame
  });
  
  // Initialize with pre-calculated points
  useEffect(() => {
    // Pre-calculate initial points to start with
    pointsRef.current = preCalculatePoints(
      initialSeed.current,
      config.system,
      config.animation.initialPoints,
      config.animation.initialSpeed
    );
    
    secondaryPointsRef.current = preCalculatePoints(
      secondaryPointsRef.current[0],
      config.system,
      config.animation.initialPoints,
      config.animation.initialSpeed
    );
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);
  
  // Animation frame function
  const animate = () => {
    if (!isPlaying) return;
    
    // Only increment frame count during transition
    if (!transitionComplete) {
      frameCountRef.current++;
    }
    
    // Calculate speed multiplier for transition period
    let speedMultiplier = 1;
    if (!transitionComplete && frameCountRef.current < config.animation.transitionFrames) {
      speedMultiplier = config.animation.initialSpeed - 
        (config.animation.initialSpeed - 1) * 
        (frameCountRef.current / config.animation.transitionFrames);
    } else if (!transitionComplete) {
      // Mark transition as complete once frames exceed threshold
      setTransitionComplete(true);
    }

    // Calculate new points for primary trajectory
    for(let i = 0; i < config.animation.pointsPerFrame; i++) {
      const current = pointsRef.current[pointsRef.current.length - 1];
      const next = calculateNext(current, config.system, speedMultiplier);
      pointsRef.current.push(next);
      
      // Calculate new points for secondary trajectory
      const secondaryCurrent = secondaryPointsRef.current[secondaryPointsRef.current.length - 1];
      const secondaryNext = calculateNext(secondaryCurrent, config.system, speedMultiplier);
      secondaryPointsRef.current.push(secondaryNext);
    }
    
    // Limit number of points to avoid memory issues
    if (pointsRef.current.length > config.animation.maxPoints) {
      pointsRef.current = pointsRef.current.slice(-config.animation.maxPoints);
      secondaryPointsRef.current = secondaryPointsRef.current.slice(-config.animation.maxPoints);
    }

    // Update current point and rates for display
    const current = pointsRef.current[pointsRef.current.length - 1];
    if (current) {
      // Update current point
      setCurrentPoint({
        x: current.x,
        y: current.y,
        z: current.z
      });
      
      // Calculate and update rates
      const rates = calculateRates(current, config.system);
      setCurrentRates({
        dx: rates.dx,
        dy: rates.dy,
        dz: rates.dz
      });
    }
    
    // Schedule next frame
    requestRef.current = requestAnimationFrame(animate);
  };
  
  // Handle play/pause state changes
  useEffect(() => {
    // First clear any existing animation frame
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    
    // Then start animation if playing
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [isPlaying, config]);
  
  // Handle parameter changes
  const handleParamChange = (param, value) => {
    // Update the system parameters in config
    setConfig(prev => {
      const newConfig = { ...prev };
      
      // Update in the appropriate section
      if (param === 'pointsPerFrame') {
        newConfig.animation = {
          ...prev.animation,
          pointsPerFrame: value
        };
      } else {
        newConfig.system = {
          ...prev.system,
          [param]: value
        };
      }
      
      return newConfig;
    });
    
    // Update systemParams state for display
    setSystemParams(prev => ({
      ...prev,
      [param]: value
    }));
  };
  
  // Reset the simulation
  const resetSimulation = () => {
    // Reset to default parameters if desired
    // setSystemParams({ /* defaults */ });
    
    // Create new seed
    const newSeed = createInitialSeed();
    initialSeed.current = newSeed;
    
    // Update current point with raw values
    setCurrentPoint({
      x: newSeed.x,
      y: newSeed.y,
      z: newSeed.z
    });
    
    // Reset points and frame count
    pointsRef.current = [newSeed];
    secondaryPointsRef.current = [createPerturbedSeed(newSeed, 1e-6)];
    frameCountRef.current = 0;
    
    // Reset transition state
    setTransitionComplete(false);
    
    // Pre-calculate points
    pointsRef.current = preCalculatePoints(
      newSeed,
      config.system,
      config.animation.initialPoints,
      config.animation.initialSpeed
    );
    
    secondaryPointsRef.current = preCalculatePoints(
      secondaryPointsRef.current[0],
      config.system,
      config.animation.initialPoints,
      config.animation.initialSpeed
    );
  };
  
  return {
    // State
    config,
    systemParams,
    isPlaying,
    currentPoint,
    currentRates,
    
    // Point arrays (as refs for performance)
    pointsRef,
    secondaryPointsRef,
    
    // Actions
    togglePlayPause: () => setIsPlaying(prev => !prev),
    resetSimulation,
    handleParamChange
  };
}

// Also provide a default export for backward compatibility
export default useSimulation;
