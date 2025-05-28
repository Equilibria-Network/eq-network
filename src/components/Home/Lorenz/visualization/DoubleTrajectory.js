// src/components/Home/Lorenz/visualization/DoubleTrajectory.js
// Updated with better color scheme for butterfly effect

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
  
  // Get theme colors with improved secondary color
  const primaryColor = getCssColor('--ifm-color-primary');
  const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
  
  // Better secondary color scheme - vibrant green that complements the blue
  const secondaryColor = isDarkTheme 
    ? { r: 34, g: 197, b: 94 }   // Emerald green for dark mode (emerald-500)
    : { r: 16, g: 185, b: 129 }; // Emerald green for light mode (emerald-500)
  
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
  
  // Use canvas hook for rendering with improved colors
  const { canvasRef, drawPoints } = useCanvas(containerRef, {
    config: butterflyConfig,
    pointsRef,
    secondaryPointsRef,
    colors: {
      primary: primaryColor,       // Theme blue color
      secondary: secondaryColor    // Vibrant emerald green
    },
    showSecondaryTrajectory: true,
    lineWidth: 1.8                 // Slightly thicker lines for better visibility
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
