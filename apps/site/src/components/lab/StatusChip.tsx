// src/components/lab/StatusChip.tsx
import styles from './StatusChip.module.css';
import { labContent, type ScenarioStatus } from '@content/lab';

const STATUS_LABELS = labContent.ui.statusLabels;

interface StatusChipProps {
  status: ScenarioStatus;
}

export default function StatusChip({ status }: StatusChipProps) {
  const statusClass = status === 'live' ? styles.live : styles.inDesign;
  return <span className={`${styles.chip} ${statusClass}`}>{STATUS_LABELS[status]}</span>;
}
