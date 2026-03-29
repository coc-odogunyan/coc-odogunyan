import type { ReactElement } from 'react';
import type { MemberRole } from '@/types';
import styles from './Avatar.module.css';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  imageUrl?: string;
  role?: MemberRole;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

export function Avatar({ name, size = 'md', imageUrl, role = 'member', className }: AvatarProps): ReactElement {
  return (
    <div
      className={`${styles.avatar} ${styles[size]} ${styles[role]} ${className ?? ''}`}
      title={name}
      aria-label={name}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} className={styles.img} />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}
