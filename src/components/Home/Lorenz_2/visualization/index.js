// src/components/Home/Lorenz/visualization/index.js
/**
 * Visualization components for Lorenz attractor.
 * 
 * This file exports various visualization types for the Lorenz attractor,
 * making them available to the main component. Each visualization focuses
 * on a different aspect of the system's behavior.
 * 
 * Exported components:
 * - StandardView: Basic single-trajectory visualization
 * - DoubleTrajectory: Butterfly effect demonstration
 * - MLPrediction: Machine learning prediction visualization
 */

import StandardView from './StandardView';
import DoubleTrajectory from './DoubleTrajectory';
import MLPrediction from './MLPrediction';

export {
  StandardView,
  DoubleTrajectory,
  MLPrediction
};

// Map of visualization types to their display names
export const visualizationTypes = {
  'standard': 'Standard',
  'butterfly-effect': 'Butterfly Effect',
  'ml-prediction': 'ML Prediction'
};
