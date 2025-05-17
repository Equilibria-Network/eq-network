// src/components/Home/Lorenz_2/visualization/DoubleTrajectory.js
/**
 * Butterfly Effect visualization component for Lorenz attractor.
 * 
 * This component renders two trajectories with very slightly different 
 * initial conditions to demonstrate the butterfly effect in chaotic systems.
 * 
 * Responsibilities:
 * - Configure simulation to track two trajectories
 * - Render both trajectories with different colors
 * - Show the divergence between initially similar paths
 * 
 * Dependencies:
 * - utils/useCanvas.js: For rendering the visualization
 */

import React, { useRef, useEffect } from 'react';
import { useCanvas } from '../utils/useCanvas';
import styles from '../LorenzAttractor.module.css';

const DoubleTrajectory = ({ 
  config, 
  isPlaying,
  simulation, // Get simulation from parent
  onPlayPause, 
  onReset 
}) => {
  const containerRef = useRef(null);
  
  // Extract pointsRef and secondaryPointsRef from simulation
  const { pointsRef, secondaryPointsRef } = simulation;
  
  // Custom config for butterfly effect visualization
  const butterflyConfig = {
    ...config,
    // We want to keep other properties, but ensure we're showing both trajectories
    display: {
      ...config.display,
      showSecondaryTrajectory: true
    }
  };
  
  // Use canvas hook for rendering
  const { canvasRef, drawPoints } = useCanvas(containerRef, {
    config: butterflyConfig,
    pointsRef,
    secondaryPointsRef,
    colors: {
      primary: { r: 0, g: 90, b: 200 },     // Blue
      secondary: { r: 0, g: 180, b: 100 }   // Green
    },
    showSecondaryTrajectory: true
  });
  
  // Force redraw when simulation state changes
  useEffect(() => {
    drawPoints();
  }, [isPlaying, drawPoints]);
  
  return (
    <div ref={containerRef} className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
};

export default DoubleTrajectory;
