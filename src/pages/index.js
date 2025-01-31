// src/pages/index.js
import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { 
  Hero, 
  Mission, 
  WhoWeAre, 
  WhatWeDo, 
  Focus,
  RecentArticles,
  StayCoordinated,
  ContactForm 
} from '../components/HomepageComponents';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <Layout>
      <Hero/>
      <main>
        <Mission />
        <WhoWeAre />
        <WhatWeDo />
        <RecentArticles />
        <StayCoordinated />
        <ContactForm />
      </main>
    </Layout>
  );
}
