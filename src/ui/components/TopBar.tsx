import type { ReactNode } from 'react';
import styles from './TopBar.module.css';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  icon?: ReactNode;
  actions?: ReactNode;
}

export function TopBar({ title, subtitle, onBack, icon, actions }: TopBarProps) {
  return (
    <header className={styles.topbar}>
      {onBack && (
        <button type="button" className={styles.back} onClick={onBack} aria-label="Atrás">
          ←
        </button>
      )}
      <div className={styles.heading}>
        <h2 className={styles.title}>
          {icon}
          <span>{title}</span>
        </h2>
        {subtitle && <div className={styles.sub}>{subtitle}</div>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
