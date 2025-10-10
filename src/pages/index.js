// src/pages/index.js
import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { 
  Hero, 
  Publications,
  Audience,
} from '../components/Home';

export default function Home2() {
  const {siteConfig} = useDocusaurusContext();
  
  // Add body class for page-specific styles
  useEffect(() => {
    document.documentElement.classList.add('home2-page');
    return () => {
      document.documentElement.classList.remove('home2-page');
    };
  }, []);
  
  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}>
      {/* Monochrome texture background */}
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
      {/* Theme-aware color overlay - stronger opacity */}
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
        /* Override any solid backgrounds in dark mode */
        :global([data-theme='dark']) :global(.main-wrapper),
        :global([data-theme='dark']) :global(main),
        :global([data-theme='dark']) :global(article),
        :global([data-theme='dark']) :global(section) {
          background: transparent !important;
        }
        
        /* Override light mode backgrounds too */
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
        
        /* Remove footer margin/padding for this page */
        :global(.footer) {
          margin-top: 0 !important;
        }
      `}</style>
      
      {/* Add IDs for scroll progress and navigation */}
      <div id="hero">
        <Hero />
      </div>
      <main style={{ marginBottom: 0, paddingBottom: 0, background: 'transparent' }}>
        <div id="publications">
          <Publications />
        </div>
        <div id="audience">
          <Audience />
        </div>
      </main>
    </Layout>
  );
}
