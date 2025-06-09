// src/pages/home2.js
import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { 
  Hero, 
  Research, 
  Audience, 
  AboutUs,
  WorkWithUs,
} from '../components/Home2';

export default function Home2() {
  const {siteConfig} = useDocusaurusContext();
  
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
      <Hero />
      <main style={{ marginBottom: 0, paddingBottom: 0, background: 'transparent' }}>
        <Research />
        <Audience />
        <AboutUs />
        <WorkWithUs />
      </main>
    </Layout>
  );
}
