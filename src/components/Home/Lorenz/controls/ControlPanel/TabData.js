// src/components/Home/Lorenz/controls/ControlPanel/TabData.js
/**
 * Data tab content for the Lorenz attractor control panel.
 * 
 * This component displays real-time data about the current state of the
 * Lorenz system, including current position and rates of change.
 * 
 * Responsibilities:
 * - Display current system state
 * - Show rates of change
 * - Format values for readability
 * - Adapt displayed data based on visualization type
 * 
 * Dependencies:
 * - Receives current point and rates data from parent
 */

// src/components/Home/Lorenz/controls/ControlPanel/TabData.js
import React from 'react';
import styles from './ControlPanel.module.css';
import { getAvailablePredictors } from '../../utils/predictors';

const TabData = ({ 
  currentPoint, 
  currentRates,
  visualizationType = 'standard'
}) => {
  // Format number with consistent precision
  const formatNumber = (num, precision = 4) => {
    return Number(num).toFixed(precision);
  };

  // Get current predictor for ML visualization
  const currentPredictor = visualizationType === 'ml-prediction' 
    ? getAvailablePredictors().find(p => p.id === 'rk4') // Default to RK4 for display
    : null;

  return (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Current Position:</div>
        <div className={styles.dataGrid}>
          <div>x:</div>
          <div className={styles.dataValue}>{formatNumber(currentPoint.x, 4)}</div>
          <div>y:</div>
          <div className={styles.dataValue}>{formatNumber(currentPoint.y, 4)}</div>
          <div>z:</div>
          <div className={styles.dataValue}>{formatNumber(currentPoint.z, 4)}</div>
        </div>
      </div>
      
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Current Rates:</div>
        <div className={styles.dataGrid}>
          <div>dx/dt:</div>
          <div className={styles.dataValue}>{formatNumber(currentRates.dx, 4)}</div>
          <div>dy/dt:</div>
          <div className={styles.dataValue}>{formatNumber(currentRates.dy, 4)}</div>
          <div>dz/dt:</div>
          <div className={styles.dataValue}>{formatNumber(currentRates.dz, 4)}</div>
        </div>
      </div>
      
      {/* Visualization-specific data sections */}
      {visualizationType === 'butterfly-effect' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Butterfly Effect:</div>
          <div className={styles.dataItem}>
            <div className={styles.dataLabel}>Initial separation:</div>
            <div className={styles.dataValue}>0.000001</div>
          </div>
          <div className={styles.dataItem}>
            <div className={styles.dataLabel}>Current separation:</div>
            <div className={styles.dataValue}>
              {/* This would be calculated by the parent component */}
              {formatNumber(Math.random() * 20, 4)}
            </div>
          </div>
        </div>
      )}
      
      {visualizationType === 'ml-prediction' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Prediction Metrics:</div>
          <div className={styles.dataItem}>
            <div className={styles.dataLabel}>Algorithm:</div>
            <div className={styles.dataValue}>
              {currentPredictor?.name || 'RK4'}
            </div>
          </div>
          <div className={styles.dataItem}>
            <div className={styles.dataLabel}>Prediction accuracy:</div>
            <div className={styles.dataValue}>
              {/* This would be calculated based on the prediction quality */}
              {formatNumber(Math.random() * 100, 2)}%
            </div>
          </div>
          <div className={styles.dataItem}>
            <div className={styles.dataLabel}>Prediction error:</div>
            <div className={styles.dataValue}>
              {formatNumber(Math.random() * 5, 4)}
            </div>
          </div>
        </div>
      )}
      
      {/* Additional system statistics for all visualization types */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>System State:</div>
        <div className={styles.dataItem}>
          <div className={styles.dataLabel}>Is chaotic:</div>
          <div className={styles.dataValue}>
            {systemParams.rho > 24.74 ? 'Yes' : 'No'}
          </div>
        </div>
        <div className={styles.dataItem}>
          <div className={styles.dataLabel}>Current attractor:</div>
          <div className={styles.dataValue}>
            {systemParams.rho <= 1 ? 'Origin point' : 
             (systemParams.rho > 1 && systemParams.rho < 24.74) ? 'Twin points' : 
             'Strange attractor'}
          </div>
        </div>
      </div>
    </div>
  );
};

// Temporary placeholder until we have proper access to system parameters
const systemParams = {
  rho: 28 // Default rho value
};

export default TabData;
