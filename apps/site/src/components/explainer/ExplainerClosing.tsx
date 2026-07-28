import styles from './ExplainerClosing.module.css';
import type { ExplainerContent } from '@content/explainer';

interface ExplainerClosingProps {
  closing: ExplainerContent['closing'];
}

export default function ExplainerClosing({ closing }: ExplainerClosingProps) {
  return (
    <div className={styles.closing}>
      <h2 className={styles.headline}>{closing.headline}</h2>
      <p className={styles.body}>{closing.body}</p>
      <div className={styles.links}>
        {closing.links.map((link) => (
          <a key={link.href} href={link.href} className={styles.linkCard}>
            <div className={styles.linkLabel}>{link.label}</div>
            <div className={styles.linkDescription}>{link.description}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
