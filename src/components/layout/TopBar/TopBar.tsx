import { useLocation } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { ThemeToggle } from '@/components/ui/ThemeToggle/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';
import logoDark from '@/assets/images/logo.png';
import logoLight from '@/assets/images/logoLightTheme.png';
import type { ReactElement } from 'react';
import styles from './TopBar.module.css';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':  'Dashboard',
  '/attendance': 'Attendance',
  '/roster':     'Duty Roster',
  '/events':     'Events',
  '/members':    'Members',
  '/services':   'Services',
};

export function TopBar(): ReactElement {
  const location = useLocation();
  const { member } = useAuthContext();
  const { theme } = useTheme();
  const logo = theme === 'light' ? logoLight : logoDark;

  const basePath = '/' + location.pathname.split('/')[1];
  const title = PAGE_TITLES[basePath] ?? 'Church Secretariat';

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <img src={logo} alt="COC Odogunyan" className={styles.mobileLogo} />
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>
      <div className={styles.right}>
        <ThemeToggle />
        <div className={styles.nextServiceBadge}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Sunday — 22 Mar
        </div>
        {member && (
          <Avatar name={member.full_name} role={member.role} size="sm" />
        )}
      </div>
    </header>
  );
}
