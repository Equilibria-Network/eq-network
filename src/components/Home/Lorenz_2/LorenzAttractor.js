// src/components/Home/Lorenz_2/LorenzAttractor.js
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
import Tippy from '@tippyjs/react';
import { ChevronLeft, ChevronRight, Play, Pause, RefreshCw, Info } from 'lucide-react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

const LorenzAttractor = ({ className, style }) => {
  const containerRef = useRef(null);
  const visualizationRef = useRef(null);
  
  // Animation state
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Panel state
  const [showPanel, setShowPanel] = useState(false);
  
  // Visualization type
  const [visualizationType, setVisualizationType] = useState('standard');
  
  // System state
  const [config, setConfig] = useState({
    ...LORENZ_CONFIG,
    colors: {
      primary: { r: 0, g: 59, b: 126 } // Default color
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
    handleParamChange
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
  
  // Get description based on visualization type
  function getVisualizationDescription(type) {
    switch(type) {
      case 'standard':
        return "Standard Lorenz Attractor";
      case 'butterfly-effect':
        return "Butterfly Effect: Two trajectories with almost identical starting points diverge chaotically";
      case 'ml-prediction':
        return "Machine Learning Prediction (Coming Soon): Demonstrates the limits of prediction in chaotic systems";
      default:
        return "Lorenz Attractor Visualization";
    }
  }
  
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
        return <DoubleTrajectory {...visualizationProps} />;
        
      case 'ml-prediction':
        return <MLPrediction {...visualizationProps} />;
        
      case 'standard':
      default:
        return <StandardView {...visualizationProps} />;
    }
  };
  
  // Tippy tooltip theme
  const tippyTheme = {
    theme: 'light',
    arrow: true,
    animation: 'shift-away',
    placement: 'bottom',
    appendTo: document.body
  };
  
  // Tooltip content for visualization
  const visualizationTooltip = getVisualizationDescription(visualizationType);
  
  return (
    <div 
      ref={containerRef} 
      className={`${styles.container} ${className || ''}`}
      style={style}
    >
      {/* Visualization with tooltip and click handler */}
      <Tippy 
        content={visualizationTooltip} 
        {...tippyTheme} 
        placement="top"
      >
        <div 
          ref={visualizationRef} 
          className={styles.visualizationWrapper}
          onClick={handleVisualizationClick}
        >
          {renderVisualization()}
        </div>
      </Tippy>
      
      {/* Single row of controls */}
      <div className={styles.controls}>
        {/* Previous visualization button */}
        <Tippy content="Previous" {...tippyTheme}>
          <button
            onClick={() => navigateVisualization('prev')}
            className={styles.navButton}
            aria-label="Previous Visualization"
          >
            <ChevronLeft size={20} />
          </button>
        </Tippy>
        
        {/* Play/Pause button */}
        <Tippy content={isPlaying ? "Pause" : "Play"} {...tippyTheme}>
          <button 
            onClick={handlePlayPause}
            className={styles.button}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </Tippy>
        
        {/* Reset button */}
        <Tippy content="Reset" {...tippyTheme}>
          <button 
            onClick={handleReset}
            className={styles.button}
            aria-label="Reset"
          >
            <RefreshCw size={20} />
          </button>
        </Tippy>
        
        {/* Info button */}
        <Tippy content="Info" {...tippyTheme}>
          <button 
            onClick={togglePanel}
            className={`${styles.button} ${showPanel ? styles.activeButton : ''}`}
            aria-label="Simulation Info"
          >
            <Info size={20} />
          </button>
        </Tippy>
        
        {/* Next visualization button */}
        <Tippy content="Next" {...tippyTheme}>
          <button
            onClick={() => navigateVisualization('next')}
            className={styles.navButton}
            aria-label="Next Visualization"
          >
            <ChevronRight size={20} />
          </button>
        </Tippy>
      </div>
      
      {/* Control Panel */}
      <ControlPanel 
        visible={showPanel}
        onClose={togglePanel}
        systemParams={systemParams}
        currentPoint={currentPoint}
        currentRates={currentRates}
        onParamChange={onParamChange}
        visualizationType={visualizationType}
      />
    </div>
  );
};

export default LorenzAttractor;
