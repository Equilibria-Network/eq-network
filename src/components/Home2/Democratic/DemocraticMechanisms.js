// src/components/Home2/Democratic/DemocraticMechanisms.js
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const DemocraticMechanisms = ({ className, style }) => {
  const svgRef = useRef(null);
  const [adversarialRatio, setAdversarialRatio] = useState(0.1);
  const [systemHealth, setSystemHealth] = useState(100);
  const [currentPhase, setCurrentPhase] = useState('info');
  const [mechanismType] = useState('Liquid Democracy');
  
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 350; // Reduced from 400
    const height = 350; // Reduced from 400  
    const centerX = width / 2;
    const centerY = height / 2 - 15; // Less shift needed
    const radius = 110; // Reduced from 140
    
    svg.attr('width', width).attr('height', height);
    svg.selectAll('*').remove();
    
    // Get theme colors
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--ifm-color-primary').trim() || '#003B7E';
    
    // Define arrow marker for direction indicators
    const defs = svg.append('defs');
    
    defs.append('marker')
      .attr('id', 'arrowhead-info')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-3L8,0L0,3')
      .attr('fill', primaryColor)
      .attr('opacity', 0.7);
    
    defs.append('marker')
      .attr('id', 'arrowhead-vote')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-3L8,0L0,3')
      .attr('fill', '#22c55e')
      .attr('opacity', 0.7);
    
    defs.append('marker')
      .attr('id', 'arrowhead-adversarial')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-3L8,0L0,3')
      .attr('fill', '#ef4444')
      .attr('opacity', 0.7);
    
    // Create nodes in dense network layout
    const createNodes = (adversarialRatio) => {
      const nodes = [];
      const totalNodes = 10; // Reduced for better fit
      const adversarialCount = Math.floor((totalNodes - 1) * adversarialRatio);
      
      for (let i = 0; i < totalNodes; i++) {
        const angle = (i / totalNodes) * 2 * Math.PI;
        const isMarket = i === 0;
        const isDelegate = !isMarket && i <= 3; // Reduced delegates
        const isAdversarial = !isMarket && (i - 1) < adversarialCount;
        
        nodes.push({
          id: isMarket ? 'market' : `agent${i-1}`,
          type: isMarket ? 'market' : (isDelegate ? 'delegate' : 'voter'),
          alignment: isMarket ? 'neutral' : (isAdversarial ? 'adversarial' : 'cooperative'),
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          size: isMarket ? 16 : (isDelegate ? 12 : 10), // Reduced sizes
          angle: angle
        });
      }
      
      return nodes;
    };
    
    // Enhanced connection creation with arrows
    const createConnections = (nodes, phase, health) => {
      const connections = [];
      const marketNode = nodes.find(n => n.type === 'market');
      const agentNodes = nodes.filter(n => n.type !== 'market');
      
      if (phase === 'info') {
        agentNodes.forEach(agent => {
          const distance = Math.abs(agent.angle - marketNode.angle);
          const isClose = distance < Math.PI/3 || distance > 5*Math.PI/3;
          const signalStrength = health / 100;
          
          connections.push({
            source: marketNode,
            target: agent,
            type: 'info',
            style: agent.type === 'delegate' ? 'solid' : 'dashed',
            weight: (agent.type === 'delegate' ? 2 : 1.2) * signalStrength,
            color: agent.alignment === 'adversarial' ? '#ef4444' : primaryColor,
            opacity: signalStrength * (isClose ? 0.8 : 0.5),
            marker: agent.alignment === 'adversarial' ? 'arrowhead-adversarial' : 'arrowhead-info'
          });
        });
        
        // Peer information (reduced for cleaner look)
        agentNodes.forEach((agent1, i) => {
          agentNodes.forEach((agent2, j) => {
            if (i < j && Math.random() < 0.3) { // Reduced frequency
              const angleDiff = Math.abs(agent1.angle - agent2.angle);
              const isAdjacent = angleDiff < Math.PI/3;
              
              if (isAdjacent && Math.random() < health / 100) {
                connections.push({
                  source: agent1,
                  target: agent2,
                  type: 'peer-info',
                  style: 'dotted',
                  weight: 1,
                  color: primaryColor,
                  opacity: (health / 100) * 0.3,
                  marker: 'arrowhead-info'
                });
              }
            }
          });
        });
      } else if (phase === 'voting') {
        agentNodes.forEach(agent => {
          const voteStrength = agent.alignment === 'adversarial' ? 
            0.4 + (1 - health/100) * 0.6 :
            0.8 * (health / 100);
          
          connections.push({
            source: agent,
            target: marketNode,
            type: 'vote',
            style: agent.alignment === 'adversarial' ? 'dashed' : 'solid',
            weight: (agent.type === 'delegate' ? 2.5 : 1.8) * voteStrength,
            color: agent.alignment === 'adversarial' ? '#ef4444' : '#22c55e',
            opacity: voteStrength * 0.8,
            marker: agent.alignment === 'adversarial' ? 'arrowhead-adversarial' : 'arrowhead-vote'
          });
        });
        
        // Delegation networks
        const goodDelegates = agentNodes.filter(n => n.type === 'delegate' && n.alignment === 'cooperative');
        const voters = agentNodes.filter(n => n.type === 'voter');
        
        voters.forEach(voter => {
          if (voter.alignment === 'cooperative' && goodDelegates.length > 0) {
            let bestDelegate = goodDelegates.reduce((best, delegate) => {
              const distance = Math.abs(voter.angle - delegate.angle);
              return distance < Math.abs(voter.angle - best.angle) ? delegate : best;
            });
            
            connections.push({
              source: voter,
              target: bestDelegate,
              type: 'delegation',
              style: 'dotted',
              weight: 1.2,
              color: '#8b5cf6',
              opacity: (health / 100) * 0.6,
              marker: 'arrowhead-info'
            });
          }
        });
      }
      
      return connections;
    };
    
    const nodes = createNodes(adversarialRatio);
    const newHealth = Math.max(15, 100 - (adversarialRatio * 85));
    setSystemHealth(Math.round(newHealth));
    
    const connections = createConnections(nodes, currentPhase, newHealth);
    const container = svg.append('g');
    
    // Background network (sparser)
    nodes.forEach((node1, i) => {
      nodes.forEach((node2, j) => {
        if (i < j && Math.random() < 0.15) { // Much sparser
          container.append('line')
            .attr('x1', node1.x)
            .attr('y1', node1.y)
            .attr('x2', node2.x)
            .attr('y2', node2.y)
            .attr('stroke', primaryColor)
            .attr('stroke-width', 0.5)
            .attr('stroke-opacity', 0.04)
            .attr('stroke-dasharray', '1,6');
        }
      });
    });
    
    // Draw connections with arrows
    const drawConnections = (connections) => {
      connections.forEach((conn, index) => {
        setTimeout(() => {
          const line = container.append('line')
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
          
          line.transition()
            .duration(500) // Faster animation
            .ease(d3.easeQuadOut)
            .attr('x2', conn.target.x)
            .attr('y2', conn.target.y)
            .attr('stroke-opacity', conn.opacity)
            .transition()
            .duration(800)
            .attr('stroke-opacity', conn.opacity * 0.25);
            
        }, index * 40); // Faster stagger
      });
    };
    
    // Draw nodes
    const nodeGroups = container.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);
    
    nodeGroups.append('circle')
      .attr('r', d => d.size)
      .attr('fill', d => {
        if (d.type === 'market') return primaryColor;
        return d.alignment === 'adversarial' ? '#ef4444' : primaryColor;
      })
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .attr('opacity', d => d.type === 'market' ? Math.max(0.6, newHealth/100) : 0.9);
    
    // Market indicator (use SVG if available)
    nodeGroups.filter(d => d.type === 'market')
      .append('rect')
      .attr('x', -4)
      .attr('y', -4)
      .attr('width', 8)
      .attr('height', 8)
      .attr('fill', 'white')
      .attr('opacity', 0.9);
    
    // Delegate indicators
    nodeGroups.filter(d => d.type === 'delegate')
      .append('circle')
      .attr('r', 3)
      .attr('fill', 'white')
      .attr('opacity', 0.9);
    
    // Status text (smaller)
    const statusText = container.append('text')
      .attr('x', centerX)
      .attr('y', height - 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-family', 'Arial, sans-serif')
      .attr('fill', primaryColor)
      .attr('font-weight', '500');
    
    const adversarialCount = Math.floor((nodes.length - 1) * adversarialRatio);
    statusText.text(`${mechanismType} • Adversaries: ${adversarialCount} • System Health: ${Math.round(newHealth)}%`);
    
    drawConnections(connections);
    
  }, [adversarialRatio, currentPhase, mechanismType]);
  
  // Faster animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase(prev => {
        if (prev === 'info') {
          return 'voting';
        } else {
          setAdversarialRatio(prevRatio => {
            const newRatio = prevRatio + 0.05; // Faster progression
            return newRatio > 0.85 ? 0.1 : newRatio;
          });
          return 'info';
        }
      });
    }, 1800); // Faster cycle: 1.8s instead of 2.5s
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      className={className}
      style={{
        width: '100%',
        height: '350px', // Match SVG height
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default DemocraticMechanisms;
