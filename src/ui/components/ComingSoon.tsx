import { Construction } from 'lucide-react';
import { Card } from './Card';
import styles from './ComingSoon.module.css';

interface ComingSoonProps {
  milestone: string;
  title: string;
  description: string;
}

export function ComingSoon({ milestone, title, description }: ComingSoonProps) {
  return (
    <div className={styles.wrap}>
      <Card padded>
        <span className={styles.badge}>
          <Construction size={12} /> {milestone}
        </span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.desc}>{description}</p>
      </Card>
    </div>
  );
}
