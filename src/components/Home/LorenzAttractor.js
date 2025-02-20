// src/components/Home/LorenzAttractor.js
import React, { useEffect, useRef } from 'react';

const LorenzAttractor = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  // Random starting point within a reasonable range
  const initialPoint = {
    x: -11.2 + (Math.random() - 0.5) * 2,
    y: 4.4 + (Math.random() - 0.5) * 2,
    z: 21.2 + (Math.random() - 0.5) * 2
  };
  const pointsRef = useRef([initialPoint]);
  const animationRef = useRef(null);
  const paramsRef = useRef({
    sigma: 10 + (Math.random() - 0.5) * 0.2,  // Small random variation in parameters
    rho: 28 + (Math.random() - 0.5) * 0.2,
    beta: 8/3 + (Math.random() - 0.5) * 0.1
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const calculateNext = (point) => {
      const { sigma, rho, beta } = paramsRef.current;
      const dt = 0.01;
      
      const { x, y, z } = point;
      
      // Add tiny random fluctuations to the system
      const noise = 0.0001;
      return {
        x: x + (sigma * (y - x)) * dt + (Math.random() - 0.5) * noise,
        y: y + (x * (rho - z) - y) * dt + (Math.random() - 0.5) * noise,
        z: z + (x * y - beta * z) * dt + (Math.random() - 0.5) * noise
      };
    };

// src/components/Home/LorenzAttractor.js
const project = (point) => {
  const isMobile = window.innerWidth <= 768;
  const scale = Math.min(canvas.width, canvas.height) / 50;  // Keep original scale
  
  return {
    x: point.x * scale + canvas.width / 2,  // Keep original centering
    y: -point.z * scale + canvas.height * (isMobile ? 0.65 : 0.80)  // Higher on mobile
  };
};


    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const current = pointsRef.current[pointsRef.current.length - 1];
      const next = calculateNext(current);
      pointsRef.current.push(next);
      
      const maxPoints = 2000;
      if (pointsRef.current.length > maxPoints) {
        pointsRef.current = pointsRef.current.slice(-maxPoints);
      }

      const startDrawingAt = Math.min(20, pointsRef.current.length);
      
      ctx.globalCompositeOperation = 'destination-over';
      ctx.beginPath();
      pointsRef.current.slice(startDrawingAt).forEach((point, i) => {
        const projected = project(point);
        const progress = i / (pointsRef.current.length - startDrawingAt);
        const opacity = progress < 0.1 ? progress * 10 : 1;
        
        // Add slight color variation
        const blueVariation = Math.sin(Date.now() / 5000) * 10;
        ctx.strokeStyle = `rgba(0, ${59 + blueVariation}, 126, ${opacity})`;
        ctx.lineWidth = 1;
        
        if (i === 0) {
          ctx.moveTo(projected.x, projected.y);
        } else {
          ctx.lineTo(projected.x, projected.y);
          if (i % 5 === 0 || i === pointsRef.current.length - startDrawingAt - 1) {
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(projected.x, projected.y);
          }
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

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
        height: '100%',
        minHeight: '600px',
        position: 'relative'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
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
