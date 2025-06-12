// src/components/Home2/Democratic/DemocraticMechanisms.js
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

// =============================================================================
// CONFIGURATION AND CONSTANTS
// =============================================================================

const MECHANISM_CONFIG = {
  direct: {
    name: 'Direct Democracy',
    totalNodes: 10,
    delegateCount: 3,
    infoPhaseLabel: 'Forecast',
    votePhaseLabel: 'Vote'
  }
};

const VISUAL_CONFIG = {
  padding: 10,
  textSpace: 50,
  maxVisualizationSize: 600,
  radiusMultiplier: 0.35,
  nodeSizes: {
    market: 45,
    decisionCenter: 45,
    delegate: 32,
    voter: 28
  },
  lineWeights: {
    info: { delegate: 2.5, voter: 1.8 },
    peer: 1.2,
    vote: 2.2
  }
};

const NODE_COLORS = {
  market: 'primary',
  'decision-center': 'primary-darker',
  delegate: 'primary-lighter', 
  voter: 'primary',
  adversarial: '#ef4444'
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const getThemeColors = () => {
  const getColor = (cssVar) => 
    getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
    
  return {
    primary: getColor('--ifm-color-primary') || '#003B7E',
    'primary-lighter': getColor('--ifm-color-primary-lighter') || '#0055C4',
    'primary-darker': getColor('--ifm-color-primary-darker') || '#002F64'
  };
};

const calculateNodePosition = (index, total, centerX, centerY, radius) => {
  const angle = (index / total) * 2 * Math.PI;
  return {
    x: centerX + Math.cos(angle) * radius,
    y: centerY + Math.sin(angle) * radius,
    angle
  };
};

// =============================================================================
// NODE CREATION
// =============================================================================

const createDirectDemocracyNodes = (adversarialRatio, centerX, centerY, radius, config) => {
  const nodes = [];
  const { totalNodes, delegateCount } = config;
  const adversarialCount = Math.floor((totalNodes - 2) * adversarialRatio); // Exclude market & decision center
  
  // Create nodes in circle - market at top (0), decision center at bottom (middle)
  for (let i = 0; i < totalNodes; i++) {
    const position = calculateNodePosition(i, totalNodes, centerX, centerY, radius);
    
    let nodeData;
    if (i === 0) {
      // Market at top
      nodeData = {
        id: 'market',
        type: 'market', 
        alignment: 'neutral',
        size: VISUAL_CONFIG.nodeSizes.market
      };
    } else if (i === Math.floor(totalNodes / 2)) {
      // Decision center at bottom (opposite market)
      nodeData = {
        id: 'decision-center',
        type: 'decision-center',
        alignment: 'neutral', 
        size: VISUAL_CONFIG.nodeSizes.decisionCenter
      };
    } else {
      // Agents
      const agentIndex = i > Math.floor(totalNodes / 2) ? i - 2 : i - 1; // Adjust for market & decision center
      const isDelegate = agentIndex < delegateCount;
      const isAdversarial = agentIndex < adversarialCount;
      
      nodeData = {
        id: `agent${agentIndex}`,
        type: isDelegate ? 'delegate' : 'voter',
        alignment: isAdversarial ? 'adversarial' : 'cooperative',
        size: isDelegate ? VISUAL_CONFIG.nodeSizes.delegate : VISUAL_CONFIG.nodeSizes.voter
      };
    }
    
    nodes.push({
      ...nodeData,
      ...position
    });
  }
  
  return nodes;
};

// =============================================================================
// CONNECTION CREATION
// =============================================================================

const createInfoPhaseConnections = (nodes, health, colors, config) => {
  const connections = [];
  const marketNode = nodes.find(n => n.type === 'market');
  const agentNodes = nodes.filter(n => n.type !== 'market' && n.type !== 'decision-center');
  
  // Market → Agents (information distribution)
  agentNodes.forEach(agent => {
    const signalStrength = health / 100;
    const weight = agent.type === 'delegate' ? 
      VISUAL_CONFIG.lineWeights.info.delegate : 
      VISUAL_CONFIG.lineWeights.info.voter;
    
    connections.push({
      source: marketNode,
      target: agent,
      type: 'info-distribution',
      label: config.infoPhaseLabel,
      style: agent.type === 'delegate' ? 'solid' : 'dashed',
      weight,
      color: agent.alignment === 'adversarial' ? NODE_COLORS.adversarial : colors.primary,
      opacity: signalStrength * 0.7,
      marker: agent.alignment === 'adversarial' ? 'arrow-adversarial' : 'arrow-info'
    });
  });
  
  // Peer information sharing
  agentNodes.forEach((agent1, i) => {
    agentNodes.forEach((agent2, j) => {
      if (i < j && Math.random() < 0.15) {
        const dx = agent1.x - agent2.x;
        const dy = agent1.y - agent2.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        const maxDistance = (nodes.length > 8) ? 150 : 200; // Adjust based on circle size
        
        if (distance < maxDistance) {
          connections.push({
            source: agent1,
            target: agent2,
            type: 'peer-communication',
            label: 'Information Sharing',
            style: 'dotted',
            weight: VISUAL_CONFIG.lineWeights.peer,
            color: colors['primary-lighter'],
            opacity: (health / 100) * 0.4,
            marker: 'arrow-info'
          });
        }
      }
    });
  });
  
  return connections;
};

const createVotingPhaseConnections = (nodes, health, colors, config) => {
  const connections = [];
  const decisionCenterNode = nodes.find(n => n.type === 'decision-center');
  const agentNodes = nodes.filter(n => n.type !== 'market' && n.type !== 'decision-center');
  
  // Agents → Decision Center (voting)
  agentNodes.forEach(agent => {
    const voteStrength = agent.alignment === 'adversarial' ? 
      0.4 + (1 - health/100) * 0.6 : 
      0.8 * (health / 100);
    
    connections.push({
      source: agent,
      target: decisionCenterNode,
      type: 'voting',
      label: config.votePhaseLabel,
      style: 'solid',
      weight: VISUAL_CONFIG.lineWeights.vote, // Equal weight in direct democracy
      color: agent.alignment === 'adversarial' ? NODE_COLORS.adversarial : colors['primary-darker'],
      opacity: voteStrength * 0.8,
      marker: agent.alignment === 'adversarial' ? 'arrow-adversarial' : 'arrow-vote'
    });
  });
  
  return connections;
};

const createConnections = (nodes, phase, health, colors, mechanismConfig) => {
  if (phase === 'info') {
    return createInfoPhaseConnections(nodes, health, colors, mechanismConfig);
  } else if (phase === 'voting') {
    return createVotingPhaseConnections(nodes, health, colors, mechanismConfig);
  }
  return [];
};

// =============================================================================
// RENDERING FUNCTIONS  
// =============================================================================

const createColorFilters = (svg, colors) => {
  const defs = svg.append('defs');
  
  // Convert theme color names to actual colors
  const colorMap = {
    'primary': colors.primary,
    'primary-lighter': colors['primary-lighter'],
    'primary-darker': colors['primary-darker'],
    'adversarial': NODE_COLORS.adversarial
  };
  
  Object.entries(colorMap).forEach(([type, color]) => {
    const filter = defs.append('filter')
      .attr('id', `recolor-${type}`)
      .attr('color-interpolation-filters', 'sRGB');
    
    filter.append('feFlood')
      .attr('flood-color', color)
      .attr('result', 'flood');
    
    filter.append('feComposite')
      .attr('in', 'flood')
      .attr('in2', 'SourceAlpha')
      .attr('operator', 'in');
  });
};

const createArrowMarkers = (svg, colors) => {
  const defs = svg.select('defs');
  
  const arrowTypes = [
    { id: 'info', color: colors.primary },
    { id: 'vote', color: colors['primary-darker'] },
    { id: 'adversarial', color: NODE_COLORS.adversarial },
    { id: 'delegation', color: colors['primary-lighter'] }
  ];
  
  arrowTypes.forEach(({ id, color }) => {
    defs.append('marker')
      .attr('id', `arrow-${id}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-3L8,0L0,3')
      .attr('fill', color)
      .attr('opacity', 0.8);
  });
};

const drawHealthMesh = (svgContainer, nodes, health, colors) => {
  const meshGroup = svgContainer.append('g').attr('class', 'health-mesh');
  
  const meshDensity = (health / 100) * 0.15;
  const meshOpacity = (health / 100) * 0.08;
  const connectionStability = health / 100;
  
  nodes.forEach((node1, i) => {
    nodes.forEach((node2, j) => {
      if (i < j && Math.random() < meshDensity) {
        const isConnected = Math.random() < connectionStability;
        
        if (isConnected) {
          const line = meshGroup.append('line')
            .attr('x1', node1.x)
            .attr('y1', node1.y)
            .attr('x2', node2.x)
            .attr('y2', node2.y)
            .attr('stroke', colors.primary)
            .attr('stroke-width', 0.5)
            .attr('stroke-opacity', meshOpacity)
            .attr('stroke-dasharray', health > 50 ? 'none' : '2,4');
          
          if (health < 30) {
            line.append('animate')
              .attr('attributeName', 'stroke-opacity')
              .attr('values', `${meshOpacity};0;${meshOpacity}`)
              .attr('dur', '2s')
              .attr('repeatCount', 'indefinite');
          }
        }
      }
    });
  });
};

const drawConnections = (svgContainer, connections) => {
  connections.forEach((conn, index) => {
    setTimeout(() => {
      // Draw the line
      const line = svgContainer.append('line')
        .attr('class', `connection-${conn.type}`)
        .attr('x1', conn.source.x)
        .attr('y1', conn.source.y)
        .attr('x2', conn.source.x)
        .attr('y2', conn.source.y)
        .attr('stroke', conn.color)
        .attr('stroke-width', conn.weight)
        .attr('stroke-opacity', 0)
        .attr('stroke-dasharray', 
          conn.style === 'dashed' ? '6,3' :
          conn.style === 'dotted' ? '2,2' : 'none')
        .attr('marker-end', `url(#${conn.marker})`);
      
      // Calculate label position and rotation
      const midX = (conn.source.x + conn.target.x) / 2;
      const midY = (conn.source.y + conn.target.y) / 2;
      const dx = conn.target.x - conn.source.x;
      const dy = conn.target.y - conn.source.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      // Add connection label
      const label = svgContainer.append('text')
        .attr('x', midX)
        .attr('y', midY - 8)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-family', 'system-ui, sans-serif')
        .attr('font-weight', '500')
        .attr('fill', conn.color)
        .attr('opacity', 0)
        .attr('transform', `rotate(${Math.abs(angle) > 90 ? angle + 180 : angle}, ${midX}, ${midY - 8})`)
        .text(conn.label);
      
      // Animate line and label
      line.transition()
        .duration(500)
        .ease(d3.easeQuadOut)
        .attr('x2', conn.target.x)
        .attr('y2', conn.target.y)
        .attr('stroke-opacity', conn.opacity);
      
      label.transition()
        .delay(250)
        .duration(300)
        .attr('opacity', Math.min(0.8, conn.opacity + 0.2));
        
    }, index * 40);
  });
};

const drawNodes = (svgContainer, nodes, health) => {
  const nodeGroups = svgContainer.selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.x}, ${d.y})`);
  
  nodeGroups.each(function(d) {
    const group = d3.select(this);
    
    let svgPath, filterType;
    
    if (d.type === 'market') {
      svgPath = '/img/home/research/visualization/market.svg';
      filterType = 'primary';
    } else if (d.type === 'decision-center') {
      svgPath = '/img/home/research/visualization/decision_center.svg';
      filterType = 'primary-darker';
    } else if (d.alignment === 'adversarial') {
      svgPath = '/img/home/research/visualization/adversary.svg';
      filterType = 'adversarial';
    } else {
      svgPath = '/img/home/research/visualization/person.svg';
      filterType = d.type === 'delegate' ? 'primary-lighter' : 'primary';
    }
    
    group.append('image')
      .attr('href', svgPath)
      .attr('x', -d.size/2)
      .attr('y', -d.size/2)
      .attr('width', d.size)
      .attr('height', d.size)
      .attr('filter', `url(#recolor-${filterType})`)
      .attr('opacity', d.type === 'market' || d.type === 'decision-center' ? 
        Math.max(0.7, health/100) : 0.9);
  });
};

const drawStatusText = (svgContainer, centerX, svgHeight, textSpace, adversarialRatio, health, mechanismConfig, colors) => {
  const statusGroup = svgContainer.append('g')
    .attr('transform', `translate(${centerX}, ${svgHeight - textSpace/2})`);
  
  // Mechanism name
  statusGroup.append('text')
    .attr('x', 0)
    .attr('y', -15)
    .attr('text-anchor', 'middle')
    .attr('font-size', '16px')
    .attr('font-family', 'system-ui, sans-serif')
    .attr('font-weight', '600')
    .attr('fill', colors.primary)
    .text(mechanismConfig.name);
  
  // Status line
  const adversarialCount = Math.floor((MECHANISM_CONFIG.direct.totalNodes - 2) * adversarialRatio);
  
  statusGroup.append('text')
    .attr('x', 0)
    .attr('y', 5)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-family', 'system-ui, sans-serif')
    .attr('font-weight', '400')
    .attr('fill', colors.primary)
    .attr('opacity', 0.8)
    .text(`Adversaries: ${adversarialCount} • System Health: ${Math.round(health)}%`);
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const DemocraticMechanisms = ({ className, style, mechanismType = 'direct' }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [adversarialRatio, setAdversarialRatio] = useState(0.1);
  const [systemHealth, setSystemHealth] = useState(100);
  const [currentPhase, setCurrentPhase] = useState('info');
  
  const mechanismConfig = MECHANISM_CONFIG[mechanismType];
  
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    
    if (!container || !mechanismConfig) return;
    
    // Calculate dimensions
    const containerRect = container.getBoundingClientRect();
    const { padding, textSpace, maxVisualizationSize, radiusMultiplier } = VISUAL_CONFIG;
    
    const availableWidth = containerRect.width - (padding * 2);
    const availableHeight = containerRect.height - (padding * 2) - textSpace;
    const visualSize = Math.min(availableWidth, availableHeight, maxVisualizationSize);
    
    const svgWidth = availableWidth + (padding * 2);
    const svgHeight = availableHeight + textSpace + (padding * 2);
    const centerX = svgWidth / 2;
    const centerY = (svgHeight - textSpace) / 2;
    const radius = visualSize * radiusMultiplier;
    
    // Setup SVG
    svg.attr('width', svgWidth).attr('height', svgHeight);
    svg.selectAll('*').remove();
    
    // Get theme colors
    const colors = getThemeColors();
    
    // Create filters and markers
    createColorFilters(svg, colors);
    createArrowMarkers(svg, colors);
    
    // Create nodes and connections
    const nodes = createDirectDemocracyNodes(adversarialRatio, centerX, centerY, radius, mechanismConfig);
    const newHealth = Math.max(15, 100 - (adversarialRatio * 85));
    setSystemHealth(Math.round(newHealth));
    
    const connections = createConnections(nodes, currentPhase, newHealth, colors, mechanismConfig);
    
    // Render everything
    const svgContainer = svg.append('g');
    
    drawHealthMesh(svgContainer, nodes, newHealth, colors);
    drawConnections(svgContainer, connections);
    drawNodes(svgContainer, nodes, newHealth);
    drawStatusText(svgContainer, centerX, svgHeight, textSpace, adversarialRatio, newHealth, mechanismConfig, colors);
    
  }, [adversarialRatio, currentPhase, mechanismType, mechanismConfig]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setAdversarialRatio(prev => prev);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase(prev => {
        if (prev === 'info') {
          return 'voting';
        } else {
          setAdversarialRatio(prevRatio => {
            const newRatio = prevRatio + 0.05;
            return newRatio > 0.85 ? 0.1 : newRatio;
          });
          return 'info';
        }
      });
    }, 1800);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        ...style
      }}
    >
      <svg 
        ref={svgRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block'
        }}
      />
    </div>
  );
};

export default DemocraticMechanisms;
