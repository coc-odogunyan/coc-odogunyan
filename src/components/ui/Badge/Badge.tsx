import type { ReactElement, ReactNode } from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  variant: 'success' | 'danger' | 'gold' | 'info' | 'warn' | 'muted';
  children: ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ variant, children, size = 'md', className }: BadgeProps): ReactElement {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]} ${className ?? ''}`}>
      {children}
    </span>
  );
}
