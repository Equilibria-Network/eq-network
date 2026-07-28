// src/components/home/LorenzAttractor.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  LORENZ_CONFIG,
  createInitialSeed,
  createPerturbedSeed,
  calculateNext,
  preCalculatePoints,
  projectPoint,
  getCssColor,
  type Point3D,
  type SystemParams,
} from './lorenzUtils';
import styles from './LorenzAttractor.module.css';

export default function LorenzAttractor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Simulation state
  const pointsRef = useRef<Point3D[]>([]);
  const secondaryPointsRef = useRef<Point3D[]>([]);
  const currentPointRef = useRef<Point3D>(createInitialSeed());
  const secondaryPointRef = useRef<Point3D>(createInitialSeed());
  const systemRef = useRef<SystemParams>(LORENZ_CONFIG.system);

  // Initialize canvas dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          setDimensions({
            width: container.clientWidth,
            height: container.clientHeight,
          });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize simulation
  useEffect(() => {
    // Create initial seed and perturbed version
    const initialSeed = createInitialSeed();
    const perturbedSeed = createPerturbedSeed(initialSeed, LORENZ_CONFIG.butterfly.perturbation);

    // Pre-calculate initial points for both trajectories
    const initialPoints = preCalculatePoints(
      initialSeed,
      systemRef.current,
      LORENZ_CONFIG.animation.initialPoints,
      LORENZ_CONFIG.animation.initialSpeed
    );

    const secondaryInitialPoints = preCalculatePoints(
      perturbedSeed,
      systemRef.current,
      LORENZ_CONFIG.animation.initialPoints,
      LORENZ_CONFIG.animation.initialSpeed
    );

    pointsRef.current = initialPoints;
    secondaryPointsRef.current = secondaryInitialPoints;
    currentPointRef.current = initialPoints[initialPoints.length - 1];
    secondaryPointRef.current = secondaryInitialPoints[secondaryInitialPoints.length - 1];
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Calculate new points
      for (let i = 0; i < LORENZ_CONFIG.animation.pointsPerFrame; i++) {
        // Primary trajectory
        const nextPoint = calculateNext(currentPointRef.current, systemRef.current);
        pointsRef.current.push(nextPoint);
        currentPointRef.current = nextPoint;

        // Secondary trajectory (perturbed)
        const nextSecondaryPoint = calculateNext(secondaryPointRef.current, systemRef.current);
        secondaryPointsRef.current.push(nextSecondaryPoint);
        secondaryPointRef.current = nextSecondaryPoint;

        // Limit trail length
        if (pointsRef.current.length > LORENZ_CONFIG.animation.maxPoints) {
          pointsRef.current.shift();
        }
        if (secondaryPointsRef.current.length > LORENZ_CONFIG.animation.maxPoints) {
          secondaryPointsRef.current.shift();
        }
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw both trajectories with different colors
      drawTrajectory(ctx, pointsRef.current, LORENZ_CONFIG.colors.primary, 0.8, true);
      drawTrajectory(ctx, secondaryPointsRef.current, LORENZ_CONFIG.colors.secondary, 0.6, false);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  const drawTrajectory = (
    ctx: CanvasRenderingContext2D,
    points: Point3D[],
    color: { r: number; g: number; b: number },
    baseOpacity: number,
    drawIndicator: boolean = false
  ) => {
    if (points.length < 2) return;

    const canvas = { width: dimensions.width, height: dimensions.height };

    for (let i = 1; i < points.length; i++) {
      const prevPoint = projectPoint(
        points[i - 1],
        canvas,
        LORENZ_CONFIG.display.bounds,
        LORENZ_CONFIG.animation.padding
      );

      const currPoint = projectPoint(
        points[i],
        canvas,
        LORENZ_CONFIG.display.bounds,
        LORENZ_CONFIG.animation.padding
      );

      // Fade effect - older points are more transparent
      const progress = i / points.length;
      const opacity = baseOpacity * (0.1 + 0.9 * progress);

      ctx.beginPath();
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(currPoint.x, currPoint.y);
      ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw indicator circle at the tip (current point)
    if (drawIndicator && points.length > 0) {
      const tipPoint = projectPoint(
        points[points.length - 1],
        canvas,
        LORENZ_CONFIG.display.bounds,
        LORENZ_CONFIG.animation.padding
      );

      ctx.beginPath();
      ctx.arc(tipPoint.x, tipPoint.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${baseOpacity})`;
      ctx.fill();
    }
  };

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className={styles.canvas}
      />
    </div>
  );
}
