import type { ReactElement } from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'gold' | 'success' | 'danger' | 'info';
  height?: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ value, max = 100, color = 'gold', height = 4, showLabel = false, className }: ProgressBarProps): ReactElement {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={className}>
      <div className={styles.track} style={{ height }}>
        <div
          className={`${styles.fill} ${styles[color]}`}
          style={{ width: `${percent}%`, height }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <div className={styles.label}>{Math.round(percent)}%</div>
      )}
    </div>
  );
}
