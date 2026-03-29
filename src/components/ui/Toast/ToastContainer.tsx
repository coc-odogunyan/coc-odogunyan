import { useState, useEffect, type ReactElement } from 'react';
import { subscribeToToasts, dismissToast, type ToastMessage } from '@/lib/toast';
import styles from './Toast.module.css';

const ICONS: Record<ToastMessage['type'], string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warn: '⚠',
};

export function ToastContainer(): ReactElement {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return subscribeToToasts(setToasts);
  }, []);

  return (
    <div className={styles.container} role="status" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
          <span>{ICONS[t.type]}</span>
          <span className={styles.message}>{t.message}</span>
          <button
            className={styles.dismiss}
            onClick={() => dismissToast(t.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
