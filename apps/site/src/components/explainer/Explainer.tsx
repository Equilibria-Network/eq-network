import React, { useRef, useState, useEffect, useCallback } from 'react';
import styles from './Explainer.module.css';
import StepNarrative from './StepNarrative';
import ExplainerClosing from './ExplainerClosing';
import VisualRenderer from './visuals/VisualRenderer';
import { explainerContent } from '@content/explainer';

export default function Explainer() {
  const [activeStep, setActiveStep] = useState(1);
  const [visualSize, setVisualSize] = useState({ width: 400, height: 400 });
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const visualContainerRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver: trigger when step enters middle 20% of viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const step = Number(entry.target.getAttribute('data-step'));
            if (step) setActiveStep(step);
          }
        }
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );

    const refs = stepRefs.current;
    refs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      refs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // ResizeObserver on visual container
  useEffect(() => {
    const container = visualContainerRef.current;
    if (!container) return;

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setVisualSize({ width, height });
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const setStepRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      stepRefs.current[index] = el;
    },
    []
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollContainer}>
        {/* Sticky visual panel */}
        <div className={styles.visualPanel}>
          <div className={styles.visualContainer} ref={visualContainerRef}>
            <VisualRenderer
              activeStep={activeStep}
              width={visualSize.width}
              height={visualSize.height}
            />
          </div>
        </div>

        {/* Scrolling narrative */}
        <div className={styles.narrativeColumn}>
          {explainerContent.steps.map((step, i) => {
            // Show section label on the first step of each section
            const isFirstInSection =
              i === 0 || explainerContent.steps[i - 1].section !== step.section;
            return (
              <StepNarrative
                key={step.id}
                ref={setStepRef(i)}
                step={step}
                isActive={activeStep === step.id}
                showSectionLabel={isFirstInSection}
              />
            );
          })}
        </div>
      </div>

      {/* Closing CTA */}
      <div className={styles.closingSection}>
        <ExplainerClosing closing={explainerContent.closing} />
      </div>
    </div>
  );
}
