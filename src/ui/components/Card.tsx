import type { HTMLAttributes } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export function Card({ padded, className, ...rest }: CardProps) {
  const classes = [styles.card, padded && styles.pad, className].filter(Boolean).join(' ');
  return <div className={classes} {...rest} />;
}
