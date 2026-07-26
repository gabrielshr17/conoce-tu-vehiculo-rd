import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

type Variant = 'solid' | 'ghost' | 'inverse';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClass: Record<Variant, string> = {
  solid: '',
  ghost: styles.ghost,
  inverse: styles.inverse,
};

export function Button({ variant = 'solid', className, ...rest }: ButtonProps) {
  const classes = [styles.btn, variantClass[variant], className].filter(Boolean).join(' ');
  return <button type="button" className={classes} {...rest} />;
}
