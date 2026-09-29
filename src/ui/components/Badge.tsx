import type { ReactNode } from 'react';
import type { Tone } from './maintenanceMeta';
import styles from './Badge.module.css';

interface BadgeProps {
  tone: Tone;
  children: ReactNode;
  dot?: boolean;
  shape?: 'tag' | 'pill';
}

export function Badge({ tone, children, dot, shape = 'tag' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[tone]} ${styles[shape]}`}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}
