import { useMemo, useState } from 'react';
import styles from './SearchableList.module.css';

interface SearchableListProps<T> {
  items: T[];
  getLabel: (item: T) => string;
  getKey: (item: T) => string;
  selectedKey?: string;
  onSelect: (item: T) => void;
  placeholder?: string;
}

export function SearchableList<T>({
  items,
  getLabel,
  getKey,
  selectedKey,
  onSelect,
  placeholder = 'Buscar...',
}: SearchableListProps<T>) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => getLabel(item).toLowerCase().includes(q));
  }, [items, query, getLabel]);

  return (
    <div>
      <div className={styles.search}>
        🔍
        <input
          className={styles.searchInput}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      <div className={styles.list}>
        {filtered.length === 0 && <div className={styles.empty}>Sin resultados.</div>}
        {filtered.map((item) => {
          const key = getKey(item);
          const isSelected = key === selectedKey;
          return (
            <button
              key={key}
              type="button"
              className={`${styles.opt} ${isSelected ? styles.sel : ''}`}
              onClick={() => onSelect(item)}
            >
              {getLabel(item)}
              {isSelected && <span className={styles.chk}>✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
