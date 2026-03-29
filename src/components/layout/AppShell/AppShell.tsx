import { Outlet } from 'react-router-dom';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Sidebar } from '../Sidebar/Sidebar';
import { TopBar } from '../TopBar/TopBar';
import { MobileNav } from '../MobileNav/MobileNav';
import { ToastContainer } from '@/components/ui/Toast/ToastContainer';
import type { ReactElement } from 'react';
import styles from './AppShell.module.css';

export function AppShell(): ReactElement {
  const breakpoint = useBreakpoint();

  return (
    <div className={styles.shell}>
      {breakpoint !== 'mobile' && (
        <Sidebar collapsed={breakpoint === 'tablet'} />
      )}

      <div className={styles.body}>
        <TopBar />
        <main className={styles.main} id="main-content">
          <Outlet />
        </main>
      </div>

      {breakpoint === 'mobile' && <MobileNav />}

      <ToastContainer />
    </div>
  );
}
