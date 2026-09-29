import { formatKm } from './format';
import type { HistoryEntry } from './types';

export type OdometerResult = { ok: true; km: number } | { ok: false; error: string };

export function validateOdometer(raw: string, history: HistoryEntry[]): OdometerResult {
  const km = Number(raw.trim());
  if (!raw.trim() || !Number.isFinite(km) || km <= 0) {
    return { ok: false, error: 'Escribe los kilómetros que marca el tablero, solo números.' };
  }

  const highestRecorded = Math.max(0, ...history.map((h) => h.km));
  if (km < highestRecorded) {
    return {
      ok: false,
      error: `Tu historial ya tiene un servicio a ${formatKm(highestRecorded)}. El odómetro no puede marcar menos.`,
    };
  }

  return { ok: true, km };
}
