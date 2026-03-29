import { NavLink } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import type { ReactElement } from 'react';
import type { MemberRole } from '@/types';
import styles from './MobileNav.module.css';

interface MobileNavItem {
  label: string;
  path: string;
  roles: MemberRole[];
  icon: ReactElement;
}

const NAV_ITEMS: MobileNavItem[] = [
  {
    label: 'Dashboard', path: '/dashboard', roles: ['admin', 'secretary', 'member'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: 'Attendance', path: '/attendance', roles: ['admin', 'secretary'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  {
    label: 'Roster', path: '/roster', roles: ['admin', 'secretary'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    label: 'Events', path: '/events', roles: ['admin', 'secretary', 'member'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
  {
    label: 'Members', path: '/members', roles: ['admin', 'secretary'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

export function MobileNav(): ReactElement {
  const { hasRole } = useRole();
  const visibleItems = NAV_ITEMS.filter(item => hasRole(item.roles));

  return (
    <nav className={styles.nav} aria-label="Mobile navigation">
      {visibleItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          aria-label={item.label}
        >
          {item.icon}
          <span className={styles.label}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
