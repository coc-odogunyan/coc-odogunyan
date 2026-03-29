export type ToastType = 'success' | 'error' | 'info' | 'warn';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

type Listener = (toasts: ToastMessage[]) => void;

let toasts: ToastMessage[] = [];
const listeners: Set<Listener> = new Set();

function notify() {
  listeners.forEach(l => l([...toasts]));
}

function dispatch(type: ToastType, message: string, duration = 4000) {
  const id = `${Date.now()}-${Math.random()}`;
  toasts = [...toasts.slice(-2), { id, type, message, duration }];
  notify();
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id);
    notify();
  }, duration);
}

export const toast = {
  success: (message: string) => dispatch('success', message),
  error:   (message: string) => dispatch('error',   message),
  info:    (message: string) => dispatch('info',    message),
  warn:    (message: string) => dispatch('warn',    message),
};

export function subscribeToToasts(listener: Listener): () => void {
  listeners.add(listener);
  listener([...toasts]);
  return () => listeners.delete(listener);
}

export function dismissToast(id: string) {
  toasts = toasts.filter(t => t.id !== id);
  notify();
}
