import type { Recommendation } from '../../core/types';
import { formatCurrencyRange } from '../../core/format';
import { DrFlag } from './DrFlag';
import styles from './PriorityCard.module.css';

const BAR_COLOR: Record<Recommendation['priority'], string> = {
  urgent: 'var(--rojo)',
  soon: 'var(--amarillo)',
  later: 'var(--verde)',
};

interface PriorityCardProps {
  recommendation: Recommendation;
  onMarkDone: () => void;
}

export function PriorityCard({ recommendation, onMarkDone }: PriorityCardProps) {
  const { item, dueReason, rdTip, hasHistory, priority } = recommendation;

  return (
    <div className={styles.card}>
      <div className={styles.bar} style={{ background: BAR_COLOR[priority] }} />
      <div className={styles.title}>{item.name}</div>
      <div className={styles.meta}>
        {dueReason}
        {!hasHistory && ' · estimado, sin registro previo'}
      </div>
      {rdTip && priority !== 'later' && (
        <div className={styles.tip}>
          <DrFlag size={13} /> {rdTip}
        </div>
      )}
      <div className={styles.row}>
        <span className={styles.cost}>{formatCurrencyRange(item.costDOP.min, item.costDOP.max)}</span>
        <button type="button" className={styles.mini} onClick={onMarkDone}>
          Marcar hecho
        </button>
      </div>
    </div>
  );
}
