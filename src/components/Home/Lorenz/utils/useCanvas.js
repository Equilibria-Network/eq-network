// src/components/Home/Lorenz/utils/useCanvas.js
// Enhanced to handle branching predictions rendering

import { useRef, useEffect } from 'react';
import { projectPoint } from './lorenzUtils';

export function useCanvas(
  containerRef, 
  {
    config,
    pointsRef,
    secondaryPointsRef = null,
    predictionPointsRef = null,
    branchingPredictions = null, // New: object with multiple predictions
    algorithmColors = {}, // New: colors for each algorithm
    colors = { 
      primary: { r: 0, g: 59, b: 126 },
      secondary: { r: 0, g: 0, b: 0 },
      prediction: { r: 0, g: 0, b: 0 }
    },
    perspective = 'xz',
    showSecondaryTrajectory = false,
    showPrediction = false,
    showBranchingPredictions = false, // New flag
    lineWidth = 1.5
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
    
    // Enable anti-aliasing for smoother lines
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw branching predictions if enabled
    if (showBranchingPredictions && branchingPredictions) {
      drawBranchingPredictions(ctx, canvas, branchingPredictions, algorithmColors, perspective);
    }
    
    // Draw single prediction trajectory if enabled (legacy support)
    if (showPrediction && predictionPointsRef && predictionPointsRef.current && predictionPointsRef.current.length > 0) {
      drawPredictionTrajectory(
        ctx, 
        canvas, 
        predictionPointsRef.current,
        colors.prediction || { r: 0, g: 0, b: 0 },
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
    
    // Draw current point markers
    drawCurrentPointMarkers(ctx, canvas, perspective);
  };
  
  // NEW: Draw branching predictions from multiple algorithms
  const drawBranchingPredictions = (ctx, canvas, predictions, algorithmColors, perspective) => {
    if (!predictions || Object.keys(predictions).length === 0) return;
    
    // Get current point as branch origin
    const currentPoint = pointsRef.current[pointsRef.current.length - 1];
    if (!currentPoint) return;
    
    // Draw each prediction branch
    Object.entries(predictions).forEach(([algorithmId, predictionPoints]) => {
      if (!predictionPoints || predictionPoints.length === 0) return;
      
      const color = algorithmColors[algorithmId] || { r: 128, g: 128, b: 128 };
      
      // Draw the prediction branch
      drawPredictionBranch(ctx, canvas, currentPoint, predictionPoints, color, perspective, algorithmId);
    });
  };
  
  // NEW: Draw a single prediction branch with mathematical accuracy
  const drawPredictionBranch = (ctx, canvas, startPoint, predictionPoints, color, perspective, algorithmId) => {
    if (!predictionPoints || predictionPoints.length === 0) return;
    
    // Project starting point
    const startProjected = projectPoint(
      startPoint,
      canvas,
      config.display.bounds,
      perspective,
      config.animation.padding
    );
    
    // Set line style based on algorithm
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Different line styles for different algorithms
    const lineStyles = {
      'linear': [5, 5], // Dashed - least accurate
      'euler': [10, 3], // Dash-dot - medium accuracy  
      'rk4': [], // Solid - most accurate
      'predicted-rk4': [2, 2] // Dotted - ML prediction
    };
    
    const dashPattern = lineStyles[algorithmId] || [];
    ctx.setLineDash(dashPattern);
    
    // Draw branch starting from current point
    ctx.beginPath();
    ctx.moveTo(startProjected.x, startProjected.y);
    
    let prevX = startProjected.x;
    let prevY = startProjected.y;
    
    // Draw each prediction segment with fading opacity
    predictionPoints.forEach((point, i) => {
      const projected = projectPoint(
        point, 
        canvas, 
        config.display.bounds, 
        perspective,
        config.animation.padding
      );
      
      // Opacity decreases with prediction distance (uncertainty grows)
      const progress = i / predictionPoints.length;
      const baseOpacity = 0.8;
      const opacity = baseOpacity * (1 - progress * 0.7); // Fade from 0.8 to 0.24
      
      // Draw line segment
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(projected.x, projected.y);
      ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
      ctx.stroke();
      
      prevX = projected.x;
      prevY = projected.y;
    });
    
    // Reset line dash
    ctx.setLineDash([]);
    
    // Draw prediction origin marker
    ctx.beginPath();
    ctx.arc(startProjected.x, startProjected.y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`;
    ctx.fill();
    
    // Draw prediction endpoint marker with label (if prediction exists)
    if (predictionPoints.length > 0) {
      const lastPoint = predictionPoints[predictionPoints.length - 1];
      const endProjected = projectPoint(
        lastPoint,
        canvas,
        config.display.bounds,
        perspective,
        config.animation.padding
      );
      
      // Draw endpoint marker
      ctx.beginPath();
      ctx.arc(endProjected.x, endProjected.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`;
      ctx.fill();
      
      // Draw algorithm name label
      const algorithmNames = {
        'linear': 'Linear',
        'euler': 'Euler', 
        'rk4': 'RK4',
        'predicted-rk4': 'ML-RK4'
      };
      
      const labelText = algorithmNames[algorithmId] || algorithmId;
      
      // Set text style
      ctx.font = '11px sans-serif';
      ctx.fontWeight = '600';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      
      // Calculate label position (offset to avoid overlapping with dot)
      const labelX = endProjected.x + 6;
      const labelY = endProjected.y;
      
      // Draw text background for better readability
      const textMetrics = ctx.measureText(labelText);
      const padding = 2;
      const bgX = labelX - padding;
      const bgY = labelY - 6;
      const bgWidth = textMetrics.width + (padding * 2);
      const bgHeight = 12;
      
      // Semi-transparent background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
      
      // Dark mode adjustment
      const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDarkTheme) {
        ctx.fillStyle = 'rgba(33, 37, 41, 0.8)';
        ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
      }
      
      // Draw text
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`;
      ctx.fillText(labelText, labelX, labelY);
    }
  };
  
  // Helper function to draw a trajectory with proper styling
  const drawTrajectory = (ctx, canvas, points, color, perspective) => {
    if (!points || points.length === 0) return;
    
    ctx.beginPath();
    
    // Set line style for high quality
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([]); // Solid line for main trajectory
    
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
  
  // Helper function to draw prediction trajectory with decreasing opacity (legacy)
  const drawPredictionTrajectory = (ctx, canvas, points, color, perspective) => {
    if (!points || points.length === 0) return;
    
    let prevX, prevY;
    
    // Set better line style
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([2, 2]); // Dotted line for single predictions
    
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
        ctx.stroke();
      }
      
      prevX = projected.x;
      prevY = projected.y;
    });
    
    ctx.setLineDash([]); // Reset line dash
  };
  
  // Draw current point markers for all trajectories
  const drawCurrentPointMarkers = (ctx, canvas, perspective) => {
    // Draw primary current point marker
    if (pointsRef.current.length > 0) {
      const lastPoint = pointsRef.current[pointsRef.current.length - 1];
      const projected = projectPoint(
        lastPoint,
        canvas,
        config.display.bounds,
        perspective,
        config.animation.padding
      );
      
      // Draw dot at current position with better appearance
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
      
      // Draw dot at current position with better appearance
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = `rgb(${colors.secondary.r}, ${colors.secondary.g}, ${colors.secondary.b})`;
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
    showBranchingPredictions,
    branchingPredictions,
    lineWidth,
    colors,
    algorithmColors
  ]);
  
  return {
    canvasRef,
    drawPoints
  };
}

// Also provide a default export for backward compatibility
export default useCanvas;
