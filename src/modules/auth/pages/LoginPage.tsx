import type { ReactElement } from 'react';
import { LoginForm } from '../components/LoginForm';
import logoDark from '@/assets/images/logo.png';
import logoLight from '@/assets/images/logoLightTheme.png';
import { useTheme } from '@/context/ThemeContext';
import styles from './LoginPage.module.css';

export function LoginPage(): ReactElement {
  const { theme } = useTheme();
  const logo = theme === 'light' ? logoLight : logoDark;

  return (
    <div className={styles.page}>
      <img src={logo} alt="COC Odogunyan" className={styles.logoImg} />
      <h1 className={styles.heading}>Church of Christ</h1>
      <p className={styles.subheading}>Odogunyan · Secretariat</p>

      <div className={styles.card}>
        <LoginForm />
        <p className={styles.roleHint}>
          Access is managed by the church administrator.<br />
          Contact the secretary if you need assistance.
        </p>
      </div>
    </div>
  );
}
