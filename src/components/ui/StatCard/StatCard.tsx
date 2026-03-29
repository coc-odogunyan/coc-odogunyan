import type { ReactElement } from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: 'gold' | 'success' | 'danger' | 'info';
  trend?: { value: number; direction: 'up' | 'down' };
  className?: string;
}

export function StatCard({ label, value, sub, accent = 'gold', trend, className }: StatCardProps): ReactElement {
  return (
    <div className={`${styles.card} ${styles[accent]} ${className ?? ''}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {sub && <span className={styles.sub}>{sub}</span>}
      {trend && (
        <span className={`${styles.trend} ${trend.direction === 'up' ? styles.trendUp : styles.trendDown}`}>
          {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
        </span>
      )}
    </div>
  );
}
