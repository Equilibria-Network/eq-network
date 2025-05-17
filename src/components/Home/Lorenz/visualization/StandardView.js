// src/components/Home/Lorenz_2/visualization/StandardView.js
/**
 * Standard visualization component for Lorenz attractor.
 * 
 * This component renders the standard single-trajectory Lorenz attractor
 * visualization, serving as the default and simplest view.
 * 
 * Responsibilities:
 * - Render the standard Lorenz attractor trajectory
 * - Use the shared simulation instance from the parent component
 * - Provide the foundation for other visualization types to extend
 * 
 * Dependencies:
 * - utils/useCanvas.js: For rendering the visualization
 */

import React, { useRef, useEffect } from 'react';
import { useCanvas } from '../utils/useCanvas';
import styles from '../LorenzAttractor.module.css';

const StandardView = ({ 
  config = {}, 
  isPlaying = true,
  simulation, // Get simulation from parent
  onPlayPause = () => {}, 
  onReset = () => {} 
}) => {
  const containerRef = useRef(null);
  
  // Extract pointsRef from simulation
  const { pointsRef } = simulation;
  
  // Use canvas hook for rendering
  const { canvasRef, drawPoints } = useCanvas(containerRef, {
    config,
    pointsRef,
    colors: {
      primary: { r: 0, g: 90, b: 200 }  // Blue for standard view
    }
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

export default StandardView;
