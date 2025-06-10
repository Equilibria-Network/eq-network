// src/components/Home2/Research.js
import React from 'react';
import SimulationsSection from './SimulationsSection';
import FoundationsSection from './FoundationsSection';

export default function Research() {
  return (
    <>
      {/* Individual themed sections - no wrapper needed */}
      <SimulationsSection />
      <FoundationsSection />
    </>
  );
}
