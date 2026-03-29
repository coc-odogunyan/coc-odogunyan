import type { ReactElement, ReactNode, HTMLAttributes } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
  padding?: 'none' | 'md' | 'lg';
}

export function Card({ children, hoverable = false, padding = 'md', className, ...rest }: CardProps): ReactElement {
  const paddingClass = padding === 'md' ? styles.padded : padding === 'lg' ? styles['padded-lg'] : '';
  return (
    <div
      className={`${styles.card} ${hoverable ? styles.hoverable : ''} ${paddingClass} ${className ?? ''}`}
      {...rest}
    >
      {children}
    </div>
  );
}
