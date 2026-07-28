import React from 'react';
import StepSocietyNetwork from './StepSocietyNetwork';
import StepDefection from './StepDefection';
import StepBadEquilibria from './StepBadEquilibria';
import StepProblemSummary from './StepProblemSummary';
import StepFieldsIntro from './StepFieldsIntro';
import NetworkVisualization from './NetworkVisualization';

interface VisualRendererProps {
  activeStep: number;
  width: number;
  height: number;
}

export default function VisualRenderer({ activeStep, width, height }: VisualRendererProps) {
  const shouldRender = (step: number) =>
    Math.abs(step - activeStep) <= 1;

  return (
    <>
      {shouldRender(1) && (
        <div style={{ position: 'absolute', inset: 0, opacity: activeStep === 1 ? 1 : 0, transition: 'opacity 0.5s ease' }}>
          <StepSocietyNetwork width={width} height={height} />
        </div>
      )}
      {shouldRender(2) && (
        <div style={{ position: 'absolute', inset: 0, opacity: activeStep === 2 ? 1 : 0, transition: 'opacity 0.5s ease' }}>
          <StepDefection width={width} height={height} />
        </div>
      )}
      {shouldRender(3) && (
        <div style={{ position: 'absolute', inset: 0, opacity: activeStep === 3 ? 1 : 0, transition: 'opacity 0.5s ease' }}>
          <StepBadEquilibria width={width} height={height} />
        </div>
      )}
      {shouldRender(4) && (
        <div style={{ position: 'absolute', inset: 0, opacity: activeStep === 4 ? 1 : 0, transition: 'opacity 0.5s ease' }}>
          <StepProblemSummary width={width} height={height} />
        </div>
      )}
      {shouldRender(5) && (
        <div style={{ position: 'absolute', inset: 0, opacity: activeStep === 5 ? 1 : 0, transition: 'opacity 0.5s ease' }}>
          <StepFieldsIntro width={width} height={height} />
        </div>
      )}
      {(shouldRender(6) || shouldRender(7)) && (
        <div style={{ position: 'absolute', inset: 0, opacity: activeStep >= 6 ? 1 : 0, transition: 'opacity 0.5s ease' }}>
          <NetworkVisualization activeStep={activeStep} width={width} height={height} />
        </div>
      )}
    </>
  );
}
