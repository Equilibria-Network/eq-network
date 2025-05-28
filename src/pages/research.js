// src/pages/research.js
import React from 'react';
import Layout from '@theme/Layout';
import ResearchHeader from '@site/src/components/Research/ResearchHeader';
import ResearchList from '@site/src/components/Research/ResearchList';
import { researchData } from '@site/src/data/research';

export default function Research() {
  return (
    <Layout 
      title="Research" 
      description="Current research papers and publications at Equilibria Network"
    >
      <div className="parallax-background" />
      <main className="container mx-auto px-4 py-8">
        <ResearchHeader />
        <ResearchList 
          papers={researchData.papers} 
          researchAreas={researchData.researchAreas}
        />
      </main>
    </Layout>
  );
}
