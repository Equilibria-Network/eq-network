import { useCallback, useEffect, useRef, useState } from 'react';
import type { VisualEssayProps } from './types';
import styles from './VisualEssay.module.css';

export default function VisualEssay<State extends string>({
  document,
  Visual,
  showHeader = true,
}: VisualEssayProps<State>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const activeStep = document.steps[activeIndex];

  useEffect(() => {
    setIsHydrated(true);
    const match = window.location.hash.match(/^#step-(\d+)$/);
    if (match) {
      const requested = Number(match[1]) - 1;
      setActiveIndex(Math.max(0, Math.min(document.steps.length - 1, requested)));
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number(visible.target.getAttribute('data-step-index'));
        if (Number.isFinite(index)) setActiveIndex(index);
      },
      { rootMargin: '-28% 0px -52% 0px', threshold: [0, 0.2, 0.55] }
    );

    const refs = stepRefs.current;
    refs.forEach((node) => node && observer.observe(node));
    return () => refs.forEach((node) => node && observer.unobserve(node));
  }, [document.steps.length]);

  const setStepRef = useCallback(
    (index: number) => (node: HTMLElement | null) => {
      stepRefs.current[index] = node;
    },
    []
  );

  return (
    <div className={`${styles.page} ${isHydrated ? styles.hydrated : ''}`}>
      <div className={styles.sideHatch} aria-hidden="true" />

      {showHeader && (
        <header className={styles.hero}>
          <div className={styles.heroRule}>
            <span>{document.eyebrow}</span>
            <span>{document.reference}</span>
          </div>
          <div className={styles.heroGrid}>
            <h1>{document.title}</h1>
            <div className={styles.heroAside}>
              <p>{document.dek}</p>
              <span>{document.scrollPrompt} ↓</span>
            </div>
          </div>
        </header>
      )}

      <div className={styles.story}>
        <div className={styles.figureColumn}>
          <div className={styles.figureFrame}>
            <span className={`${styles.registration} ${styles.regTl}`} aria-hidden="true" />
            <span className={`${styles.registration} ${styles.regTr}`} aria-hidden="true" />
            <span className={`${styles.registration} ${styles.regBl}`} aria-hidden="true" />
            <span className={`${styles.registration} ${styles.regBr}`} aria-hidden="true" />
            <div className={styles.figureHeader}>
              <span>{document.figureLabel}</span>
              <span>
                {document.statusLabel} {String(activeIndex + 1).padStart(2, '0')} /{' '}
                {String(document.steps.length).padStart(2, '0')}
              </span>
            </div>
            <Visual activeState={activeStep.state} activeStep={activeStep.id} step={activeStep} />
          </div>

          <nav
            className={styles.timeline}
            aria-label="Visual essay states"
            style={{ gridTemplateColumns: `repeat(${document.steps.length}, minmax(0, 1fr))` }}
          >
            {document.steps.map((step, index) => (
              <button
                key={step.id}
                className={activeIndex === index ? styles.timelineActive : ''}
                type="button"
                aria-label={`Show ${step.stageLabel}`}
                aria-current={activeIndex === index ? 'step' : undefined}
                onClick={() => {
                  window.history.replaceState(null, '', `#step-${index + 1}`);
                  stepRefs.current[index]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className={styles.narrative}>
          {document.steps.map((step, index) => {
            const firstInSection =
              index === 0 || document.steps[index - 1].section !== step.section;
            return (
              <article
                key={step.id}
                id={`step-${index + 1}`}
                ref={setStepRef(index)}
                data-step-index={index}
                className={`${styles.step} ${activeIndex === index ? styles.stepActive : ''}`}
              >
                <div className={styles.stickyHeading}>
                  {firstInSection && (
                    <div className={styles.sectionRule}>
                      <span>{step.sectionLabel}</span>
                    </div>
                  )}
                  <div className={styles.stepMeta}>
                    <span>
                      {String(index + 1).padStart(2, '0')} /{' '}
                      {String(document.steps.length).padStart(2, '0')}
                    </span>
                    <span>{step.stageLabel}</span>
                  </div>
                  <h2>{step.headline}</h2>
                </div>
                <p>{step.body}</p>
              </article>
            );
          })}
        </div>
      </div>

      <section className={styles.closing}>
        <div className={styles.sectionRule}>
          <span>{document.closingLabel}</span>
        </div>
        <div className={styles.closingGrid}>
          <div>
            <span className={styles.closingIndex}>
              {String(document.steps.length).padStart(2, '0')} → ∞
            </span>
            <h2>{document.closing.headline}</h2>
            <p>{document.closing.body}</p>
          </div>
          <div className={styles.linkGrid}>
            {document.closing.links.map((link, index) => (
              <a href={link.href} key={link.href}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{link.label}</strong>
                <small>{link.description}</small>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
