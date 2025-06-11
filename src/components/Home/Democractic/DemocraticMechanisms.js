// src/components/Home/Democratic/DemocraticMechanisms.js
// MVP: Fixed 60% adversarial agents, simple voting visualization

import React, { useRef, useEffect, useState } from 'react';
import styles from './DemocraticMechanisms.module.css';

const DemocraticMechanisms = ({ className, style }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Simple state
  const [agents, setAgents] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalUtility, setTotalUtility] = useState(100);
  
  // Fixed parameters for MVP
  const GRID_SIZE = 15; // 15x15 = 225 agents
  const ADVERSARIAL_RATIO = 0.6; // 60% adversarial
  const VOTING_DURATION = 2000; // 2 seconds per vote
  
  // Initialize agents
  useEffect(() => {
    const newAgents = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const x = i % GRID_SIZE;
      const y = Math.floor(i / GRID_SIZE);
      
      newAgents.push({
        id: i,
        x: x,
        y: y,
        type: Math.random() < ADVERSARIAL_RATIO ? 'adversarial' : 'cooperative',
        vote: null,
        isVoting: false
      });
    }
    setAgents(newAgents);
  }, []);
  
  // Canvas setup and resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      
      if (!canvas || !container) return;
      
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      drawAgents();
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [agents]);
  
  // Draw agents on canvas
  const drawAgents = () => {
    const canvas = canvasRef.current;
    if (!canvas || agents.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate grid positioning
    const padding = 40;
    const availableWidth = canvas.width - (2 * padding);
    const availableHeight = canvas.height - (2 * padding);
    const cellWidth = availableWidth / GRID_SIZE;
    const cellHeight = availableHeight / GRID_SIZE;
    const agentRadius = Math.min(cellWidth, cellHeight) * 0.3;
    
    // Draw each agent
    agents.forEach(agent => {
      const centerX = padding + (agent.x * cellWidth) + (cellWidth / 2);
      const centerY = padding + (agent.y * cellHeight) + (cellHeight / 2);
      
      // Agent color based on type
      const colors = {
        cooperative: { r: 59, g: 130, b: 246 }, // Blue
        adversarial: { r: 239, g: 68, b: 68 }   // Red
      };
      
      const color = colors[agent.type];
      
      // Draw agent circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, agentRadius, 0, 2 * Math.PI);
      
      // Fill based on voting state
      if (agent.isVoting) {
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`;
        ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.6)`;
        ctx.fill();
      }
    });
    
    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= GRID_SIZE; i++) {
      // Vertical lines
      const x = padding + (i * cellWidth);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvas.height - padding);
      ctx.stroke();
      
      // Horizontal lines
      const y = padding + (i * cellHeight);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }
  };
  
  // Simulate voting round
  const simulateVoting = () => {
    return new Promise((resolve) => {
      // Phase 1: Start voting animation
      setAgents(prev => prev.map(agent => ({
        ...agent,
        isVoting: true,
        vote: agent.type === 'adversarial' ? 'defect' : 'cooperate'
      })));
      
      setTimeout(() => {
        // Phase 2: Calculate results
        const cooperativeVotes = agents.filter(a => a.type === 'cooperative').length;
        const adversarialVotes = agents.filter(a => a.type === 'adversarial').length;
        
        // Simple utility calculation (adversarial votes reduce utility)
        const utilityLoss = adversarialVotes * 0.5;
        setTotalUtility(prev => Math.max(0, prev - utilityLoss));
        
        // Phase 3: End voting
        setAgents(prev => prev.map(agent => ({
          ...agent,
          isVoting: false
        })));
        
        resolve();
      }, VOTING_DURATION);
    });
  };
  
  // Animation loop
  const runSimulation = async () => {
    if (!isRunning) return;
    
    await simulateVoting();
    setCurrentRound(prev => prev + 1);
    
    // Check if system has collapsed
    if (totalUtility > 0 && isRunning) {
      setTimeout(() => runSimulation(), 500); // Brief pause between rounds
    } else {
      setIsRunning(false);
    }
  };
  
  // Start/stop simulation
  const toggleSimulation = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setIsRunning(true);
      runSimulation();
    }
  };
  
  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentRound(0);
    setTotalUtility(100);
    setAgents(prev => prev.map(agent => ({
      ...agent,
      vote: null,
      isVoting: false
    })));
  };
  
  // Draw whenever agents change
  useEffect(() => {
    drawAgents();
  }, [agents]);
  
  return (
    <div 
      ref={containerRef} 
      className={`${styles.container} ${className || ''}`}
      style={style}
    >
      {/* Canvas for visualization */}
      <canvas ref={canvasRef} className={styles.canvas} />
      
      {/* Simple controls */}
      <div className={styles.controls}>
        <button 
          onClick={toggleSimulation}
          className={styles.button}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button 
          onClick={resetSimulation}
          className={styles.button}
        >
          Reset
        </button>
      </div>
      
      {/* Simple stats */}
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Round:</span>
          <span className={styles.statValue}>{currentRound}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>System Utility:</span>
          <span className={styles.statValue}>{totalUtility.toFixed(1)}%</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Adversarial:</span>
          <span className={styles.statValue}>60%</span>
        </div>
      </div>
    </div>
  );
};

export default DemocraticMechanisms;
