/**
 * Modificadores del contexto dominicano — acortan el intervalo efectivo de
 * ciertos items. Valores iniciales a validar con mecánicos locales, ver
 * PLAN.md §2.3 y MVP.md §2.3.
 */
export const RD_MODIFIERS: Record<string, { factor: number; reason: string }> = {
  battery: {
    factor: 0.75,
    reason: 'El calor y la humedad en RD desgastan la batería más rápido.',
  },
  tires: {
    factor: 0.7,
    reason: 'Los hoyos y badenes desgastan las gomas más rápido en RD.',
  },
  alignment: {
    factor: 0.7,
    reason: 'Los hoyos y badenes descuadran la alineación más rápido en RD.',
  },
  'spark-plugs': {
    factor: 0.8,
    reason: 'La calidad variable del combustible en RD ensucia las bujías más rápido.',
  },
};

const RAINY_SEASON_MONTHS = new Set([4, 5, 6, 7, 8, 9, 10]); // mayo(4)–noviembre(10), 0-indexado

/** Aviso estacional, independiente de cualquier item — no ajusta intervalos. */
export function getSeasonalTip(today: Date): string | null {
  if (!RAINY_SEASON_MONTHS.has(today.getMonth())) return null;
  return 'Estamos en época de lluvias: revisa tus frenos y limpiaparabrisas.';
}
