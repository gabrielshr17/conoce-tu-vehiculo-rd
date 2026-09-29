import { Timer } from 'lucide-react';
import type { Recommendation } from '../../core/types';
import { formatCurrencyRange } from '../../core/format';
import { Badge } from './Badge';
import { DrFlag } from './DrFlag';
import { CATEGORY_ICON, PRIORITY_LABEL, PRIORITY_TONE } from './maintenanceMeta';
import styles from './PriorityCard.module.css';

interface PriorityCardProps {
  recommendation: Recommendation;
  onMarkDone: () => void;
}

export function PriorityCard({ recommendation, onMarkDone }: PriorityCardProps) {
  const { item, dueReason, rdTip, hasHistory, priority } = recommendation;
  const Icon = CATEGORY_ICON[item.category];

  return (
    <article className={`${styles.card} ${styles[priority]}`}>
      <div className={styles.top}>
        <span className={styles.iconBox} aria-hidden="true">
          <Icon size={16} />
        </span>
        <h3 className={styles.title}>{item.name}</h3>
        <Badge tone={PRIORITY_TONE[priority]}>{PRIORITY_LABEL[priority]}</Badge>
      </div>
      {!hasHistory && <p className={styles.meta}>Estimado: todavía no tienes este servicio registrado.</p>}
      {rdTip && priority !== 'later' && (
        <div className={styles.tip}>
          <DrFlag size={13} /> {rdTip}
        </div>
      )}
      <div className={styles.row}>
        <span className={styles.due}>
          <Timer size={14} aria-hidden="true" /> {dueReason}
        </span>
        <span className={styles.cost}>{formatCurrencyRange(item.costDOP.min, item.costDOP.max)}</span>
      </div>
      <button
        type="button"
        className={styles.mini}
        onClick={onMarkDone}
        aria-label={`Marcar hecho: ${item.name}`}
      >
        Marcar hecho
      </button>
    </article>
  );
}
