// src/components/lab/LabClosing.tsx
import styles from './LabClosing.module.css';
import type { LabContent } from '@content/lab';

interface LabClosingProps {
  closing: LabContent['closing'];
}

export default function LabClosing({ closing }: LabClosingProps) {
  return (
    <div className={styles.closing}>
      <h2 className={styles.headline}>{closing.headline}</h2>
      <p className={styles.body}>{closing.body}</p>
      <div className={styles.links}>
        {closing.links.map((link) => {
          const isExternal = link.href.startsWith('http');
          return (
            <a
              key={link.href}
              href={link.href}
              className={styles.linkCard}
              {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <div className={styles.linkLabel}>{link.label}</div>
              <div className={styles.linkDescription}>{link.description}</div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
