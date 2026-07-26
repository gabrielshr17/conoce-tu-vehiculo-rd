import type { HTMLAttributes } from 'react';
import styles from './Chip.module.css';

export function Chip({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  const classes = [styles.chip, className].filter(Boolean).join(' ');
  return <span className={classes} {...rest} />;
}
