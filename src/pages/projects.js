// src/pages/projects.js
import React from 'react';
import Layout from '@theme/Layout';
import ProjectHeader from '@site/src/components/Projects/ProjectHeader';
import ProjectList from '@site/src/components/Projects/ProjectList';
import { projects } from '@site/src/data/projects';

export default function Projects() {
  return (
    <Layout 
      title="Projects" 
      description="Current projects at Equilibria Network"
    >
      <div className="parallax-background" />
      <main className="container mx-auto px-4 py-8">
        <ProjectHeader />
        <ProjectList projects={projects} />
      </main>
    </Layout>
  );
}
