import React, { useEffect, useRef } from 'react';
import styles from './NetworkGraph.module.css';

// Utility functions for text handling
const splitTextIntoLines = (text, maxCharsPerLine) => {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });
  
  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

const calculateTextSize = (text, radius) => {
  const baseSize = radius * 0.2;
  const lines = text.split('\n');
  const longestLine = Math.max(...lines.map(line => line.length));
  
  const adjustedSize = Math.min(
    baseSize,
    (radius * 1.6) / longestLine,
    (radius * 1.6) / (lines.length * 1.5)
  );

  return Math.max(8, adjustedSize);
};

export default function NetworkGraph() {
  const svgRef = useRef(null);

  useEffect(() => {
    const centerX = 300;
    const centerY = 200;

    // Layer 1 - Core activities
    const layer1Nodes = [
      {
        id: 'Collective\nIntelligence',
        safeId: 'collective-intelligence',
        x: centerX,
        y: centerY,
        layer: 1,
        description: 'Methods and systems for effective group decision-making and knowledge aggregation',
        radius: 50,
        expandedRadius: 70,
        normalRadius: 50,
        shrunkRadius: 40,
        color: 'var(--ifm-color-primary)'
      },
      {
        id: 'Network\nDynamics',
        safeId: 'network-dynamics',
        x: centerX - 80,
        y: centerY,
        layer: 1,
        description: 'Understanding how information and influence flow through connected systems',
        radius: 50,
        expandedRadius: 70,
        normalRadius: 50,
        shrunkRadius: 40,
        color: 'var(--ifm-color-primary)'
      },
      {
        id: 'Human-AI\nAlignment',
        safeId: 'human-ai-alignment',
        x: centerX + 80,
        y: centerY,
        layer: 1,
        description: 'Ensuring AI systems complement and enhance human capabilities',
        radius: 50,
        expandedRadius: 70,
        normalRadius: 50,
        shrunkRadius: 40,
        color: 'var(--ifm-color-primary)'
      }
    ];

    // Layer 2 - Related activities
    const layer2Count = 6;
    const layer2Radius = 160;
    const layer2Nodes = [
      {
        id: 'Prediction\nMarkets',
        safeId: 'prediction-markets',
        description: 'Market mechanisms for aggregating distributed knowledge',
        radius: 40,
        expandedRadius: 60,
        normalRadius: 40,
        shrunkRadius: 30,
        color: 'var(--ifm-color-emphasis-700)',
        layer: 2
      },
      {
        id: 'Social\nLearning',
        safeId: 'social-learning',
        description: 'How groups learn and adapt through interaction',
        radius: 40,
        expandedRadius: 60,
        normalRadius: 40,
        shrunkRadius: 30,
        color: 'var(--ifm-color-emphasis-700)',
        layer: 2
      },
      {
        id: 'Information\nCascades',
        safeId: 'information-cascades',
        description: 'Patterns of information spread in networks',
        radius: 40,
        expandedRadius: 60,
        normalRadius: 40,
        shrunkRadius: 30,
        color: 'var(--ifm-color-emphasis-700)',
        layer: 2
      },
      {
        id: 'Preference\nAggregation',
        safeId: 'preference-aggregation',
        description: 'Methods for combining individual preferences into group decisions',
        radius: 40,
        expandedRadius: 60,
        normalRadius: 40,
        shrunkRadius: 30,
        color: 'var(--ifm-color-emphasis-700)',
        layer: 2
      },
      {
        id: 'Active\nInference',
        safeId: 'active-inference',
        description: 'Framework for understanding adaptive behavior',
        radius: 40,
        expandedRadius: 60,
        normalRadius: 40,
        shrunkRadius: 30,
        color: 'var(--ifm-color-emphasis-700)',
        layer: 2
      },
      {
        id: 'Value\nLearning',
        safeId: 'value-learning',
        description: 'Understanding and encoding human values in AI systems',
        radius: 40,
        expandedRadius: 60,
        normalRadius: 40,
        shrunkRadius: 30,
        color: 'var(--ifm-color-emphasis-700)',
        layer: 2
      }
    ].map((node, index) => ({
      ...node,
      x: centerX + layer2Radius * Math.cos((index * 2 * Math.PI) / layer2Count - Math.PI / 2),
      y: centerY + layer2Radius * Math.sin((index * 2 * Math.PI) / layer2Count - Math.PI / 2)
    }));

    // Layer 3 - Extended relations
    const layer3Count = 5;
    const layer3Radius = 260;
    const layer3Nodes = [
      {
        id: 'Crowdsourcing\nMethods',
        safeId: 'crowdsourcing-methods',
        description: 'Techniques for distributed problem-solving',
        radius: 35,
        expandedRadius: 55,
        normalRadius: 35,
        shrunkRadius: 25,
        color: 'var(--ifm-color-emphasis-500)',
        layer: 3
      },
      {
        id: 'Network\nTopologies',
        safeId: 'network-topologies',
        description: 'Structural patterns in information networks',
        radius: 35,
        expandedRadius: 55,
        normalRadius: 35,
        shrunkRadius: 25,
        color: 'var(--ifm-color-emphasis-500)',
        layer: 3
      },
      {
        id: 'Voting\nSystems',
        safeId: 'voting-systems',
        description: 'Mechanisms for fair collective choice',
        radius: 35,
        expandedRadius: 55,
        normalRadius: 35,
        shrunkRadius: 25,
        color: 'var(--ifm-color-emphasis-500)',
        layer: 3
      },
      {
        id: 'Reward\nModeling',
        safeId: 'reward-modeling',
        description: 'Learning preferences from human feedback',
        radius: 35,
        expandedRadius: 55,
        normalRadius: 35,
        shrunkRadius: 25,
        color: 'var(--ifm-color-emphasis-500)',
        layer: 3
      },
      {
        id: 'Interpretability',
        safeId: 'interpretability',
        description: 'Making AI systems understandable to humans',
        radius: 35,
        expandedRadius: 55,
        normalRadius: 35,
        shrunkRadius: 25,
        color: 'var(--ifm-color-emphasis-500)',
        layer: 3
      }
    ].map((node, index) => ({
      ...node,
      x: centerX + layer3Radius * Math.cos((index * 2 * Math.PI) / layer3Count - Math.PI / 2),
      y: centerY + layer3Radius * Math.sin((index * 2 * Math.PI) / layer3Count - Math.PI / 2)
    }));

    const allNodes = [...layer1Nodes, ...layer2Nodes, ...layer3Nodes];

    // Define connections between nodes
    const links = [
      // Layer 1 to Layer 2 connections
      { source: 'collective-intelligence', target: 'prediction-markets' },
      { source: 'collective-intelligence', target: 'social-learning' },
      { source: 'collective-intelligence', target: 'preference-aggregation' },
      { source: 'network-dynamics', target: 'information-cascades' },
      { source: 'network-dynamics', target: 'social-learning' },
      { source: 'human-ai-alignment', target: 'active-inference' },
      { source: 'human-ai-alignment', target: 'value-learning' },

      // Layer 2 to Layer 3 connections
      { source: 'prediction-markets', target: 'crowdsourcing-methods' },
      { source: 'information-cascades', target: 'network-topologies' },
      { source: 'preference-aggregation', target: 'voting-systems' },
      { source: 'active-inference', target: 'reward-modeling' },
      { source: 'value-learning', target: 'interpretability' }
    ];

    const svg = svgRef.current;
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Add connections
    links.forEach(link => {
      const sourceNode = allNodes.find(n => n.safeId === link.source);
      const targetNode = allNodes.find(n => n.safeId === link.target);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', sourceNode.x);
      line.setAttribute('y1', sourceNode.y);
      line.setAttribute('x2', targetNode.x);
      line.setAttribute('y2', targetNode.y);
      line.setAttribute('class', styles.connection);
      line.setAttribute('data-source', sourceNode.safeId);
      line.setAttribute('data-target', targetNode.safeId);
      
      svg.appendChild(line);
    });

    // Add nodes
    allNodes.forEach(node => {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('class', styles.nodeGroup);
      group.setAttribute('data-node-id', node.safeId);
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x);
      circle.setAttribute('cy', node.y);
      circle.setAttribute('r', node.radius);
      circle.setAttribute('fill', node.color);
      circle.setAttribute('class', styles.node);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', node.x);
      text.setAttribute('y', node.y);
      text.setAttribute('class', styles.nodeLabel);

      // Calculate text layout
      const maxCharsPerLine = Math.floor(node.radius / 4);
      const lines = node.id.split('\n').map(line => 
        splitTextIntoLines(line, maxCharsPerLine)
      ).flat();

      const fontSize = calculateTextSize(node.id, node.radius);
      text.style.fontSize = `${fontSize}px`;

      // Position lines within circle
      const lineHeight = fontSize * 1.2;
      const totalHeight = lines.length * lineHeight;
      const startY = node.y - (totalHeight / 2) + (lineHeight / 2);

      lines.forEach((line, index) => {
        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.textContent = line;
        tspan.setAttribute('x', node.x);
        tspan.setAttribute('y', startY + (index * lineHeight));
        tspan.setAttribute('text-anchor', 'middle');
        text.appendChild(tspan);
      });

      const descriptionText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      descriptionText.setAttribute('x', node.x);
      descriptionText.setAttribute('y', node.y);
      descriptionText.setAttribute('class', styles.nodeDescription);
      descriptionText.style.opacity = '0';

      // Handle description text
      const descLines = splitTextIntoLines(node.description, maxCharsPerLine + 2);
      const descFontSize = fontSize * 0.8;
      descriptionText.style.fontSize = `${descFontSize}px`;

      const descLineHeight = descFontSize * 1.2;
      const descStartY = node.y + (totalHeight / 2);

      descLines.forEach((line, index) => {
        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.textContent = line;
        tspan.setAttribute('x', node.x);
        tspan.setAttribute('y', descStartY + (index * descLineHeight));
        tspan.setAttribute('text-anchor', 'middle');
        descriptionText.appendChild(tspan);
      });

      // Handle hover interactions
      const handleMouseEnter = () => {
        circle.setAttribute('r', node.expandedRadius);
        group.classList.add(styles.nodeGroupHovered);
        
        // Recalculate text sizes for expanded state
        const expandedFontSize = calculateTextSize(node.id, node.expandedRadius);
        text.style.fontSize = `${expandedFontSize}px`;
        descriptionText.style.fontSize = `${expandedFontSize * 0.8}px`;
        
        // Update text positions
        const expandedLineHeight = expandedFontSize * 1.2;
        const expandedTotalHeight = lines.length * expandedLineHeight;
        const expandedStartY = node.y - (expandedTotalHeight / 2) + (expandedLineHeight / 2);
        
        text.querySelectorAll('tspan').forEach((tspan, index) => {
          tspan.setAttribute('y', expandedStartY + (index * expandedLineHeight));
        });

        descriptionText.style.opacity = '1';

        // Update other nodes
        allNodes.forEach(otherNode => {
          if (otherNode.safeId !== node.safeId) {
            const otherGroup = svg.querySelector(`[data-node-id="${otherNode.safeId}"]`);
            if (otherGroup) {
              const otherCircle = otherGroup.querySelector('circle');
              otherCircle.setAttribute('r', otherNode.shrunkRadius);
              otherGroup.classList.add(styles.nodeGroupDimmed);
            }
          }
        });

        // Highlight relevant connections
        svg.querySelectorAll('line').forEach(line => {
          const source = line.getAttribute('data-source');
          const target = line.getAttribute('data-target');
          if (source === node.safeId || target === node.safeId) {
            line.classList.add(styles.connectionHighlighted);
          } else {
            line.classList.add(styles.connectionDimmed);
          }
        });
      };

      const handleMouseLeave = () => {
        circle.setAttribute('r', node.radius);
        group.classList.remove(styles.nodeGroupHovered);
        
        // Reset font sizes
        const normalFontSize = calculateTextSize(node.id, node.radius);
        text.style.fontSize = `${normalFontSize}px`;
        
        // Reset text positions
        const normalLineHeight = normalFontSize * 1.2;
        const normalTotalHeight = lines.length * normalLineHeight;
        const normalStartY = node.y - (normalTotalHeight / 2) + (normalLineHeight / 2);
        
        text.querySelectorAll('tspan').forEach((tspan, index) => {
          tspan.setAttribute('y', normalStartY + (index * normalLineHeight));
        });
        
        descriptionText.style.opacity = '0';

        // Reset other nodes
        allNodes.forEach(otherNode => {
          const otherGroup = svg.querySelector(`[data-node-id="${otherNode.safeId}"]`);
          if (otherGroup) {
            const otherCircle = otherGroup.querySelector('circle');
            otherCircle.setAttribute('r', otherNode.normalRadius);
            otherGroup.classList.remove(styles.nodeGroupDimmed);
          }
        });

        // Reset connections
        svg.querySelectorAll('line').forEach(line => {
          line.classList.remove(styles.connectionHighlighted, styles.connectionDimmed);
        });
      };

      group.addEventListener('mouseenter', handleMouseEnter);
      group.addEventListener('mouseleave', handleMouseLeave);
      
      group.appendChild(circle);
      group.appendChild(text);
      group.appendChild(descriptionText);
      svg.appendChild(group);
    });

  }, []);

  return (
    <div className={styles.networkGraphContainer}>
      <svg
        ref={svgRef}
        viewBox="0 0 600 400"
        className={styles.networkGraph}
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
}
