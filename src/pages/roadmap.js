// src/pages/roadmap.js
import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { RoadmapCards, RoadmapDetails } from '../components/Roadmap';

export default function Roadmap() {
  const [selectedPhase, setSelectedPhase] = useState(1); // Phase 1 selected by default
  
  useEffect(() => {
    document.documentElement.classList.add('roadmap-page');
    return () => {
      document.documentElement.classList.remove('roadmap-page');
    };
  }, []);
  
  return (
    <Layout
      title="Research Roadmap"
      description="Equilibria Network's research roadmap from foundations to self-sustaining infrastructure"
    >
      {/* Same background pattern as other pages */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          backgroundImage: 'url("/img/texture/texture-1.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'grayscale(100%)',
          pointerEvents: 'none'
        }}
      />
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none'
        }}
        className="theme-overlay"
      />
      <style jsx>{`
        :global([data-theme='dark']) :global(.main-wrapper),
        :global([data-theme='dark']) :global(main),
        :global([data-theme='dark']) :global(article),
        :global([data-theme='dark']) :global(section) {
          background: transparent !important;
        }
        
        :global(.main-wrapper),
        :global(main),
        :global(article),
        :global(section) {
          background: transparent !important;
        }
        
        .theme-overlay {
          background-color: rgba(255, 255, 255, 0.92);
        }
        
        [data-theme='dark'] .theme-overlay {
          background-color: rgba(0, 0, 0, 0.88);
        }
        
        :global(.footer) {
          margin-top: 0 !important;
        }
      `}</style>
      
      <main style={{ marginBottom: 0, paddingBottom: 0, background: 'transparent' }}>
        <RoadmapCards 
          selectedPhase={selectedPhase}
          onPhaseSelect={setSelectedPhase}
        />
        <RoadmapDetails selectedPhase={selectedPhase} />
      </main>
    </Layout>
  );
}
