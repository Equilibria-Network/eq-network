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
import React from 'react';
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
  // Format number with consistent precision
  const formatNumber = (num, precision = 2) => {
    return Number(num).toFixed(precision);
  };
  
  // Get available predictors for ML visualization
  const availablePredictors = visualizationType === 'ml-prediction' 
    ? getAvailablePredictors() 
    : [];
  
  return (
    <div className={styles.tabContent}>
      <div className={styles.paramTabHeader}>
        <div className={styles.paramTitle}>
          <div className={styles.sectionTitle}>System Parameters</div>
          <p className={styles.paramDescription}>
            Control the behavior of the Lorenz system
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
        {/* Parameter: Sigma */}
        <div className={styles.paramItem}>
          <div className={styles.paramHeader}>
            <div className={styles.paramName}>
              <span className={styles.paramSymbol}>σ</span>
              <span className={styles.paramFullName}>sigma</span>
            </div>
            <div className={styles.paramValue}>{formatNumber(systemParams.sigma, 2)}</div>
          </div>
          
          {isEditMode ? (
            <div className={styles.paramSlider}>
              <input 
                type="range" 
                min="1" 
                max="20" 
                step="0.1" 
                value={systemParams.sigma} 
                onChange={(e) => onParamChange('sigma', parseFloat(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.sliderRange}>
                <span>1</span>
                <span>20</span>
              </div>
            </div>
          ) : (
            <div className={styles.paramInfo}>
              Controls fluid viscosity and mixing rate. Higher values create more turbulence and faster mixing.
            </div>
          )}
        </div>
        
        {/* Parameter: Rho */}
        <div className={styles.paramItem}>
          <div className={styles.paramHeader}>
            <div className={styles.paramName}>
              <span className={styles.paramSymbol}>ρ</span>
              <span className={styles.paramFullName}>rho</span>
            </div>
            <div className={styles.paramValue}>{formatNumber(systemParams.rho, 2)}</div>
          </div>
          
          {isEditMode ? (
            <div className={styles.paramSlider}>
              <input 
                type="range" 
                min="0.1" 
                max="50" 
                step="0.1" 
                value={systemParams.rho} 
                onChange={(e) => onParamChange('rho', parseFloat(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.sliderRange}>
                <span>0.1</span>
                <span>50</span>
              </div>
            </div>
          ) : (
            <div className={styles.paramInfo}>
              Energy input parameter. The critical value of 24.74 is a bifurcation point where the system transitions to chaotic behavior.
            </div>
          )}
        </div>
        
        {/* Parameter: Beta */}
        <div className={styles.paramItem}>
          <div className={styles.paramHeader}>
            <div className={styles.paramName}>
              <span className={styles.paramSymbol}>β</span>
              <span className={styles.paramFullName}>beta</span>
            </div>
            <div className={styles.paramValue}>{formatNumber(systemParams.beta, 2)}</div>
          </div>
          
          {isEditMode ? (
            <div className={styles.paramSlider}>
              <input 
                type="range" 
                min="0.5" 
                max="10" 
                step="0.1" 
                value={systemParams.beta} 
                onChange={(e) => onParamChange('beta', parseFloat(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.sliderRange}>
                <span>0.5</span>
                <span>10</span>
              </div>
            </div>
          ) : (
            <div className={styles.paramInfo}>
              Determines spatial scaling. The classic value of 8/3 (≈2.67) creates the iconic butterfly shape of the Lorenz attractor.
            </div>
          )}
        </div>
        
        {/* Parameter: Time Step */}
        <div className={styles.paramItem}>
          <div className={styles.paramHeader}>
            <div className={styles.paramName}>
              <span className={styles.paramSymbol}>dt</span>
              <span className={styles.paramFullName}>time step</span>
            </div>
            <div className={styles.paramValue}>{formatNumber(systemParams.dt, 4)}</div>
          </div>
          
          {isEditMode ? (
            <div className={styles.paramSlider}>
              <input 
                type="range" 
                min="0.0001" 
                max="0.01" 
                step="0.0001" 
                value={systemParams.dt} 
                onChange={(e) => onParamChange('dt', parseFloat(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.sliderRange}>
                <span>0.0001</span>
                <span>0.01</span>
              </div>
            </div>
          ) : (
            <div className={styles.paramInfo}>
              Integration time step. Smaller values produce more accurate simulations but run slower.
            </div>
          )}
        </div>
        
        {/* Parameter: Noise */}
        <div className={styles.paramItem}>
          <div className={styles.paramHeader}>
            <div className={styles.paramName}>
              <span className={styles.paramFullName}>noise</span>
            </div>
            <div className={styles.paramValue}>{formatNumber(systemParams.noise, 6)}</div>
          </div>
          
          {isEditMode ? (
            <div className={styles.paramSlider}>
              <input 
                type="range" 
                min="0" 
                max="0.001" 
                step="0.00001" 
                value={systemParams.noise} 
                onChange={(e) => onParamChange('noise', parseFloat(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.sliderRange}>
                <span>0</span>
                <span>0.001</span>
              </div>
            </div>
          ) : (
            <div className={styles.paramInfo}>
              Random fluctuation magnitude that simulates small perturbations found in real-world systems.
            </div>
          )}
        </div>
        
        {/* Parameter: Points Per Frame */}
        <div className={styles.paramItem}>
          <div className={styles.paramHeader}>
            <div className={styles.paramName}>
              <span className={styles.paramFullName}>points per frame</span>
            </div>
            <div className={styles.paramValue}>{systemParams.pointsPerFrame || 1}</div>
          </div>
          
          {isEditMode ? (
            <div className={styles.paramSlider}>
              <input 
                type="range" 
                min="1" 
                max="5" 
                step="1" 
                value={systemParams.pointsPerFrame || 1} 
                onChange={(e) => onParamChange('pointsPerFrame', parseInt(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.sliderRange}>
                <span>1</span>
                <span>5</span>
              </div>
            </div>
          ) : (
            <div className={styles.paramInfo}>
              Animation speed - number of points calculated per frame. Higher values make the simulation run faster.
            </div>
          )}
        </div>
        
        {/* ML Prediction specific parameters */}
        {visualizationType === 'ml-prediction' && (
          <>
            <div className={styles.sectionDivider}></div>
            <div className={styles.paramSectionTitle}>ML Prediction Settings</div>
            
            {/* Parameter: Prediction Algorithm */}
            <div className={styles.paramItem}>
              <div className={styles.paramHeader}>
                <div className={styles.paramName}>
                  <span className={styles.paramFullName}>prediction algorithm</span>
                </div>
                <div className={styles.paramValue}>
                  {availablePredictors.find(p => p.id === mlParams.predictorId)?.name || 'RK4'}
                </div>
              </div>
              
              {isEditMode ? (
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
              ) : (
                <div className={styles.paramInfo}>
                  The algorithm used to predict future states of the system. Different methods have varying accuracy and computational efficiency.
                </div>
              )}
            </div>
            
            {/* Parameter: Prediction Steps */}
            <div className={styles.paramItem}>
              <div className={styles.paramHeader}>
                <div className={styles.paramName}>
                  <span className={styles.paramFullName}>prediction steps</span>
                </div>
                <div className={styles.paramValue}>{mlParams.predictionSteps || 50}</div>
              </div>
              
              {isEditMode ? (
                <div className={styles.paramSlider}>
                  <input 
                    type="range" 
                    min="10" 
                    max="200" 
                    step="10" 
                    value={mlParams.predictionSteps || 50} 
                    onChange={(e) => onMLParamChange('steps', parseInt(e.target.value))}
                    className={styles.slider}
                  />
                  <div className={styles.sliderRange}>
                    <span>10</span>
                    <span>200</span>
                  </div>
                </div>
              ) : (
                <div className={styles.paramInfo}>
                  How far into the future to predict. In chaotic systems like this, predictions become increasingly unreliable as the horizon increases.
                </div>
              )}
            </div>
          </>
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
