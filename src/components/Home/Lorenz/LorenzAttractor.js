// src/components/Home/Lorenz/LorenzAttractor.js
/**
 * Main Lorenz Attractor visualization component.
 * 
 * This component is the primary container for the Lorenz attractor visualization,
 * coordinating the various sub-components and managing visualization state.
 * 
 * This component:
 * - Manages the visualization state and modes
 * - Renders the canvas and controls
 * - Coordinates between simulation logic, rendering, and user interaction
 * 
 * Dependencies:
 * - utils/lorenzUtils.js: For simulation logic and constants
 * - controls/BasicControls.js: For play/pause/info buttons
 * - controls/ControlPanel/: For the advanced control panel
 * - visualization/: For different visualization types
 */

// src/components/Home/Lorenz/LorenzAttractor.js
import React, { useState, useRef, useEffect } from 'react';
import styles from './LorenzAttractor.module.css';
import { LORENZ_CONFIG, getCssColor } from './utils/lorenzUtils';
import ControlPanel from './controls/ControlPanel';
import { 
  StandardView, 
  DoubleTrajectory, 
  MLPrediction,
  visualizationTypes 
} from './visualization';
import { useSimulation } from './utils/useSimulation';
import { ChevronLeft, ChevronRight, Play, Pause, RefreshCw, Info } from 'lucide-react';

const LorenzAttractor = ({ className, style }) => {
  const containerRef = useRef(null);
  const visualizationRef = useRef(null);
  
  // Animation state
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Panel state
  const [showPanel, setShowPanel] = useState(false);
  
  // Visualization type - DEFAULT TO BUTTERFLY EFFECT
  const [visualizationType, setVisualizationType] = useState('butterfly-effect');
  
  // ML Prediction state
  const [predictionSteps, setPredictionSteps] = useState(50);
  const [predictorId, setPredictorId] = useState('rk4');
  
  // Butterfly Effect state
  const [initialSeparation, setInitialSeparation] = useState(0.000001);
  
  // System state
  const [config, setConfig] = useState({
    ...LORENZ_CONFIG,
    colors: {
      primary: { r: 0, g: 59, b: 126 } // Default color
    },
    butterfly: {
      initialSeparation: initialSeparation
    },
    display: {
      ...LORENZ_CONFIG.display,
      showTrajectoryDistance: true
    }
  });
  
  // Create a single simulation instance that will be used by all visualization types
  const simulation = useSimulation(config);
  
  // Extract needed state from simulation
  const { 
    systemParams, 
    currentPoint, 
    currentRates,
    togglePlayPause,
    resetSimulation,
    handleParamChange,
    initialSeed, // Expose initialSeed for DoubleTrajectory
    pointsRef,
    secondaryPointsRef
  } = simulation;
  
  // Initialize config with proper colors
  useEffect(() => {
    const primaryColor = getCssColor('--ifm-color-primary');
    setConfig(prev => ({
      ...prev,
      colors: { primary: primaryColor }
    }));
  }, []);
  
  // Reset the simulation when requested
  const handleReset = () => {
    resetSimulation();
  };
  
  // Toggle play/pause
  const handlePlayPause = () => {
    togglePlayPause();
    setIsPlaying(!isPlaying);
  };
  
  // Toggle panel visibility
  const togglePanel = () => {
    setShowPanel(prev => !prev);
  };
  
  // Handle clicking on the visualization
  const handleVisualizationClick = () => {
    togglePanel();
  };
  
  // Handle parameter changes
  const onParamChange = (param, value) => {
    handleParamChange(param, value);
  };
  
  // Handle ML parameter changes
  const onMLParamChange = (paramName, value) => {
    if (paramName === 'predictor') {
      setPredictorId(value);
    } else if (paramName === 'steps') {
      setPredictionSteps(value);
    }
  };
  
  // Handle butterfly effect parameter changes
  const onButterflyParamChange = (paramName, value) => {
    if (paramName === 'separation') {
      setInitialSeparation(value);
      setConfig(prev => ({
        ...prev,
        butterfly: {
          ...prev.butterfly,
          initialSeparation: value
        }
      }));
    }
  };
  
  // Calculate trajectory distance for butterfly effect
  const calculateTrajectoryDistance = () => {
    if (visualizationType !== 'butterfly-effect') return null;
    
    if (pointsRef.current && secondaryPointsRef.current &&
        pointsRef.current.length > 0 && secondaryPointsRef.current.length > 0) {
      const p1 = pointsRef.current[pointsRef.current.length - 1];
      const p2 = secondaryPointsRef.current[secondaryPointsRef.current.length - 1];
      
      if (p1 && p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dz = p1.z - p2.z;
        
        return Math.sqrt(dx*dx + dy*dy + dz*dz);
      }
    }
    
    return null;
  };
  
  // Navigate between visualization types
  const navigateVisualization = (direction) => {
    const types = Object.keys(visualizationTypes);
    const currentIndex = types.findIndex(type => type === visualizationType);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % types.length;
    } else {
      newIndex = (currentIndex - 1 + types.length) % types.length;
    }
    
    setVisualizationType(types[newIndex]);
  };
  
  // Render the appropriate visualization based on type
  const renderVisualization = () => {
    // Common props to pass to all visualization components
    const visualizationProps = {
      config,
      isPlaying,
      simulation,
      onPlayPause: handlePlayPause,
      onReset: handleReset
    };
    
    switch (visualizationType) {
      case 'butterfly-effect':
        // Create a butterfly-specific config
        const butterflyConfig = {
          ...config,
          butterfly: {
            initialSeparation: initialSeparation
          },
          display: {
            ...config.display,
            showSecondaryTrajectory: true
          }
        };
        
        return <DoubleTrajectory {...visualizationProps} config={butterflyConfig} />;
        
      case 'ml-prediction':
        return (
          <MLPrediction 
            {...visualizationProps} 
            predictorId={predictorId}
            predictionSteps={predictionSteps}
          />
        );
        
      case 'standard':
      default:
        // COMMENTED OUT - SUPPRESS STANDARD VIEW FOR NOW
        // return <StandardView {...visualizationProps} />;
        
        // Instead, show butterfly effect as fallback
        const fallbackButterflyConfig = {
          ...config,
          butterfly: {
            initialSeparation: initialSeparation
          },
          display: {
            ...config.display,
            showSecondaryTrajectory: true
          }
        };
        
        return <DoubleTrajectory {...visualizationProps} config={fallbackButterflyConfig} />;
    }
  };
  
  // Get the current trajectoryDistance for display
  const trajectoryDistance = calculateTrajectoryDistance();
  
  // Create butterflyParams object for control panel
  const butterflyParams = {
    initialSeparation,
    trajectoryDistance // Include current distance
  };
  
  return (
    <div 
      ref={containerRef} 
      className={`${styles.container} ${className || ''}`}
      style={style}
    >
      {/* Visualization Canvas - clean, no labels */}
      <div 
        ref={visualizationRef} 
        className={styles.visualizationWrapper}
        onClick={handleVisualizationClick}
      >
        {renderVisualization()}
      </div>
      
      {/* Minimal controls at the bottom */}
      <div className={styles.controls}>
        {/* Previous visualization button */}
        <button
          onClick={() => navigateVisualization('prev')}
          className={styles.navButton}
          aria-label="Previous Visualization"
          title="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        
        {/* Play/Pause button */}
        <button 
          onClick={handlePlayPause}
          className={styles.button}
          aria-label={isPlaying ? "Pause" : "Play"}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        {/* Reset button */}
        <button 
          onClick={handleReset}
          className={styles.button}
          aria-label="Reset"
          title="Reset"
        >
          <RefreshCw size={20} />
        </button>
        
        {/* Info button */}
        <button 
          onClick={togglePanel}
          className={`${styles.button} ${showPanel ? styles.activeButton : ''}`}
          aria-label="Simulation Info"
          title="Info"
        >
          <Info size={20} />
        </button>
        
        {/* Next visualization button */}
        <button
          onClick={() => navigateVisualization('next')}
          className={styles.navButton}
          aria-label="Next Visualization"
          title="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Visualization type indicator - REMOVED */}
      {/* <div className={styles.visualizationTypeIndicator}>
        {visualizationTypes[visualizationType]}
      </div> */}
      
      {/* Control Panel - now includes visualization-specific controls */}
      <ControlPanel 
        visible={showPanel}
        onClose={togglePanel}
        systemParams={systemParams}
        currentPoint={currentPoint}
        currentRates={currentRates}
        onParamChange={onParamChange}
        visualizationType={visualizationType}
        mlParams={{
          predictorId,
          predictionSteps
        }}
        onMLParamChange={onMLParamChange}
        butterflyParams={butterflyParams}
        onButterflyParamChange={onButterflyParamChange}
      />
    </div>
  );
};

export default LorenzAttractor;
