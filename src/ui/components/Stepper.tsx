import styles from './Stepper.module.css';

interface StepperProps {
  total: number;
  current: number; // 1-indexed
}

export function Stepper({ total, current }: StepperProps) {
  return (
    <div className={styles.steps}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`${styles.dot} ${i < current ? styles.on : ''}`} />
      ))}
    </div>
  );
}
