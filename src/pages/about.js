// src/pages/about.js
import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { AboutTeam } from '../components/About';

export default function About() {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <Layout
      title="About Equilibria Network"
      description="Learn about the Equilibria Network team."
    >
      <div className="parallax-background" />
      <main>
        <AboutTeam />
        {/* The following components are commented out for now
        <AboutHero />
        <AboutMission />
        <AboutValues />
        <AboutHistory />
        <AboutPartners />
        */}
      </main>
    </Layout>
  );
}
