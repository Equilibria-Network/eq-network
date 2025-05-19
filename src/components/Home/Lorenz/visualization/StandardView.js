// src/components/Home/Lorenz/visualization/StandardView.js
// Simplified version

import React, { useRef, useEffect } from 'react';
import { useCanvas } from '../utils/useCanvas';
import styles from '../LorenzAttractor.module.css';
import { getCssColor } from '../utils/lorenzUtils';

const StandardView = ({ 
  config = {}, 
  isPlaying = true,
  simulation, 
  onPlayPause = () => {}, 
  onReset = () => {} 
}) => {
  const containerRef = useRef(null);
  
  // Extract pointsRef from simulation
  const { pointsRef } = simulation;
  
  // Get theme color
  const primaryColor = getCssColor('--ifm-color-primary');
  
  // Use canvas hook for rendering
  const { canvasRef, drawPoints } = useCanvas(containerRef, {
    config,
    pointsRef,
    colors: {
      primary: primaryColor  // Theme color
    },
    lineWidth: 1.5          // Slightly thicker lines
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
