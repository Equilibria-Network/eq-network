// src/components/Home2/Democratic/DemocraticMechanisms.js
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const DemocraticMechanisms = ({ className, style }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [adversarialRatio, setAdversarialRatio] = useState(0.1);
  const [systemHealth, setSystemHealth] = useState(100);
  const [currentPhase, setCurrentPhase] = useState('info');
  const [mechanismType] = useState('Modelling Direct Democracy');
  
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    
    if (!container) return;
    
    // Get actual container dimensions
    const containerRect = container.getBoundingClientRect();
    
    // Calculate SVG dimensions with minimal padding for text and labels
    const padding = 10; // Minimal padding
    const textSpace = 50; // Space at bottom for status text
    
    const availableWidth = containerRect.width - (padding * 2);
    const availableHeight = containerRect.height - (padding * 2) - textSpace;
    
    // Calculate size for the visualization circle - use much more space
    const visualSize = Math.min(availableWidth, availableHeight, 600);
    
    // SVG dimensions include padding
    const svgWidth = availableWidth + (padding * 2);
    const svgHeight = availableHeight + textSpace + (padding * 2);
    
    // Center the visualization within the SVG
    const centerX = svgWidth / 2;
    const centerY = (svgHeight - textSpace) / 2;
    const radius = visualSize * 0.35; // Circle radius
    
    svg.attr('width', svgWidth).attr('height', svgHeight);
    svg.selectAll('*').remove();
    
    // Get theme colors
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--ifm-color-primary').trim() || '#003B7E';
    const primaryLighter = getComputedStyle(document.documentElement)
      .getPropertyValue('--ifm-color-primary-lighter').trim() || '#0055C4';
    const primaryDarker = getComputedStyle(document.documentElement)
      .getPropertyValue('--ifm-color-primary-darker').trim() || '#002F64';
    
    // Define colors using only theme colors
    const nodeColors = {
      market: primaryColor,
      delegate: primaryLighter,
      voter: primaryColor,
      adversarial: '#ef4444'
    };
    
    // Create color filters for SVGs
    const defs = svg.append('defs');
    
    Object.entries(nodeColors).forEach(([type, color]) => {
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
    
    // Arrow markers using theme colors
    const arrowTypes = [
      { id: 'info', color: primaryColor },
      { id: 'vote', color: primaryDarker },
      { id: 'adversarial', color: '#ef4444' },
      { id: 'delegation', color: primaryLighter }
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
    
    const createNodes = (adversarialRatio) => {
      const nodes = [];
      const totalNodes = 10;
      const adversarialCount = Math.floor((totalNodes - 1) * adversarialRatio);
      
      for (let i = 0; i < totalNodes; i++) {
        const angle = (i / totalNodes) * 2 * Math.PI;
        const isMarket = i === 0;
        const isDelegate = !isMarket && i <= 3;
        const isAdversarial = !isMarket && (i - 1) < adversarialCount;
        
        nodes.push({
          id: isMarket ? 'market' : `agent${i-1}`,
          type: isMarket ? 'market' : (isDelegate ? 'delegate' : 'voter'),
          alignment: isMarket ? 'neutral' : (isAdversarial ? 'adversarial' : 'cooperative'),
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          size: isMarket ? 40 : (isDelegate ? 32 : 28), // Fixed sizes
          angle: angle
        });
      }
      
      return nodes;
    };
    
    const createConnections = (nodes, phase, health) => {
      const connections = [];
      const marketNode = nodes.find(n => n.type === 'market');
      const agentNodes = nodes.filter(n => n.type !== 'market');
      
      if (phase === 'info') {
        // Direct Democracy: Market distributes same info to all agents
        agentNodes.forEach(agent => {
          const signalStrength = health / 100;
          
          connections.push({
            source: marketNode,
            target: agent,
            type: 'info-distribution',
            label: 'Market → Agent',
            style: agent.type === 'delegate' ? 'solid' : 'dashed',
            weight: agent.type === 'delegate' ? 2.5 : 1.8,
            color: agent.alignment === 'adversarial' ? '#ef4444' : primaryColor,
            opacity: signalStrength * 0.7,
            marker: agent.alignment === 'adversarial' ? 'arrow-adversarial' : 'arrow-info'
          });
        });
        
        // Peer information sharing
        agentNodes.forEach((agent1, i) => {
          agentNodes.forEach((agent2, j) => {
            if (i < j && Math.random() < 0.15) {
              const angleDiff = Math.abs(agent1.angle - agent2.angle);
              const isAdjacent = angleDiff < Math.PI/3;
              
              if (isAdjacent) {
                connections.push({
                  source: agent1,
                  target: agent2,
                  type: 'peer-communication',
                  label: 'Information Sharing',
                  style: 'dotted',
                  weight: 1.2,
                  color: primaryLighter,
                  opacity: (health / 100) * 0.4,
                  marker: 'arrow-info'
                });
              }
            }
          });
        });
        
      } else if (phase === 'voting') {
        // Direct Democracy: All agents vote directly to market
        agentNodes.forEach(agent => {
          const voteStrength = agent.alignment === 'adversarial' ? 
            0.4 + (1 - health/100) * 0.6 : 
            0.8 * (health / 100);
          
          connections.push({
            source: agent,
            target: marketNode,
            type: 'voting',
            label: 'Vote', // All agents vote directly, no delegation
            style: 'solid',
            weight: 2.2, // Equal weight for all votes
            color: agent.alignment === 'adversarial' ? '#ef4444' : primaryDarker,
            opacity: voteStrength * 0.8,
            marker: agent.alignment === 'adversarial' ? 'arrow-adversarial' : 'arrow-vote'
          });
        });
      }
      
      return connections;
    };
    
    const nodes = createNodes(adversarialRatio);
    const newHealth = Math.max(15, 100 - (adversarialRatio * 85));
    setSystemHealth(Math.round(newHealth));
    
    const connections = createConnections(nodes, currentPhase, newHealth);
    const svgContainer = svg.append('g');
    
    // Draw connections with labels
    const drawConnections = (connections) => {
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
          
          // Calculate midpoint for label
          const midX = (conn.source.x + conn.target.x) / 2;
          const midY = (conn.source.y + conn.target.y) / 2;
          
          // Calculate angle for label rotation
          const dx = conn.target.x - conn.source.x;
          const dy = conn.target.y - conn.source.y;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          
          // Add connection label
          const label = svgContainer.append('text')
            .attr('x', midX)
            .attr('y', midY - 8) // Position above the line
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .attr('font-family', 'system-ui, sans-serif')
            .attr('font-weight', '500')
            .attr('fill', conn.color)
            .attr('opacity', 0)
            .attr('transform', `rotate(${Math.abs(angle) > 90 ? angle + 180 : angle}, ${midX}, ${midY - 8})`)
            .text(conn.label);
          
          // Animate line
          line.transition()
            .duration(500)
            .ease(d3.easeQuadOut)
            .attr('x2', conn.target.x)
            .attr('y2', conn.target.y)
            .attr('stroke-opacity', conn.opacity);
          
          // Animate label
          label.transition()
            .delay(250)
            .duration(300)
            .attr('opacity', Math.min(0.8, conn.opacity + 0.2));
            
        }, index * 40);
      });
    };
    
    // Draw nodes using SVGs
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
        filterType = 'market';
      } else if (d.alignment === 'adversarial') {
        svgPath = '/img/home/research/visualization/adversary.svg';
        filterType = 'adversarial';
      } else {
        svgPath = '/img/home/research/visualization/person.svg';
        filterType = d.type === 'delegate' ? 'delegate' : 'voter';
      }
      
      group.append('image')
        .attr('href', svgPath)
        .attr('x', -d.size/2)
        .attr('y', -d.size/2)
        .attr('width', d.size)
        .attr('height', d.size)
        .attr('filter', `url(#recolor-${filterType})`)
        .attr('opacity', d.type === 'market' ? Math.max(0.7, newHealth/100) : 0.9);
    });
    
    // Status text - positioned in the text area
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
      .attr('fill', primaryColor)
      .text(mechanismType);
    
    // Status line - just adversaries and health, no directional info
    const adversarialCount = Math.floor((nodes.length - 1) * adversarialRatio);
    
    statusGroup.append('text')
      .attr('x', 0)
      .attr('y', 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-family', 'system-ui, sans-serif')
      .attr('font-weight', '400')
      .attr('fill', primaryColor)
      .attr('opacity', 0.8)
      .text(`Adversaries: ${adversarialCount} • System Health: ${Math.round(newHealth)}%`);
    
    drawConnections(connections);
    
  }, [adversarialRatio, currentPhase, mechanismType]);
  
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
