import type { HistoryEntry, MaintenanceItem, Priority, Recommendation } from '../types';
import { MAINTENANCE_CATALOG } from './catalog';
import { RD_MODIFIERS } from './rdModifiers';

export interface RecommendInput {
  vehicleYear: number;
  currentKm: number;
  history: HistoryEntry[];
  today: Date;
}

function monthsSinceVehicleYear(vehicleYear: number, today: Date): number {
  return (today.getFullYear() - vehicleYear) * 12 + today.getMonth();
}

function monthsBetween(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}

function priorityFor(progress: number): Priority {
  if (progress >= 1) return 'urgent';
  if (progress >= 0.8) return 'soon';
  return 'later';
}

function findLastEntry(history: HistoryEntry[], itemId: string): HistoryEntry | undefined {
  return history.filter((h) => h.itemId === itemId).sort((a, b) => b.date.localeCompare(a.date))[0];
}

function describeDue(unit: 'km' | 'meses', amount: number): string {
  const rounded = Math.round(Math.abs(amount));
  const formatted = unit === 'km' ? `${rounded.toLocaleString('es-DO')} km` : `${rounded} meses`;
  return amount >= 0 ? `Vencido hace ${formatted}` : `Faltan ${formatted}`;
}

function computeRecommendation(item: MaintenanceItem, input: RecommendInput): Recommendation {
  const { vehicleYear, currentKm, history, today } = input;
  const last = findLastEntry(history, item.id);

  const kmSinceLast = last ? currentKm - last.km : currentKm;
  const monthsSinceLast = last ? monthsBetween(new Date(last.date), today) : monthsSinceVehicleYear(vehicleYear, today);

  const modifier = RD_MODIFIERS[item.id]?.factor ?? 1;
  const effectiveIntervalKm = item.intervalKm !== undefined ? item.intervalKm * modifier : undefined;
  const effectiveIntervalMonths = item.intervalMonths !== undefined ? item.intervalMonths * modifier : undefined;

  const kmRatio = effectiveIntervalKm !== undefined ? kmSinceLast / effectiveIntervalKm : undefined;
  const monthRatio = effectiveIntervalMonths !== undefined ? monthsSinceLast / effectiveIntervalMonths : undefined;

  // "Lo que se cumpla primero": el mayor de los dos ratios disponibles.
  const progress = Math.max(kmRatio ?? -Infinity, monthRatio ?? -Infinity);
  const dueByKm = kmRatio !== undefined && (monthRatio === undefined || kmRatio >= monthRatio);

  const dueReason = dueByKm
    ? describeDue('km', kmSinceLast - (effectiveIntervalKm ?? 0))
    : describeDue('meses', monthsSinceLast - (effectiveIntervalMonths ?? 0));

  return {
    item,
    priority: priorityFor(progress),
    progress,
    dueReason,
    rdTip: RD_MODIFIERS[item.id]?.reason,
    hasHistory: last !== undefined,
  };
}

/**
 * Calcula las recomendaciones de mantenimiento para un vehículo, de más a
 * menos urgente. Función pura: sin I/O, sin `new Date()` interno — `today`
 * se recibe como parámetro para que sea determinista y testeable.
 *
 * Si un item nunca se registró en el historial, se asume "desde que el
 * vehículo es nuevo" (km 0 / año del vehículo) — no se inventa una fecha de
 * último servicio; `hasHistory: false` le indica a la UI que invite al
 * usuario a confirmar o registrar cuándo lo hizo en realidad.
 */
export function recommend(input: RecommendInput): Recommendation[] {
  return MAINTENANCE_CATALOG.map((item) => computeRecommendation(item, input)).sort(
    (a, b) => b.progress - a.progress,
  );
}
