// src/components/Home/LorenzAttractor.js
import React, { useEffect, useRef } from 'react';

// Constants for the Lorenz system
const LORENZ_CONFIG = {
  bounds: {
    x: [-20, 20],
    z: [0, 50]
  },
  params: {
    sigma: 10,
    rho: 28,
    beta: 8/3,
    variation: 0.2, // Maximum random variation in parameters
    dt: 0.01,      // Time step
    noise: 0.0001   // System noise
  },
  animation: {
    maxPoints: 2000,
    startDrawingAt: 20,
    strokeInterval: 5,
    padding: 1,
    colorBase: {r: 0, g: 59, b: 126},
    colorVariationPeriod: 5000 // ms
  }
};

// Helper function to add random variation to a value
const addRandomVariation = (value, variation) => {
  return value + (Math.random() - 0.5) * variation;
};

// Generate initial point with slight randomization
const generateInitialPoint = () => ({
  x: addRandomVariation(-11.2, 2),
  y: addRandomVariation(4.4, 2),
  z: addRandomVariation(21.2, 2)
});

const LorenzAttractor = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const pointsRef = useRef([generateInitialPoint()]);
  const animationRef = useRef(null);
  
  // Initialize Lorenz parameters with slight random variations
  const paramsRef = useRef({
    sigma: addRandomVariation(LORENZ_CONFIG.params.sigma, LORENZ_CONFIG.params.variation),
    rho: addRandomVariation(LORENZ_CONFIG.params.rho, LORENZ_CONFIG.params.variation),
    beta: addRandomVariation(LORENZ_CONFIG.params.beta, LORENZ_CONFIG.params.variation/2)
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    
    // Canvas resize handler
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    // Calculate next point in the Lorenz system
    const calculateNext = (point) => {
      const { sigma, rho, beta } = paramsRef.current;
      const { dt, noise } = LORENZ_CONFIG.params;
      const { x, y, z } = point;
      
      return {
        x: x + (sigma * (y - x)) * dt + addRandomVariation(0, noise),
        y: y + (x * (rho - z) - y) * dt + addRandomVariation(0, noise),
        z: z + (x * y - beta * z) * dt + addRandomVariation(0, noise)
      };
    };

    // Project 3D point to 2D space
    const project = (point) => {
      const { bounds, animation } = LORENZ_CONFIG;
      const xRange = bounds.x[1] - bounds.x[0];
      const zRange = bounds.z[1] - bounds.z[0];
      
      const xScale = (canvas.width * animation.padding) / xRange;
      const zScale = (canvas.height * animation.padding) / zRange;
      const scale = Math.min(xScale, zScale);

      const xOffset = canvas.width / 2;
      const zOffset = canvas.height / 2;

      return {
        x: point.x * scale + xOffset,
        y: -point.z * scale + zOffset + (zRange * scale / 2)
      };
    };

    // Animation loop
    const animate = () => {
      const { maxPoints, startDrawingAt, strokeInterval, colorBase, colorVariationPeriod } = LORENZ_CONFIG.animation;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const current = pointsRef.current[pointsRef.current.length - 1];
      const next = calculateNext(current);
      pointsRef.current.push(next);
      
      if (pointsRef.current.length > maxPoints) {
        pointsRef.current = pointsRef.current.slice(-maxPoints);
      }

      ctx.globalCompositeOperation = 'destination-over';
      ctx.beginPath();
      
      pointsRef.current.slice(startDrawingAt).forEach((point, i) => {
        const projected = project(point);
        const progress = i / (pointsRef.current.length - startDrawingAt);
        const opacity = progress < 0.1 ? progress * 10 : 1;
        
        const blueVariation = Math.sin(Date.now() / colorVariationPeriod) * 10;
        ctx.strokeStyle = `rgba(${colorBase.r}, ${colorBase.g + blueVariation}, ${colorBase.b}, ${opacity})`;
        ctx.lineWidth = 1;
        
        if (i === 0) {
          ctx.moveTo(projected.x, projected.y);
        } else {
          ctx.lineTo(projected.x, projected.y);
          if (i % strokeInterval === 0 || i === pointsRef.current.length - startDrawingAt - 1) {
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(projected.x, projected.y);
          }
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Setup and cleanup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{
        width: '100%',
        height: '500px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
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
