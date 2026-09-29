import type { Priority, Recommendation } from '../types';

export type VehicleStatus = 'ok' | 'soon' | 'urgent';

export interface MaintenanceSummary {
  status: VehicleStatus;
  counts: Record<Priority, number>;
  pending: number;
}

export function summarizeRecommendations(recommendations: Recommendation[]): MaintenanceSummary {
  const counts: Record<Priority, number> = { urgent: 0, soon: 0, later: 0 };
  for (const r of recommendations) counts[r.priority] += 1;

  const status: VehicleStatus = counts.urgent > 0 ? 'urgent' : counts.soon > 0 ? 'soon' : 'ok';

  return { status, counts, pending: counts.urgent + counts.soon };
}
