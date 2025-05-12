// src/pages/blog.js
import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { BlogHeader } from '../components/Blog';
import styles from './blog.module.css';

export default function Blog() {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <Layout
      title="Blog"
      description="Equilibria Network Blog - Insights on collective intelligence, AI governance, and complex systems"
    >
      <div className="parallax-background" />
      <BlogHeader />
      
      {/* This is a simple placeholder - the actual blog content will be 
          handled by Docusaurus's built-in system */}
      <main className={styles.blogMain}>
        <div className={styles.container}>
          <div className={styles.infoMessage}>
            <p>The blog listing is managed by Docusaurus.</p>
            <p>Click on the Blog link in the navbar to view the default blog listing.</p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
