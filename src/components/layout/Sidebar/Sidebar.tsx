import { useState, type ReactElement } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { useRole } from '@/hooks/useRole';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import type { MemberRole } from '@/types';
import logoDark from '@/assets/images/logo.png';
import logoLight from '@/assets/images/logoLightTheme.png';
import { useTheme } from '@/context/ThemeContext';
import styles from './Sidebar.module.css';

interface NavItem {
  label: string;
  path: string;
  icon: ReactElement;
  roles: MemberRole[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard', path: '/dashboard', roles: ['admin', 'secretary', 'member'],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: 'Attendance', path: '/attendance', roles: ['admin', 'secretary'],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  {
    label: 'Duty Roster', path: '/roster', roles: ['admin', 'secretary'],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    label: 'Events', path: '/events', roles: ['admin', 'secretary', 'member'],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
  {
    label: 'Members', path: '/members', roles: ['admin', 'secretary'],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    label: 'Services', path: '/services', roles: ['admin', 'secretary'],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps): ReactElement {
  const { member, logout } = useAuthContext();
  const { theme } = useTheme();
  const logo = theme === 'light' ? logoLight : logoDark;
  const { hasRole } = useRole();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const visibleItems = NAV_ITEMS.filter(item => hasRole(item.roles));

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
        <img src={logo} alt="COC Odogunyan" className={styles.logoImg} />
        <div className={`${styles.logoText} ${collapsed ? styles.hidden : ''}`}>
          <div className={styles.logoTitle}>COC Odogunyan</div>
          <div className={styles.logoSub}>Secretariat</div>
        </div>
      </div>

      <nav className={styles.nav} aria-label="Main navigation">
        {visibleItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        {member && (
          <div className={styles.userRow} onClick={() => setShowDropdown(d => !d)}>
            <Avatar name={member.full_name} role={member.role} size="sm" />
            <div className={styles.userInfo}>
              <div className={styles.userName}>{member.full_name}</div>
              <div className={styles.userRole}>{member.role}</div>
            </div>
            {showDropdown && (
              <div className={styles.dropdown}>
                <button className={styles.dropdownItem} onClick={() => navigate('/profile')}>
                  My Profile
                </button>
                <button className={`${styles.dropdownItem} ${styles.danger}`} onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
