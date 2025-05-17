/**
 * Custom hook for canvas rendering of the Lorenz attractor.
 * 
 * This hook manages the canvas and rendering of Lorenz attractor trajectories,
 * separating the rendering concerns from simulation logic and UI.
 * 
 * Responsibilities:
 * - Manages canvas sizing and resize handling
 * - Renders primary and secondary trajectories
 * - Renders prediction trajectories with decreasing opacity
 * - Handles different perspective projections
 * - Manages canvas drawing and clearing
 * 
 * Dependencies:
 * - lorenzUtils.js: For projection functions and display configuration
 */

// src/components/Home/Lorenz/utils/useCanvas.js
import { useRef, useEffect } from 'react';
import { projectPoint } from './lorenzUtils';

// Export function directly
export function useCanvas(
  containerRef, 
  {
    config,
    pointsRef,
    secondaryPointsRef = null,
    predictionPointsRef = null,
    colors = { 
      primary: { r: 0, g: 59, b: 126 },
      secondary: { r: 0, g: 180, b: 100 },
      prediction: { r: 150, g: 150, b: 150 }
    },
    perspective = 'xz',
    showSecondaryTrajectory = false,
    showPrediction = false
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
    if (!canvas || !config || !pointsRef?.current) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set composition mode for overlapping lines
    ctx.globalCompositeOperation = 'source-over';
    
    // Draw prediction trajectory if enabled
    if (showPrediction && predictionPointsRef && predictionPointsRef.current && predictionPointsRef.current.length > 0) {
      drawPredictionTrajectory(
        ctx, 
        canvas, 
        predictionPointsRef.current,
        colors.prediction || { r: 150, g: 150, b: 150 },
        perspective
      );
    }
    
    // Draw secondary trajectory if enabled
    if (showSecondaryTrajectory && secondaryPointsRef && secondaryPointsRef.current) {
      drawTrajectory(
        ctx, 
        canvas, 
        secondaryPointsRef.current.slice(config.animation.startDrawingAt), 
        colors.secondary,
        perspective
      );
    }
    
    // Draw primary trajectory
    drawTrajectory(
      ctx, 
      canvas, 
      pointsRef.current.slice(config.animation.startDrawingAt), 
      colors.primary,
      perspective
    );
    
    // Draw current point marker for both trajectories
    if (pointsRef.current.length > 0) {
      const lastPoint = pointsRef.current[pointsRef.current.length - 1];
      const projected = projectPoint(
        lastPoint,
        canvas,
        config.display.bounds,
        perspective,
        config.animation.padding
      );
      
      // Draw dot at current position
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = `rgb(${colors.primary.r}, ${colors.primary.g}, ${colors.primary.b})`;
      ctx.fill();
    }
    
    // Draw secondary current point marker if enabled
    if (showSecondaryTrajectory && secondaryPointsRef && secondaryPointsRef.current.length > 0) {
      const lastPoint = secondaryPointsRef.current[secondaryPointsRef.current.length - 1];
      const projected = projectPoint(
        lastPoint,
        canvas,
        config.display.bounds,
        perspective,
        config.animation.padding
      );
      
      // Draw dot at current position
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = `rgb(${colors.secondary.r}, ${colors.secondary.g}, ${colors.secondary.b})`;
      ctx.fill();
    }
  };
  
  // Helper function to draw a trajectory with proper styling
  const drawTrajectory = (ctx, canvas, points, color, perspective) => {
    if (!points || points.length === 0) return;
    
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
  
  // Helper function to draw prediction trajectory with decreasing opacity
  const drawPredictionTrajectory = (ctx, canvas, points, color, perspective) => {
    if (!points || points.length === 0) return;
    
    let prevX, prevY;
    
    // Draw each prediction segment with decreasing opacity
    points.forEach((point, i) => {
      const projected = projectPoint(
        point, 
        canvas, 
        config.display.bounds, 
        perspective,
        config.animation.padding
      );
      
      // Decreasing opacity the further into the future we predict
      const opacity = Math.max(0.1, 1 - (i / points.length));
      
      if (i > 0) {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(projected.x, projected.y);
        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      prevX = projected.x;
      prevY = projected.y;
    });
    
    // Draw dot at the start of prediction (only if we have points)
    if (points.length > 0) {
      const firstPoint = points[0];
      const projected = projectPoint(
        firstPoint,
        canvas,
        config.display.bounds,
        perspective,
        config.animation.padding
      );
      
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`;
      ctx.fill();
    }
  };
  
  // Update canvas when points or configuration changes
  useEffect(() => {
    drawPoints();
  }, [
    config, 
    perspective, 
    showSecondaryTrajectory,
    showPrediction,
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
