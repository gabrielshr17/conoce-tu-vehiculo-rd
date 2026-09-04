import type { ReactNode } from 'react';
import styles from './TopBar.module.css';

interface TopBarProps {
  title: string;
  subtitle?: string;
  gradient?: boolean;
  onBack?: () => void;
  icon?: ReactNode;
}

export function TopBar({ title, subtitle, gradient, onBack, icon }: TopBarProps) {
  return (
    <div className={`${styles.topbar} ${gradient ? styles.grad : ''}`}>
      {onBack && (
        <button type="button" className={styles.back} onClick={onBack} aria-label="Atrás">
          ←
        </button>
      )}
      <div>
        <h2 className={styles.title}>
          {icon}
          <span>{title}</span>
        </h2>
        {subtitle && <div className={styles.sub}>{subtitle}</div>}
      </div>
    </div>
  );
}
