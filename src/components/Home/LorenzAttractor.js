import React, { useEffect, useRef } from 'react';

// Centralized configuration for the Lorenz system
const LORENZ_CONFIG = {
  // System parameters
  system: {
    sigma: 10,
    rho: 28,
    beta: 8/3,
    variation: 0.2,
    dt: 0.005,      // Smaller dt for smoother curves
    noise: 0.0001   // System noise
  },
  // Display bounds
  bounds: {
    x: [-20, 20],
    z: [0, 50]
  },
  // Animation settings
  animation: {
    maxPoints: 2000,        // Maximum number of points to track
    startDrawingAt: 20,     // Start drawing after this many points
    strokeInterval: 3,      // Draw stroke every N points for smoother lines
    pointsPerFrame: 2,      // Points to calculate per frame
    padding: 1             // Padding around the visualization
  },
  // Color settings - will be computed from CSS variables
  colors: {
    primary: undefined     // Will be set from --ifm-color-primary
  }
};

// Helper to get CSS variable color and convert to RGB
const getCssColor = (variable) => {
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  
  // Handle hex colors
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return { r, g, b };
  }
  
  // Handle rgb/rgba colors
  const match = color.match(/\d+/g);
  if (match) {
    return {
      r: parseInt(match[0]),
      g: parseInt(match[1]),
      b: parseInt(match[2])
    };
  }
  
  return { r: 0, g: 59, b: 126 }; // Fallback color
};

const LorenzAttractor = ({
  config = LORENZ_CONFIG,
  className,
  style
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const pointsRef = useRef([{
    x: -11.2 + (Math.random() - 0.5) * 2,
    y: 4.4 + (Math.random() - 0.5) * 2,
    z: 21.2 + (Math.random() - 0.5) * 2
  }]);
  const animationRef = useRef(null);

  useEffect(() => {
    // Update colors from CSS variables
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
    };

    const calculateNext = (point) => {
      const { sigma, rho, beta, dt, noise } = config.system;
      const { x, y, z } = point;
      
      return {
        x: x + (sigma * (y - x)) * dt + (Math.random() - 0.5) * noise,
        y: y + (x * (rho - z) - y) * dt + (Math.random() - 0.5) * noise,
        z: z + (x * y - beta * z) * dt + (Math.random() - 0.5) * noise
      };
    };

    const project = (point) => {
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

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate multiple points per frame
      for(let i = 0; i < config.animation.pointsPerFrame; i++) {
        const current = pointsRef.current[pointsRef.current.length - 1];
        const next = calculateNext(current);
        pointsRef.current.push(next);
      }
      
      if (pointsRef.current.length > config.animation.maxPoints) {
        pointsRef.current = pointsRef.current.slice(-config.animation.maxPoints);
      }

      ctx.globalCompositeOperation = 'destination-over';
      ctx.beginPath();
      
      pointsRef.current.slice(config.animation.startDrawingAt).forEach((point, i) => {
        const projected = project(point);
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
      
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config]);

  return (
    <div ref={containerRef} className={className} style={{
      width: '100%',
      height: '500px',
      position: 'relative',
      display: 'flex',
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
    </div>
  );
};

export default LorenzAttractor;
