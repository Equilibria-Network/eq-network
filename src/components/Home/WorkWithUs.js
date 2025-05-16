// src/components/Home/WorkWithUs.js
import React, { useState, useEffect, useRef } from 'react';
import styles from './WorkWithUs.module.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

// Import data
import profilesData from '@site/src/data/workwithus.json';

export default function WorkWithUs() {
  const [profiles, setProfiles] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [graphDimensions, setGraphDimensions] = useState({ width: 0, height: 0 });
  const graphRef = useRef(null);

  // Load profile data
  useEffect(() => {
    setProfiles(profilesData);
  }, []);
  
  // Calculate graph dimensions on mount and resize
  useEffect(() => {
    const calculateGraphDimensions = () => {
      if (graphRef.current) {
        const { width, height } = graphRef.current.getBoundingClientRect();
        setGraphDimensions({ width, height });
      }
    };
    
    calculateGraphDimensions();
    window.addEventListener('resize', calculateGraphDimensions);
    
    return () => {
      window.removeEventListener('resize', calculateGraphDimensions);
    };
  }, []);

  // Generate tooltip content
  const renderTooltipContent = (profile) => {
    return (
      <div className={styles.tooltipContent}>
        <h3 className={styles.tooltipTitle}>{profile.title}</h3>
        <p className={styles.tooltipDescription}>{profile.fullDescription}</p>
      </div>
    );
  };
  
  // Calculate dynamic positions for the nodes based on graph size
  const getNodePosition = (nodeId) => {
    const { width, height } = graphDimensions;
    const positions = {
      // Positions as percentages of container size
      researcher: { top: '15%', left: '70%' },
      practitioner: { top: '30%', right: '15%' },
      interdisciplinary: { bottom: '30%', left: '20%' },
      experimentalist: { bottom: '15%', left: '60%' }
    };
    
    return positions[nodeId] || {};
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Work With Us</h2>
          <p className={styles.subtitle}>
            We are building a community of collaborators who share our fascination with 
            collective intelligence and its role in shaping safer AI systems.
          </p>
        </div>
        
        <div className={styles.profilesWrapper} ref={graphRef}>
          {/* Interactive Diagram Grid */}
          <div className={styles.diagramGrid}>
            {profiles.map((profile) => (
              <Tippy
                key={profile.id}
                content={renderTooltipContent(profile)}
                interactive={true}
                arrow={true}
                placement="auto"
                duration={300}
                theme="light"
                className={styles.customTooltip}
                onShow={() => setHoveredNode(profile.id)}
                onHide={() => setHoveredNode(null)}
                appendTo={() => document.body}
              >
                <div 
                  className={`${styles.profileNode} ${hoveredNode === profile.id ? styles.hoveredNode : ''}`}
                  style={getNodePosition(profile.id)}
                >
                  <div className={styles.nodeContent}>
                    <h3 className={styles.nodeTitle}>{profile.title}</h3>
                  </div>
                </div>
              </Tippy>
            ))}
            
            {/* Arrow connections */}
            <div className={styles.arrowContainer}>
              {/* Experimentalist -> Researcher Arrow (using your SVG) */}
              <svg 
                className={styles.bridgeArrow} 
                viewBox="0 0 312.08404657347705 143.11407347749537" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <g mask="url(#mask-NvVv6B4bxaj8l1x7KXtey)" strokeLinecap="round">
                  <g transform="translate(10.50184147027312 131.96368503569238) rotate(0 145.09951359353323 -61.09453203938233)">
                    <path 
                      d="M0.63 -0.96 C26 -11.4, 104.66 -42.16, 152.76 -62.32 C200.86 -82.49, 266.29 -111.93, 289.21 -121.96 M-0.5 1.15 C24.77 -9.11, 103.76 -40.54, 152.44 -60.82 C201.12 -81.1, 268.56 -110.4, 291.58 -120.53" 
                      stroke="#1e1e1e" 
                      strokeWidth="2" 
                      fill="none"
                    />
                  </g>
                  <g transform="translate(10.50184147027312 131.96368503569238) rotate(0 145.09951359353323 -61.09453203938233)">
                    <path 
                      d="M273.47 -103.3 C278.04 -107.3, 285.75 -116.86, 291.58 -120.53 M273.47 -103.3 C279.41 -108.96, 284.36 -114.22, 291.58 -120.53" 
                      stroke="#1e1e1e" 
                      strokeWidth="2" 
                      fill="none"
                    />
                  </g>
                  <g transform="translate(10.50184147027312 131.96368503569238) rotate(0 145.09951359353323 -61.09453203938233)">
                    <path 
                      d="M266.63 -118.97 C273.58 -117.64, 283.64 -121.82, 291.58 -120.53 M266.63 -118.97 C274.76 -119.62, 281.89 -119.88, 291.58 -120.53" 
                      stroke="#1e1e1e" 
                      strokeWidth="2" 
                      fill="none"
                    />
                  </g>
                </g>
                <text 
                  x="156" 
                  y="70" 
                  fontFamily="sans-serif" 
                  fontSize="20px" 
                  fill="#1e1e1e" 
                  textAnchor="middle"
                >
                  bridge
                </text>
              </svg>
            </div>
          </div>
          
          {/* Join Network CTA */}
          <div className={styles.centerCta}>
            <a href="mailto:contact@eq-network.org" className={styles.ctaLink}>
              Join Our Network
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
