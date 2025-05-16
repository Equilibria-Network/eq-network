// src/components/Home/Lorenz/LorenzAttractor.js
import React, { useState, useRef, useEffect } from 'react';
import { Pause, Play, RefreshCw, Info } from 'lucide-react';
import styles from './LorenzAttractor.module.css';
import ControlPanel from './ControlPanel';
import { 
  LORENZ_CONFIG, 
  getCssColor, 
  createInitialSeed, 
  calculateNext, 
  calculateRates,
  preCalculatePoints 
} from './lorenzUtils';

const LorenzAttractor = ({ className, style }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const frameCountRef = useRef(0);
  const pointsRef = useRef([createInitialSeed()]);
  
  // Animation state
  const [isPlaying, setIsPlaying] = useState(true);
  const [transitionComplete, setTransitionComplete] = useState(false);
  
  // Panel state
  const [showPanel, setShowPanel] = useState(false);
  
  // System state
  const [config, setConfig] = useState({
    ...LORENZ_CONFIG,
    colors: {
      primary: { r: 0, g: 59, b: 126 } // Default color
    }
  });
  
  // System state
  const [systemParams, setSystemParams] = useState({
    sigma: config.system.sigma,
    rho: config.system.rho,
    beta: config.system.beta,
    dt: config.system.dt,
    noise: config.system.noise,
    pointsPerFrame: config.animation.pointsPerFrame
  });
  
  // Current point and rates for display
  const [currentPoint, setCurrentPoint] = useState({
    x: pointsRef.current[0].x,
    y: pointsRef.current[0].y,
    z: pointsRef.current[0].z
  });
  
  const [currentRates, setCurrentRates] = useState({
    dx: 0,
    dy: 0,
    dz: 0
  });
  
  // Handle parameter changes from control panel
  const handleParamChange = (param, value) => {
    // Update the system parameters in config
    setConfig(prev => ({
      ...prev,
      system: {
        ...prev.system,
        [param]: value
      },
      animation: {
        ...prev.animation,
        ...(param === 'pointsPerFrame' ? { pointsPerFrame: value } : {})
      }
    }));
    
    // Update systemParams state for display
    setSystemParams(prev => ({
      ...prev,
      [param]: value
    }));
  };
  
  // Initialize config with proper colors
  useEffect(() => {
    const primaryColor = getCssColor('--ifm-color-primary');
    setConfig(prev => ({
      ...prev,
      colors: { primary: primaryColor }
    }));
  }, []);
  
  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      drawPoints();
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Initialize points on first render
  useEffect(() => {
    // Pre-calculate initial points to start with
    pointsRef.current = preCalculatePoints(
      pointsRef.current[0],
      config.system,
      config.animation.initialPoints,
      config.animation.initialSpeed
    );
    
    // Force a redraw
    drawPoints();
    
    // Start animation with a slight delay to ensure everything is initialized
    if (isPlaying) {
      // Small timeout to ensure clean animation start
      setTimeout(() => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
        requestRef.current = requestAnimationFrame(animate);
      }, 50);
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);
  
  // Draw current points to canvas
  const drawPoints = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-over';
    ctx.beginPath();
    
    const startIndex = config.animation.startDrawingAt;
    const visiblePoints = pointsRef.current.slice(startIndex);
    
    visiblePoints.forEach((point, i) => {
      const projected = projectPoint(point, canvas);
      const progress = i / visiblePoints.length;
      const opacity = progress < 0.1 ? progress * 10 : 1;
      
      const { primary } = config.colors;
      ctx.strokeStyle = `rgba(${primary.r}, ${primary.g}, ${primary.b}, ${opacity})`;
      ctx.lineWidth = 1;
      
      if (i === 0) {
        ctx.moveTo(projected.x, projected.y);
      } else {
        ctx.lineTo(projected.x, projected.y);
        if (i % config.animation.strokeInterval === 0 || i === visiblePoints.length - 1) {
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(projected.x, projected.y);
        }
      }
    });
  };
  
  // Project 3D point to 2D canvas coordinates
  const projectPoint = (point, canvas) => {
    const bounds = config.display.bounds;
    const padding = config.animation.padding;
    
    const xRange = bounds.x[1] - bounds.x[0];
    const zRange = bounds.z[1] - bounds.z[0];
    
    const xScale = (canvas.width * padding) / xRange;
    const zScale = (canvas.height * padding) / zRange;
    const scale = Math.min(xScale, zScale);

    return {
      x: point.x * scale + canvas.width / 2,
      y: -point.z * scale + canvas.height / 2 + (zRange * scale / 2)
    };
  };
  
  // Animation frame function
  const animate = () => {
    if (!isPlaying) return;
    
    // Only increment frame count during transition
    if (!transitionComplete) {
      frameCountRef.current++;
    }
    
    // Calculate speed multiplier for transition period
    let speedMultiplier = 1;
    if (!transitionComplete && frameCountRef.current < config.animation.transitionFrames) {
      speedMultiplier = config.animation.initialSpeed - 
        (config.animation.initialSpeed - 1) * 
        (frameCountRef.current / config.animation.transitionFrames);
    } else if (!transitionComplete) {
      // Mark transition as complete once frames exceed threshold
      setTransitionComplete(true);
    }

    // Calculate new points
    for(let i = 0; i < config.animation.pointsPerFrame; i++) {
      const current = pointsRef.current[pointsRef.current.length - 1];
      const next = calculateNext(current, config.system, speedMultiplier);
      pointsRef.current.push(next);
    }
    
    if (pointsRef.current.length > config.animation.maxPoints) {
      pointsRef.current = pointsRef.current.slice(-config.animation.maxPoints);
    }

    // Draw points
    drawPoints();
    
    // Update current point and rates for display (always, not just when panel is visible)
    // This ensures data is already updated when user opens the panel
    const current = pointsRef.current[pointsRef.current.length - 1];
    if (current) {
      // Update current point display with raw values
      setCurrentPoint({
        x: current.x,
        y: current.y,
        z: current.z
      });
      
      // Calculate and update rates with raw values
      const rates = calculateRates(current, config.system);
      setCurrentRates({
        dx: rates.dx,
        dy: rates.dy,
        dz: rates.dz
      });
    }
    
    // Schedule next frame
    requestRef.current = requestAnimationFrame(animate);
  };
  
  // Handle play/pause state changes
  useEffect(() => {
    // First clear any existing animation frame
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    
    // Then start animation if playing
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [isPlaying, config]);
  
  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };
  
  // Toggle panel visibility
  const togglePanel = () => {
    setShowPanel(prev => !prev);
  };
  
  // Reset the simulation
  const handleReset = () => {
    // Reset to default parameters
    const defaultParams = {
      sigma: LORENZ_CONFIG.system.sigma,
      rho: LORENZ_CONFIG.system.rho,
      beta: LORENZ_CONFIG.system.beta,
      dt: LORENZ_CONFIG.system.dt,
      noise: LORENZ_CONFIG.system.noise,
      pointsPerFrame: LORENZ_CONFIG.animation.pointsPerFrame
    };
    
    // Update system parameters in config
    setConfig(prev => ({
      ...prev,
      system: {
        ...prev.system,
        sigma: defaultParams.sigma,
        rho: defaultParams.rho,
        beta: defaultParams.beta,
        dt: defaultParams.dt,
        noise: defaultParams.noise
      },
      animation: {
        ...prev.animation,
        pointsPerFrame: defaultParams.pointsPerFrame
      }
    }));
    
    // Update system parameters state
    setSystemParams(defaultParams);
    
    // Create new seed
    const newSeed = createInitialSeed();
    
    // Update current point with raw values
    setCurrentPoint({
      x: newSeed.x,
      y: newSeed.y,
      z: newSeed.z
    });
    
    // Reset points and frame count
    pointsRef.current = [newSeed];
    frameCountRef.current = 0;
    
    // Reset transition state
    setTransitionComplete(false);
    
    // Pre-calculate points
    pointsRef.current = preCalculatePoints(
      newSeed,
      { ...config.system, ...defaultParams },
      config.animation.initialPoints,
      config.animation.initialSpeed
    );
    
    // Force a redraw
    drawPoints();
  };

  return (
    <div 
      ref={containerRef} 
      className={`${styles.container} ${className || ''}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className={styles.canvas}
      />
      
      {/* Controls */}
      <div className={styles.controls}>
        {/* Play/Pause button */}
        <button 
          onClick={togglePlayPause}
          className={styles.button}
          title={isPlaying ? 'Pause' : 'Play'}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        {/* Reset button */}
        <button 
          onClick={handleReset}
          className={styles.button}
          title="Reset"
          aria-label="Reset"
        >
          <RefreshCw size={20} />
        </button>
        
        {/* Info button */}
        <button 
          onClick={togglePanel}
          className={`${styles.button} ${showPanel ? styles.activeButton : ''}`}
          title="Simulation Info"
          aria-label="Simulation Info"
        >
          <Info size={20} />
        </button>
      </div>
      
      {/* Improved Control Panel */}
      <ControlPanel 
        visible={showPanel}
        onClose={togglePanel}
        systemParams={{
          ...systemParams,
          dt: config.system.dt,
          noise: config.system.noise,
          pointsPerFrame: config.animation.pointsPerFrame
        }}
        currentPoint={currentPoint}
        currentRates={currentRates}
        onParamChange={handleParamChange}
      />
    </div>
  );
};

export default LorenzAttractor;
