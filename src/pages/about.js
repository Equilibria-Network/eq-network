// src/pages/about.js
import React from 'react';
import Layout from '@theme/Layout';
import styles from './about.module.css';

export default function About() {
  return (
    <Layout title="About">
      <main className={styles.main}>
        <div className={styles.container}>
          <h1>About Equilibria</h1>
          <div className={styles.content}>
            <p>
              Humanity stands at a critical juncture. As artificial intelligence rapidly advances, our ability to make wise collective decisions becomes increasingly vital – yet our existing institutions and coordination systems struggle to keep pace with mounting complexity.
            </p>
            <p>
              We believe there's a timely opportunity to weave these threads together. Equilibria was founded to create space for this exploration through an experimental incubator that nurtures projects at the frontier of human-AI coordination.
            </p>
            {/* You can add more content here */}
          </div>
        </div>
      </main>
    </Layout>
  );
}
