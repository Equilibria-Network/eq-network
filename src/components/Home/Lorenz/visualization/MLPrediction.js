// src/components/Home/Lorenz_2/visualization/MLPrediction.js
/**
 * Machine Learning Prediction visualization for Lorenz attractor.
 * 
 * This component shows the Lorenz attractor with an additional "shadow"
 * trajectory that represents ML-based prediction of future system states.
 * The prediction becomes less accurate the further into the future it goes,
 * visually demonstrating the limits of prediction in chaotic systems.
 * 
 * Responsibilities:
 * - Simulate the actual Lorenz system trajectory
 * - Generate predictions based on selected algorithm
 * - Visualize both the actual and predicted trajectories
 * - Allow users to select prediction algorithms
 * - Show prediction accuracy metrics
 * 
 * Dependencies:
 * - utils/lorenzUtils.js: For trajectory calculations
 * - utils/predictors.js: For prediction algorithms
 * - utils/useCanvas.js: For rendering the visualization
 */

// src/components/Home/Lorenz/visualization/MLPrediction.js
import React, { useRef, useState, useEffect } from 'react';
import { useCanvas } from '../utils/useCanvas';
import styles from '../LorenzAttractor.module.css';
import { getAvailablePredictors, getAllPredictors } from '../utils/predictors';
import { projectPoint } from '../utils/lorenzUtils';

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
  
  // Local state for prediction rendering
  const [predictionStepSize, setPredictionStepSize] = useState(1.0);
  const [endpointMarkerPosition, setEndpointMarkerPosition] = useState({ x: 0, y: 0 });
  const [showEndpointMarker, setShowEndpointMarker] = useState(false);
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
    
    // Calculate the position of the endpoint marker (last prediction point)
    if (predictions.length > 0 && canvasRef.current) {
      const endPoint = predictions[predictions.length - 1];
      const canvas = canvasRef.current;
      const projectedPoint = projectPoint(
        endPoint,
        canvas,
        config.display.bounds,
        'xz', // Use the default perspective
        config.animation.padding
      );
      
      setEndpointMarkerPosition({
        x: projectedPoint.x,
        y: projectedPoint.y
      });
      
      setShowEndpointMarker(true);
    } else {
      setShowEndpointMarker(false);
    }
  }, [currentPoint, currentRates, predictorId, predictionSteps, predictionStepSize, config.system]);
  
  // Use canvas hook for rendering
  const { canvasRef, drawPoints } = useCanvas(containerRef, {
    config: mlConfig,
    pointsRef,
    predictionPointsRef: { current: predictionPoints },
    colors: {
      primary: { r: 0, g: 90, b: 200 },    // Blue for actual trajectory
      prediction: currentPredictor?.color || { r: 150, g: 150, b: 150 } // Color based on predictor
    },
    showPrediction: true
  });
  
  // Force redraw when simulation or prediction state changes
  useEffect(() => {
    drawPoints();
  }, [isPlaying, drawPoints, predictionPoints]);
  
  return (
    <div ref={containerRef} className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
      
      {/* Prediction endpoint marker */}
      {showEndpointMarker && (
        <div 
          className={styles.predictionEndpoint}
          style={{
            left: `${endpointMarkerPosition.x}px`,
            top: `${endpointMarkerPosition.y}px`
          }}
          title={`Prediction endpoint at ${predictionSteps} steps`}
        />
      )}
    </div>
  );
};

export default MLPrediction;
