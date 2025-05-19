// src/components/Home/Lorenz/controls/ControlPanel/TabParams.js
/**
 * Parameters tab content for the Lorenz attractor control panel.
 * 
 * This component provides an interface for viewing and editing the parameters
 * of the Lorenz system. It includes both a view mode with descriptions and
 * an edit mode with sliders.
 * 
 * Responsibilities:
 * - Display current system parameters
 * - Allow parameter editing via sliders
 * - Provide parameter presets
 * - Show educational information about parameters
 * 
 * Dependencies:
 * - Receives system parameters and change handlers from parent
 */

// src/components/Home/Lorenz/controls/ControlPanel/TabParams.js
// src/components/Home/Lorenz/controls/ControlPanel/TabParams.js
import React, { useState } from 'react';
import { Info, Sliders } from 'lucide-react';
import styles from './ControlPanel.module.css';
import { getAvailablePredictors } from '../../utils/predictors';

const TabParams = ({ 
  systemParams, 
  onParamChange, 
  isEditMode, 
  setIsEditMode,
  visualizationType = 'standard',
  mlParams = {}, // New parameter for ML-specific params
  onMLParamChange = () => {} // New handler for ML-specific params
}) => {
  // Track which parameter is currently being edited directly
  const [editingParam, setEditingParam] = useState(null);
  // Store current direct input value
  const [directInputValue, setDirectInputValue] = useState('');
  
  // Format number with consistent precision
  const formatNumber = (num, precision = 2) => {
    return Number(num).toFixed(precision);
  };
  
  // Get available predictors for ML visualization
  const availablePredictors = visualizationType === 'ml-prediction' 
    ? getAvailablePredictors() 
    : [];
    
  // Handle direct input change
  const handleDirectInputChange = (e) => {
    setDirectInputValue(e.target.value);
  };
  
  // Handle direct input submit
  const handleDirectInputSubmit = (param) => {
    if (directInputValue.trim() === '') return;
    
    const value = parseFloat(directInputValue);
    if (!isNaN(value)) {
      if (param === 'predictor') {
        onMLParamChange('predictor', directInputValue);
      } else if (param === 'steps') {
        onMLParamChange('steps', value);
      } else if (param === 'separation') {
        // This would be implemented when we add initial separation control
        // onMLParamChange('separation', value);
      } else {
        onParamChange(param, value);
      }
    }
    
    setEditingParam(null);
    setDirectInputValue('');
  };
  
  // Handle clicking on a parameter value to edit it directly
  const handleParamClick = (param, currentValue) => {
    setEditingParam(param);
    setDirectInputValue(param === 'predictor' ? currentValue : formatNumber(currentValue, 4));
  };
  
  // Handle key press in direct input field
  const handleKeyPress = (e, param) => {
    if (e.key === 'Enter') {
      handleDirectInputSubmit(param);
    } else if (e.key === 'Escape') {
      setEditingParam(null);
      setDirectInputValue('');
    }
  };
  
  // Render each parameter item
  const renderParamItem = (name, symbol, value, description, min, max, step, onChange, precision = 2) => {
    const isEditing = editingParam === name;
    
    return (
      <div className={styles.paramItem}>
        <div className={styles.paramHeader}>
          <div className={styles.paramName}>
            {symbol && <span className={styles.paramSymbol}>{symbol}</span>}
            <span className={styles.paramFullName}>{name}</span>
          </div>
          
          {isEditing ? (
            <input
              type="text"
              value={directInputValue}
              onChange={handleDirectInputChange}
              onBlur={() => handleDirectInputSubmit(name)}
              onKeyDown={(e) => handleKeyPress(e, name)}
              className={styles.paramDirectInput}
              autoFocus
            />
          ) : (
            <div 
              className={styles.paramValue}
              onClick={() => handleParamClick(name, value)}
              title="Click to edit directly"
            >
              {formatNumber(value, precision)}
            </div>
          )}
        </div>
        
        {isEditMode && !isEditing ? (
          <div className={styles.paramSlider}>
            <input 
              type="range" 
              min={min} 
              max={max} 
              step={step} 
              value={value} 
              onChange={(e) => onChange(name, parseFloat(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.sliderRange}>
              <span>{min}</span>
              <span>{max}</span>
            </div>
          </div>
        ) : !isEditing ? (
          <div className={styles.paramInfo}>
            {description}
          </div>
        ) : null}
      </div>
    );
  };
  
  // Render visualization-specific parameters first
  const renderVisualizationSpecificParams = () => {
    switch (visualizationType) {
      case 'butterfly-effect':
        return (
          <>
            <div className={styles.paramSectionTitle}>Butterfly Effect Settings</div>
            {renderParamItem(
              'separation',
              null,
              0.000001, // This would be pulled from actual state when implemented
              'Initial separation between the two trajectories. Even a tiny difference leads to completely different paths over time.',
              0.0000001,
              0.001,
              0.0000001,
              () => {}, // This would be implemented when we add the parameter
              7
            )}
            <div className={styles.sectionDivider}></div>
          </>
        );
        
      case 'ml-prediction':
        return (
          <>
            <div className={styles.paramSectionTitle}>ML Prediction Settings</div>
            
            {/* Prediction Algorithm */}
            <div className={styles.paramItem}>
              <div className={styles.paramHeader}>
                <div className={styles.paramName}>
                  <span className={styles.paramFullName}>prediction algorithm</span>
                </div>
                {editingParam === 'predictor' ? (
                  <input
                    type="text"
                    value={directInputValue}
                    onChange={handleDirectInputChange}
                    onBlur={() => handleDirectInputSubmit('predictor')}
                    onKeyDown={(e) => handleKeyPress(e, 'predictor')}
                    className={styles.paramDirectInput}
                    autoFocus
                  />
                ) : (
                  <div 
                    className={styles.paramValue}
                    onClick={() => handleParamClick('predictor', availablePredictors.find(p => p.id === mlParams.predictorId)?.name || 'RK4')}
                    title="Click to select algorithm"
                  >
                    {availablePredictors.find(p => p.id === mlParams.predictorId)?.name || 'RK4'}
                  </div>
                )}
              </div>
              
              {isEditMode && !editingParam ? (
                <div className={styles.algorithmSelector}>
                  <div className={styles.algorithmButtons}>
                    {availablePredictors.map(predictor => (
                      <button
                        key={predictor.id}
                        className={`${styles.algorithmButton} ${mlParams.predictorId === predictor.id ? styles.activeAlgorithm : ''}`}
                        onClick={() => onMLParamChange('predictor', predictor.id)}
                      >
                        {predictor.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : !editingParam ? (
                <div className={styles.paramInfo}>
                  The algorithm used to predict future states of the system. Different methods have varying accuracy and computational efficiency.
                </div>
              ) : null}
            </div>
            
            {/* Prediction Steps */}
            {renderParamItem(
              'steps',
              null,
              mlParams.predictionSteps || 50,
              'How far into the future to predict. In chaotic systems like this, predictions become increasingly unreliable as the horizon increases.',
              10,
              200,
              10,
              (_, value) => onMLParamChange('steps', value),
              0
            )}
            
            <div className={styles.sectionDivider}></div>
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={styles.tabContent}>
      <div className={styles.paramTabHeader}>
        <div className={styles.paramTitle}>
          <div className={styles.sectionTitle}>System Parameters</div>
          <p className={styles.paramDescription}>
            {isEditMode ? 'Click on values to edit directly or use sliders' : 'Control the behavior of the Lorenz system'}
          </p>
        </div>
        
        <button 
          onClick={() => setIsEditMode(!isEditMode)}
          className={`${styles.editModeToggle} ${isEditMode ? styles.activeEditMode : ''}`}
          title={isEditMode ? "View Description Mode" : "Edit Mode"}
          aria-label={isEditMode ? "View Description Mode" : "Edit Mode"}
        >
          {isEditMode ? (
            <>
              <Info size={14} />
              <span className={styles.toggleLabel}>Info</span>
            </>
          ) : (
            <>
              <Sliders size={14} />
              <span className={styles.toggleLabel}>Edit</span>
            </>
          )}
        </button>
      </div>
      
      <div className={styles.paramsContainer}>
        {/* Render visualization-specific parameters first */}
        {renderVisualizationSpecificParams()}
        
        {/* Standard system parameters */}
        <div className={styles.paramSectionTitle}>System Parameters</div>
        
        {/* Sigma */}
        {renderParamItem(
          'sigma',
          'σ',
          systemParams.sigma,
          'Controls fluid viscosity and mixing rate. Higher values create more turbulence and faster mixing.',
          1,
          20,
          0.1,
          onParamChange
        )}
        
        {/* Rho */}
        {renderParamItem(
          'rho',
          'ρ',
          systemParams.rho,
          'Energy input parameter. The critical value of 24.74 is a bifurcation point where the system transitions to chaotic behavior.',
          0.1,
          50,
          0.1,
          onParamChange
        )}
        
        {/* Beta */}
        {renderParamItem(
          'beta',
          'β',
          systemParams.beta,
          'Determines spatial scaling. The classic value of 8/3 (≈2.67) creates the iconic butterfly shape of the Lorenz attractor.',
          0.5,
          10,
          0.1,
          onParamChange
        )}
        
        {/* Time Step */}
        {renderParamItem(
          'dt',
          'dt',
          systemParams.dt,
          'Integration time step. Smaller values produce more accurate simulations but run slower.',
          0.0001,
          0.01,
          0.0001,
          onParamChange,
          4
        )}
        
        {/* Noise */}
        {renderParamItem(
          'noise',
          null,
          systemParams.noise,
          'Random fluctuation magnitude that simulates small perturbations found in real-world systems.',
          0,
          0.001,
          0.00001,
          onParamChange,
          6
        )}
        
        {/* Points Per Frame */}
        {renderParamItem(
          'pointsPerFrame',
          null,
          systemParams.pointsPerFrame || 1,
          'Animation speed - number of points calculated per frame. Higher values make the simulation run faster.',
          1,
          5,
          1,
          onParamChange,
          0
        )}
        
        {/* Presets section - shown only in edit mode */}
        {isEditMode && (
          <div className={styles.presetsSection}>
            <div className={styles.presetsHeader}>Parameter Presets</div>
            <div className={styles.presetButtons}>
              <button 
                className={styles.presetButton}
                onClick={() => {
                  onParamChange('sigma', 10);
                  onParamChange('rho', 28);
                  onParamChange('beta', 8/3);
                  onParamChange('dt', 0.004);
                  onParamChange('noise', 0.00005);
                  onParamChange('pointsPerFrame', 2);
                }}
              >
                <span className={styles.presetName}>Classic</span>
                <span className={styles.presetDescription}>The original Lorenz values</span>
              </button>
              
              <button 
                className={styles.presetButton}
                onClick={() => {
                  onParamChange('sigma', 14);
                  onParamChange('rho', 45);
                  onParamChange('beta', 3);
                  onParamChange('dt', 0.002);
                  onParamChange('noise', 0.0001);
                  onParamChange('pointsPerFrame', 1);
                }}
              >
                <span className={styles.presetName}>High Energy</span>
                <span className={styles.presetDescription}>Increased turbulence</span>
              </button>
              
              <button 
                className={styles.presetButton}
                onClick={() => {
                  onParamChange('sigma', 5);
                  onParamChange('rho', 15);
                  onParamChange('beta', 2);
                  onParamChange('dt', 0.005);
                  onParamChange('noise', 0.0002);
                  onParamChange('pointsPerFrame', 2);
                }}
              >
                <span className={styles.presetName}>Gentle Flow</span>
                <span className={styles.presetDescription}>Smoother transitions</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Critical Values Note - only shown in info mode */}
      {!isEditMode && (
        <div className={styles.criticalValuesNote}>
          <div className={styles.noteIcon}>
            <Info size={16} />
          </div>
          <div className={styles.noteContent}>
            <span className={styles.noteTitle}>Key Insight:</span> When ρ exceeds 24.74, the system transitions from stable to chaotic behavior.
          </div>
        </div>
      )}
    </div>
  );
};

export default TabParams;
