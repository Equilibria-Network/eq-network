// src/components/Home/Lorenz/visualization/DoubleTrajectory.js
// Simplified version

import React, { useRef, useEffect } from 'react';
import { useCanvas } from '../utils/useCanvas';
import styles from '../LorenzAttractor.module.css';
import { createPerturbedSeed, getCssColor } from '../utils/lorenzUtils';

const DoubleTrajectory = ({ 
  config, 
  isPlaying,
  simulation, 
  onPlayPause, 
  onReset 
}) => {
  const containerRef = useRef(null);
  
  // Extract data from simulation
  const { pointsRef, secondaryPointsRef, initialSeed, resetSimulation } = simulation;
  
  // Get theme colors
  const primaryColor = getCssColor('--ifm-color-primary');
  const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
  const secondaryColor = isDarkTheme 
    ? { r: 255, g: 255, b: 255 } // White in dark mode
    : { r: 0, g: 0, b: 0 };      // Black in light mode
  
  // Custom config for butterfly effect visualization
  const butterflyConfig = {
    ...config,
    display: {
      ...config.display,
      showSecondaryTrajectory: true
    },
    butterfly: {
      initialSeparation: config.butterfly?.initialSeparation || 0.000001
    }
  };
  
  // Update the secondary seed point when separation changes
  useEffect(() => {
    if (initialSeed && initialSeed.current && butterflyConfig.butterfly.initialSeparation) {
      // Check if the initial separation parameter has changed
      const currentInitialSep = butterflyConfig.butterfly.initialSeparation;
      const hasInitialSepChanged = secondaryPointsRef.current && 
                                 secondaryPointsRef.current.length > 0 && 
                                 Math.abs(
                                   initialSeed.current.x - secondaryPointsRef.current[0].x
                                 ) !== currentInitialSep;
      
      // If the separation has changed, recreate the secondary trajectory
      if (hasInitialSepChanged) {
        const perturbedSeed = createPerturbedSeed(
          initialSeed.current, 
          currentInitialSep
        );
        
        // Update the first point in the secondary trajectory
        if (secondaryPointsRef.current && secondaryPointsRef.current.length > 0) {
          secondaryPointsRef.current[0] = perturbedSeed;
          
          // Reset the simulation to apply the new separation
          if (resetSimulation) {
            resetSimulation(false, true); // Only reset the secondary trajectory
          }
        }
      }
    }
  }, [butterflyConfig.butterfly.initialSeparation]);
  
  // Use canvas hook for rendering
  const { canvasRef, drawPoints } = useCanvas(containerRef, {
    config: butterflyConfig,
    pointsRef,
    secondaryPointsRef,
    colors: {
      primary: primaryColor,       // Theme color
      secondary: secondaryColor    // Black/White based on theme
    },
    showSecondaryTrajectory: true,
    lineWidth: 1.5                 // Slightly thicker lines
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
