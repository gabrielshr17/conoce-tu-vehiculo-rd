import styles from './CarSilhouette.module.css';

export function CarSilhouette() {
  return (
    <div className={styles.stage} aria-hidden="true">
      <div className={styles.light} />
      <svg className={styles.car} viewBox="0 0 300 110" role="presentation">
        <defs>
          <linearGradient id="car-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e2e8f0" />
            <stop offset="1" stopColor="#64748b" />
          </linearGradient>
        </defs>
        <ellipse cx="152" cy="100" rx="140" ry="6" fill="#000" opacity="0.55" />
        <path
          d="M10 78C10 66 18 60 34 57L78 50C92 36 112 26 140 24H186C206 24 222 34 238 48L268 52C284 54 292 62 292 72V80C292 84 289 86 285 86H262A22 22 0 0 0 218 86H92A22 22 0 0 0 48 86H16C12 86 10 83 10 80Z"
          fill="url(#car-body)"
        />
        <path d="M88 50C100 38 116 31 138 30H150V50Z" fill="#0b0e14" />
        <path d="M158 30H184C200 30 214 38 226 50H158Z" fill="#0b0e14" />
        <path d="M14 66H30" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
        <path d="M284 60V68" stroke="#e53935" strokeWidth="4" strokeLinecap="round" />
        <circle cx="70" cy="86" r="17" fill="#0b0e14" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="70" cy="86" r="7" fill="#1c2433" stroke="#64748b" />
        <circle cx="240" cy="86" r="17" fill="#0b0e14" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="240" cy="86" r="7" fill="#1c2433" stroke="#64748b" />
      </svg>
    </div>
  );
}
