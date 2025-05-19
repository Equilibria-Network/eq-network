// src/components/Home/Lorenz/visualization/MLPrediction.js
// Simplified version

import React, { useRef, useState, useEffect } from 'react';
import { useCanvas } from '../utils/useCanvas';
import styles from '../LorenzAttractor.module.css';
import { getAvailablePredictors, getAllPredictors } from '../utils/predictors';
import { getCssColor } from '../utils/lorenzUtils';

const MLPrediction = ({ 
  config, 
  isPlaying,
  simulation,
  predictorId = 'rk4',
  predictionSteps = 50
}) => {
  const containerRef = useRef(null);
  
  // Extract values from shared simulation
  const { pointsRef, currentPoint, currentRates } = simulation;
  
  // Check for dark theme
  const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
  
  // Get theme color
  const primaryColor = getCssColor('--ifm-color-primary');
  const predictionColor = isDarkTheme 
    ? { r: 255, g: 255, b: 255 } // White in dark mode
    : { r: 0, g: 0, b: 0 };      // Black in light mode
  
  // Local state for prediction rendering
  const [predictionStepSize, setPredictionStepSize] = useState(1.0);
  const [predictionPoints, setPredictionPoints] = useState([]);
  
  // Get current predictor
  const allPredictors = getAllPredictors();
  const currentPredictor = allPredictors.find(p => p.id === predictorId) || 
                           getAvailablePredictors()[0];
  
  // Custom config for ML prediction visualization
  const mlConfig = {
    ...config,
    display: {
      ...config.display,
      showPrediction: true
    }
  };
  
  // Update prediction when current point or predictor changes
  useEffect(() => {
    if (!currentPoint || !currentPredictor || currentPredictor.status !== 'available') return;
    
    // Get prediction function
    const predictFn = currentPredictor.fn;
    if (!predictFn) return;
    
    // Generate prediction
    const predictions = predictFn(
      currentPoint, 
      config.system,
      predictionSteps,
      predictionStepSize
    );
    
    setPredictionPoints(predictions);
  }, [currentPoint, currentRates, predictorId, predictionSteps, predictionStepSize, config.system]);
  
  // Use canvas hook for rendering
  const { canvasRef, drawPoints } = useCanvas(containerRef, {
    config: mlConfig,
    pointsRef,
    predictionPointsRef: { current: predictionPoints },
    colors: {
      primary: primaryColor,     // Theme color
      prediction: predictionColor// Black/White based on theme
    },
    showPrediction: true,
    lineWidth: 1.5              // Slightly thicker lines
  });
  
  // Force redraw when simulation or prediction state changes
  useEffect(() => {
    drawPoints();
  }, [isPlaying, drawPoints, predictionPoints]);
  
  return (
    <div ref={containerRef} className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
};

export default MLPrediction;
