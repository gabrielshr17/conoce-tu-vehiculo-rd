/**
 * Bandera dominicana dibujada con SVG. El emoji 🇩🇴 no renderiza de forma
 * confiable en todas las plataformas (en Windows suele mostrar "DO" en vez
 * de la bandera) — un SVG se ve igual en cualquier lado.
 */
interface DrFlagProps {
  size?: number;
  className?: string;
}

export function DrFlag({ size = 16, className }: DrFlagProps) {
  const w = size * 1.5;
  const h = size;
  const cross = h * 0.22;
  const half = (h - cross) / 2;
  const halfW = (w - cross) / 2;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <rect width={w} height={h} fill="#fff" />
      <rect x={0} y={0} width={halfW} height={half} fill="#002D62" />
      <rect x={halfW + cross} y={0} width={halfW} height={half} fill="#CE1126" />
      <rect x={0} y={half + cross} width={halfW} height={half} fill="#CE1126" />
      <rect x={halfW + cross} y={half + cross} width={halfW} height={half} fill="#002D62" />
    </svg>
  );
}
