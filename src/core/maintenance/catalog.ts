import type { MaintenanceItem } from '../types';

/**
 * Catálogo genérico de mantenimiento — aplica a cualquier vehículo, sin
 * curación por modelo (eso es trabajo de M2/data/specs, que puede sobrescribir
 * estos valores más adelante). Costos en RD$, estimados de referencia sin
 * validar con talleres reales — ver PLAN.md §7 y MVP.md §3.
 */
export const MAINTENANCE_CATALOG: MaintenanceItem[] = [
  {
    id: 'oil',
    name: 'Cambio de aceite',
    category: 'fluids',
    intervalKm: 5000,
    intervalMonths: 6,
    costDOP: { min: 2000, max: 3000 },
  },
  {
    id: 'air-filter',
    name: 'Filtro de aire',
    category: 'engine',
    intervalKm: 15000,
    intervalMonths: 12,
    costDOP: { min: 800, max: 1500 },
  },
  {
    id: 'spark-plugs',
    name: 'Bujías',
    category: 'engine',
    intervalKm: 40000,
    intervalMonths: 36,
    costDOP: { min: 2500, max: 4500 },
  },
  {
    id: 'tires',
    name: 'Gomas (juego de 4)',
    category: 'tires',
    intervalKm: 40000,
    intervalMonths: 48,
    costDOP: { min: 14000, max: 18000 },
  },
  {
    id: 'battery',
    name: 'Batería',
    category: 'battery',
    intervalMonths: 48,
    costDOP: { min: 4000, max: 5500 },
  },
  {
    id: 'brakes',
    name: 'Pastillas de freno',
    category: 'brakes',
    intervalKm: 20000,
    intervalMonths: 18,
    costDOP: { min: 3000, max: 6000 },
  },
  {
    id: 'timing-belt',
    name: 'Correa de tiempo',
    category: 'timing',
    intervalKm: 100000,
    intervalMonths: 84,
    costDOP: { min: 7000, max: 12000 },
  },
  {
    id: 'alignment',
    name: 'Alineación y balanceo',
    category: 'tires',
    intervalKm: 10000,
    intervalMonths: 12,
    costDOP: { min: 1200, max: 2000 },
  },
];
