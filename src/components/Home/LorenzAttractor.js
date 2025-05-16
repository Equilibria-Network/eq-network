// src/components/HomepageComponents/LorenzAttractor.js
import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, RefreshCw } from 'lucide-react';

// Centralized configuration for the Lorenz system
const LORENZ_CONFIG = {
  // System parameters
  system: {
    sigma: 10,
    rho: 28,
    beta: 8/3,
    variation: 0.2,
    dt: 0.005,
    noise: 0.0001
  },
  // Display bounds
  bounds: {
    x: [-20, 20],
    z: [0, 50]
  },
  // Animation settings
  animation: {
    maxPoints: 2000,
    startDrawingAt: 20,
    strokeInterval: 3,
    pointsPerFrame: 2,
    padding: 1,
    initialPoints: 300,  // Reduced number of initial points
    initialSpeed: 2,     // Reduced speed multiplier for better accuracy
    transitionFrames: 45 // Slightly faster transition to normal speed
  },
  colors: {
    primary: undefined
  }
};

// Helper to get CSS variable color and convert to RGB
const getCssColor = (variable) => {
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return { r, g, b };
  }
  
  const match = color.match(/\d+/g);
  if (match) {
    return {
      r: parseInt(match[0]),
      g: parseInt(match[1]),
      b: parseInt(match[2])
    };
  }
  
  return { r: 0, g: 59, b: 126 };
};

const LorenzAttractor = ({
  config = LORENZ_CONFIG,
  className,
  style
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const frameCountRef = useRef(0);
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [points, setPoints] = useState([]);

  // Initialize with a new random seed point
  const generateRandomSeed = () => ({
    x: -11.2 + (Math.random() - 0.5) * 2,
    y: 4.4 + (Math.random() - 0.5) * 2,
    z: 21.2 + (Math.random() - 0.5) * 2
  });
  
  const pointsRef = useRef([generateRandomSeed()]);

  // Calculate next point in the system
  const calculateNext = (point, speedMultiplier = 1) => {
    const { sigma, rho, beta, dt, noise } = config.system;
    const { x, y, z } = point;
    
    // For higher speeds, use multiple smaller steps instead of one large step
    const steps = Math.ceil(speedMultiplier);
    const stepDt = dt * speedMultiplier / steps;
    
    let currentX = x;
    let currentY = y;
    let currentZ = z;
    
    for (let i = 0; i < steps; i++) {
      const dx = sigma * (currentY - currentX);
      const dy = currentX * (rho - currentZ) - currentY;
      const dz = currentX * currentY - beta * currentZ;
      
      currentX += dx * stepDt + (Math.random() - 0.5) * noise;
      currentY += dy * stepDt + (Math.random() - 0.5) * noise;
      currentZ += dz * stepDt + (Math.random() - 0.5) * noise;
    }
    
    return {
      x: currentX,
      y: currentY,
      z: currentZ
    };
  };

  // Project 3D point to 2D canvas
  const project = (point, canvas) => {
    const { bounds, animation } = config;
    const xRange = bounds.x[1] - bounds.x[0];
    const zRange = bounds.z[1] - bounds.z[0];
    
    const xScale = (canvas.width * animation.padding) / xRange;
    const zScale = (canvas.height * animation.padding) / zRange;
    const scale = Math.min(xScale, zScale);

    return {
      x: point.x * scale + canvas.width / 2,
      y: -point.z * scale + canvas.height / 2 + (zRange * scale / 2)
    };
  };

  // Pre-calculate initial points with faster speed
  const preCalculatePoints = (seed) => {
    const initialPoints = [seed];
    for (let i = 0; i < config.animation.initialPoints; i++) {
      const current = initialPoints[initialPoints.length - 1];
      const next = calculateNext(current, config.animation.initialSpeed);
      initialPoints.push(next);
    }
    return initialPoints;
  };

  // Reset the animation with a new seed
  const handleReset = () => {
    const newSeed = generateRandomSeed();
    pointsRef.current = [newSeed];
    frameCountRef.current = 0;
    setPoints([]);
    
    // Pre-calculate initial points
    pointsRef.current = preCalculatePoints(newSeed);
    
    // If not currently playing, draw the initial state
    if (!isPlaying) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        drawPoints(ctx, canvas);
      }
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  // Draw all points to the canvas
  const drawPoints = (ctx, canvas) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-over';
    ctx.beginPath();
    
    pointsRef.current.slice(config.animation.startDrawingAt).forEach((point, i) => {
      const projected = project(point, canvas);
      const progress = i / (pointsRef.current.length - config.animation.startDrawingAt);
      const opacity = progress < 0.1 ? progress * 10 : 1;
      
      const { primary } = config.colors;
      ctx.strokeStyle = `rgba(${primary.r}, ${primary.g}, ${primary.b}, ${opacity})`;
      ctx.lineWidth = 1;
      
      if (i === 0) {
        ctx.moveTo(projected.x, projected.y);
      } else {
        ctx.lineTo(projected.x, projected.y);
        if (i % config.animation.strokeInterval === 0 || i === pointsRef.current.length - config.animation.startDrawingAt - 1) {
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(projected.x, projected.y);
        }
      }
    });
  };

  // Animation frame function
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    frameCountRef.current++;
    
    // Calculate speed multiplier for transition period
    let speedMultiplier = 1;
    if (frameCountRef.current < config.animation.transitionFrames) {
      speedMultiplier = config.animation.initialSpeed - 
        (config.animation.initialSpeed - 1) * 
        (frameCountRef.current / config.animation.transitionFrames);
    }

    // Calculate new points
    for(let i = 0; i < config.animation.pointsPerFrame; i++) {
      const current = pointsRef.current[pointsRef.current.length - 1];
      const next = calculateNext(current, speedMultiplier);
      pointsRef.current.push(next);
    }
    
    if (pointsRef.current.length > config.animation.maxPoints) {
      pointsRef.current = pointsRef.current.slice(-config.animation.maxPoints);
    }

    // Draw points
    drawPoints(ctx, canvas);
    
    // Update state for UI (but not too often to avoid performance issues)
    if (frameCountRef.current % 30 === 0) {
      setPoints([...pointsRef.current]);
    }
    
    // Request next frame if still playing
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    config.colors = {
      primary: getCssColor('--ifm-color-primary')
    };

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Redraw after resize
      drawPoints(ctx, canvas);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Start with pre-calculated points
    pointsRef.current = preCalculatePoints(pointsRef.current[0]);
    frameCountRef.current = 0;
    
    // Only start animation if playing
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      drawPoints(ctx, canvas);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config]);

  // Effect to handle play/pause state changes
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div ref={containerRef} className={className} style={{
      width: '100%',
      height: '500px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'block',
          background: 'transparent'
        }}
      />
      
      {/* Controls bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginTop: '-40px',
        position: 'relative',
        zIndex: 2
      }}>
        <button 
          onClick={togglePlayPause}
          style={{
            background: 'var(--ifm-color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s ease, background-color 0.2s ease'
          }}
          title={isPlaying ? 'Pause' : 'Play'}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <button 
          onClick={handleReset}
          style={{
            background: 'var(--ifm-color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s ease, background-color 0.2s ease'
          }}
          title="Reset"
          aria-label="Reset"
        >
          <RefreshCw size={20} />
        </button>
      </div>
    </div>
  );
};

export default LorenzAttractor;
