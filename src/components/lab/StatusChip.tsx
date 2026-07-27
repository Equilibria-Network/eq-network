// src/components/lab/StatusChip.tsx
import React from 'react';
import styles from './StatusChip.module.css';
import type { ScenarioStatus } from '@content/lab';

const STATUS_LABELS: Record<ScenarioStatus, string> = {
  live: 'Playable',
  'in-design': 'In design',
};

interface StatusChipProps {
  status: ScenarioStatus;
}

export default function StatusChip({ status }: StatusChipProps) {
  const statusClass = status === 'live' ? styles.live : styles.inDesign;
  return <span className={`${styles.chip} ${statusClass}`}>{STATUS_LABELS[status]}</span>;
}
