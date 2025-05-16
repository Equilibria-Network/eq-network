// src/components/Home/Lorenz/useCanvas.js
import { useEffect, useRef } from 'react';
import { projectPoint } from './lorenzUtils';

/**
 * Custom hook for canvas rendering of Lorenz attractor
 * 
 * @param {Array} points - Array of points to render
 * @param {Object} config - Configuration options
 * @param {Object} colorInfo - Color information for rendering
 * @returns {Object} - Canvas ref and resize handler
 */
const useCanvas = (points, config, colorInfo) => {
  const canvasRef = useRef(null);
  
  // Draw points to canvas
  const drawPoints = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-over';
    ctx.beginPath();
    
    const startIndex = config.animation.startDrawingAt;
    const visiblePoints = points.slice(startIndex);
    
    visiblePoints.forEach((point, i) => {
      const projected = projectPoint(
        point, 
        canvas, 
        config.display.bounds, 
        config.animation.padding
      );
      
      const progress = i / (visiblePoints.length);
      const opacity = progress < 0.1 ? progress * 10 : 1;
      
      ctx.strokeStyle = `rgba(${colorInfo.r}, ${colorInfo.g}, ${colorInfo.b}, ${opacity})`;
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
  
  // Handle canvas resize
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    drawPoints();
  };
  
  // Effect to handle resizing
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Effect to draw points when they change
  useEffect(() => {
    handleResize();
    drawPoints();
  }, [points]);
  
  return { canvasRef, handleResize, drawPoints };
};

export default useCanvas;
