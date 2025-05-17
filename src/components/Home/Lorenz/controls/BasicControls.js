// src/components/Home/Lorenz/controls/BasicControls.js
/**
 * Basic control buttons for the Lorenz attractor visualization.
 * 
 * This component provides the minimal set of controls (play/pause, reset, info)
 * for interacting with the Lorenz attractor visualization.
 * 
 * Responsibilities:
 * - Renders play/pause toggle button
 * - Renders reset button
 * - Renders info button to open the control panel
 * - Handles user interaction with these controls
 * 
 * Dependencies:
 * - None, but provides callbacks to parent component
 */

import React from 'react';
import { Pause, Play, RefreshCw, Info } from 'lucide-react';
import styles from './BasicControls.module.css';

const BasicControls = ({ 
  isPlaying, 
  onPlayPause, 
  onReset, 
  onInfoToggle, 
  showInfoPanel 
}) => {
  return (
    <div className={styles.controls}>
      {/* Play/Pause button */}
      <button 
        onClick={onPlayPause}
        className={styles.button}
        title={isPlaying ? 'Pause' : 'Play'}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      
      {/* Reset button */}
      <button 
        onClick={onReset}
        className={styles.button}
        title="Reset"
        aria-label="Reset"
      >
        <RefreshCw size={20} />
      </button>
      
      {/* Info button */}
      <button 
        onClick={onInfoToggle}
        className={`${styles.button} ${showInfoPanel ? styles.activeButton : ''}`}
        title="Simulation Info"
        aria-label="Simulation Info"
      >
        <Info size={20} />
      </button>
    </div>
  );
};

export default BasicControls;
