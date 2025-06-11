// src/components/Home/Lorenz/visualization/MLPrediction.js
// Mathematically accurate branching predictions implementation

import React, { useRef, useState, useEffect } from 'react';
import { useCanvas } from '../utils/useCanvas';
import styles from '../LorenzAttractor.module.css';
import { getAllPredictors } from '../utils/predictors';
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
  
  // Get theme colors
  const primaryColor = getCssColor('--ifm-color-primary');
  
  // Algorithm colors - mathematically distinct and accessible
  const algorithmColors = {
    'linear': { r: 220, g: 50, b: 47 },    // Red - fails quickly
    'euler': { r: 255, g: 126, b: 0 },     // Orange - medium accuracy
    'rk4': { r: 40, g: 167, b: 69 },       // Green - high accuracy
    'predicted-rk4': { r: 138, g: 43, b: 226 }, // Purple - ML/Advanced
  };
  
  // Algorithm metadata for display
  const algorithmInfo = {
    'linear': { name: 'Linear', accuracy: 'Low', description: 'dx/dt extrapolation' },
    'euler': { name: 'Euler', accuracy: 'Medium', description: 'Forward Euler method' },
    'rk4': { name: 'RK4', accuracy: 'High', description: 'Runge-Kutta 4th order' },
    'predicted-rk4': { name: 'ML-RK4', accuracy: 'Variable', description: 'ML-enhanced prediction' }
  };
  
  // State for predictions and errors
  const [predictions, setPredictions] = useState({});
  const [predictionErrors, setPredictionErrors] = useState({});
  const [actualTrajectory, setActualTrajectory] = useState([]);
  
  // Get available predictors
  const availablePredictors = getAllPredictors().filter(p => p.status === 'available');
  
  // Generate mathematically accurate predictions
  useEffect(() => {
    if (!currentPoint || !currentRates) return;
    
    const newPredictions = {};
    const newErrors = {};
    
    // Current state for all algorithms
    const startingPoint = { ...currentPoint };
    const systemParams = config.system;
    
    // Generate predictions for each available algorithm
    availablePredictors.forEach(predictor => {
      if (predictor.fn) {
        try {
          // Generate prediction using the algorithm's mathematical model
          const prediction = predictor.fn(
            startingPoint,
            systemParams,
            predictionSteps,
            1.0 // Step size multiplier
          );
          
          newPredictions[predictor.id] = prediction;
          
          // Calculate mathematical error metrics
          if (actualTrajectory.length > 0) {
            const error = calculatePredictionError(prediction, actualTrajectory);
            newErrors[predictor.id] = error;
          } else {
            newErrors[predictor.id] = 0;
          }
          
        } catch (error) {
          console.warn(`Prediction failed for ${predictor.id}:`, error);
          newPredictions[predictor.id] = [];
          newErrors[predictor.id] = Infinity;
        }
      }
    });
    
    setPredictions(newPredictions);
    setPredictionErrors(newErrors);
    
  }, [currentPoint, currentRates, predictionSteps, config.system, actualTrajectory]);
  
  // Track actual trajectory for error calculation
  useEffect(() => {
    if (pointsRef.current && pointsRef.current.length > 0) {
      // Keep last N points for error comparison
      const recentPoints = pointsRef.current.slice(-predictionSteps);
      setActualTrajectory(recentPoints);
    }
  }, [pointsRef.current, predictionSteps]);
  
  // Calculate mathematical prediction error (Euclidean distance)
  const calculatePredictionError = (prediction, actual) => {
    if (!prediction || !actual || prediction.length === 0 || actual.length === 0) {
      return 0;
    }
    
    const minLength = Math.min(prediction.length, actual.length);
    let totalError = 0;
    
    for (let i = 0; i < minLength; i++) {
      const pred = prediction[i];
      const act = actual[i];
      
      if (pred && act) {
        const dx = pred.x - act.x;
        const dy = pred.y - act.y;
        const dz = pred.z - act.z;
        totalError += Math.sqrt(dx*dx + dy*dy + dz*dz);
      }
    }
    
    return totalError / minLength; // Average error per step
  };
  
  // Enhanced canvas rendering with branching predictions
  const { canvasRef, drawPoints } = useCanvas(containerRef, {
    config,
    pointsRef,
    branchingPredictions: predictions,
    algorithmColors,
    colors: {
      primary: primaryColor
    },
    showBranchingPredictions: true,
    lineWidth: 1.8
  });
  
  // Force redraw when predictions change
  useEffect(() => {
    drawPoints();
  }, [isPlaying, drawPoints, predictions]);
  
  // Get sorted algorithms by accuracy for display
  const sortedAlgorithms = availablePredictors
    .filter(p => predictions[p.id] && predictions[p.id].length > 0)
    .sort((a, b) => (predictionErrors[a.id] || 0) - (predictionErrors[b.id] || 0));
  
  return (
    <div ref={containerRef} className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
};

export default MLPrediction;
