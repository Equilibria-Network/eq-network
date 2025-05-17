// src/components/Home/Lorenz_2/utils/useCanvas.js
/**
 * Custom hook for canvas rendering of the Lorenz attractor.
 * 
 * This hook manages the canvas and rendering of Lorenz attractor trajectories,
 * separating the rendering concerns from simulation logic and UI.
 * 
 * Responsibilities:
 * - Manages canvas sizing and resize handling
 * - Renders primary and secondary trajectories
 * - Handles different perspective projections
 * - Manages canvas drawing and clearing
 * 
 * Dependencies:
 * - lorenzUtils.js: For projection functions and display configuration
 */

import { useRef, useEffect } from 'react';
import { projectPoint } from './lorenzUtils';

// Export function directly
export function useCanvas(
  containerRef, 
  {
    config,
    pointsRef,
    secondaryPointsRef = null,
    colors = { 
      primary: { r: 0, g: 59, b: 126 },
      secondary: { r: 0, g: 180, b: 100 } 
    },
    perspective = 'xz',
    showSecondaryTrajectory = false
  }
) {
  const canvasRef = useRef(null);
  
  // Set up canvas and handle resizing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      
      if (!canvas || !container) return;
      
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Force a redraw when resizing
      drawPoints();
    };
    
    window.addEventListener('resize', handleResize);
    // Initial resize
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef]);
  
  // Draw current points to canvas
  const drawPoints = () => {
    const canvas = canvasRef.current;
    if (!canvas || !config || !pointsRef.current) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw primary trajectory
    drawTrajectory(
      ctx, 
      canvas, 
      pointsRef.current.slice(config.animation.startDrawingAt), 
      colors.primary,
      perspective
    );
    
    // Draw secondary trajectory if enabled and available
    if (showSecondaryTrajectory && secondaryPointsRef && secondaryPointsRef.current) {
      drawTrajectory(
        ctx, 
        canvas, 
        secondaryPointsRef.current.slice(config.animation.startDrawingAt), 
        colors.secondary,
        perspective
      );
    }
  };
  
  // Helper function to draw a trajectory with proper styling
  const drawTrajectory = (ctx, canvas, points, color, perspective) => {
    if (!points || points.length === 0) return;
    
    ctx.globalCompositeOperation = 'destination-over';
    ctx.beginPath();
    
    points.forEach((point, i) => {
      const projected = projectPoint(
        point, 
        canvas, 
        config.display.bounds, 
        perspective,
        config.animation.padding
      );
      
      const progress = i / points.length;
      const opacity = progress < 0.1 ? progress * 10 : 1;
      
      ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
      ctx.lineWidth = 1;
      
      if (i === 0) {
        ctx.moveTo(projected.x, projected.y);
      } else {
        ctx.lineTo(projected.x, projected.y);
        if (i % config.animation.strokeInterval === 0 || i === points.length - 1) {
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(projected.x, projected.y);
        }
      }
    });
  };
  
  // Update canvas when points or configuration changes
  useEffect(() => {
    drawPoints();
  }, [
    config, 
    perspective, 
    showSecondaryTrajectory,
    // Note: We don't include pointsRef in dependencies as it would cause
    // excessive re-renders. Instead, the animation loop will trigger redraws.
  ]);
  
  return {
    canvasRef,
    drawPoints
  };
}

// Also provide a default export for backward compatibility
export default useCanvas;
