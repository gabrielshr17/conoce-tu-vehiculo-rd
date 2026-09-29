import { BatteryCharging, CircleDot, Cog, Disc, Droplets, Timer, type LucideIcon } from 'lucide-react';
import type { MaintenanceCategory, Priority } from '../../core/types';
import type { VehicleStatus } from '../../core/maintenance/summary';

export const CATEGORY_ICON: Record<MaintenanceCategory, LucideIcon> = {
  fluids: Droplets,
  engine: Cog,
  tires: CircleDot,
  battery: BatteryCharging,
  brakes: Disc,
  timing: Timer,
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  urgent: 'Urgente',
  soon: 'Pronto',
  later: 'Más adelante',
};

export const STATUS_LABEL: Record<VehicleStatus, string> = {
  urgent: 'Atención',
  soon: 'Pronto',
  ok: 'Al día',
};

export type Tone = 'danger' | 'warning' | 'success';

export const PRIORITY_TONE: Record<Priority, Tone> = {
  urgent: 'danger',
  soon: 'warning',
  later: 'success',
};

export const STATUS_TONE: Record<VehicleStatus, Tone> = {
  urgent: 'danger',
  soon: 'warning',
  ok: 'success',
};
