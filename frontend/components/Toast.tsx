import { useEffect } from 'react';
import styles from '../styles/Toast.module.css';

type ToastProps = {
  message: string;
  onClose: () => void;
  type?: 'success' | 'error';
};

export default function Toast({ message, onClose, type = 'success' }: ToastProps) {
  const toastClasses = `${styles.toast} ${type === 'error' ? styles.error : styles.success}`;
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={toastClasses} role="alert">
      <svg
        className={styles.toastIcon}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {type === 'error' ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M12 3.75a8.25 8.25 0 110 16.5 8.25 8.25 0 010-16.5z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        )}
      </svg>
      <span className={styles.toastMessage}>{message}</span>
      <button
        type="button"
        className={styles.toastClose}
        onClick={onClose}
        aria-label="Close toast"
      >
        &times;
      </button>
    </div>
  );
}
