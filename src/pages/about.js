// src/pages/about.js
import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { AboutHero, AboutPhilosophy, AboutTeam } from '../components/About';

export default function About() {
  const {siteConfig} = useDocusaurusContext();
  
  useEffect(() => {
    document.documentElement.classList.add('about-page');
    return () => {
      document.documentElement.classList.remove('about-page');
    };
  }, []);
  
  return (
    <Layout
      title="About Equilibria Network"
      description="Learn about the Equilibria Network team and how we work."
    >
      {/* Monochrome texture background - same as home */}
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
      {/* Theme-aware color overlay */}
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
        <AboutHero />
        <AboutPhilosophy />
        <AboutTeam />
      </main>
    </Layout>
  );
}
