import { useCallback, useEffect, useRef, useState } from 'react';
import type { VisualEssayProps } from './types';
import styles from './VisualEssay.module.css';

export default function VisualEssay<State extends string>({
  document,
  Visual,
  showHeader = true,
  anchorPrefix = 'step',
}: VisualEssayProps<State>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const figureRef = useRef<HTMLDivElement | null>(null);
  const activeStep = document.steps[activeIndex];

  useEffect(() => {
    setIsHydrated(true);
    const match = window.location.hash.match(new RegExp(`^#${anchorPrefix}-(\\d+)$`));
    if (match) {
      const requested = Number(match[1]) - 1;
      setActiveIndex(Math.max(0, Math.min(document.steps.length - 1, requested)));
    }

    let frame = 0;
    const updateFromScroll = () => {
      frame = 0;
      const figureBottom = figureRef.current?.getBoundingClientRect().bottom ?? 0;
      const activationLine =
        window.innerWidth <= 992
          ? Math.min(window.innerHeight * 0.72, figureBottom + 32)
          : window.innerHeight * 0.38;
      let nextIndex = 0;
      stepRefs.current.forEach((node, index) => {
        if (node && node.getBoundingClientRect().top <= activationLine) nextIndex = index;
      });
      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateFromScroll);
    };

    updateFromScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [anchorPrefix, document.steps.length]);

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
        <div className={styles.figureColumn} ref={figureRef}>
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
        </div>

        <div className={styles.narrative}>
          {document.steps.map((step, index) => {
            const firstInSection =
              index === 0 || document.steps[index - 1].section !== step.section;
            return (
              <article
                key={step.id}
                id={`${anchorPrefix}-${index + 1}`}
                ref={setStepRef(index)}
                data-step-index={index}
                aria-current={activeIndex === index ? 'step' : undefined}
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

      {document.closing && (
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
      )}
    </div>
  );
}
