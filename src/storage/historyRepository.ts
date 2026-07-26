import type { HistoryEntry } from '../core/types';

export interface HistoryRepository {
  getAll(vehicleId: string): HistoryEntry[];
  add(entry: HistoryEntry): void;
  update(entry: HistoryEntry): void;
  remove(id: string): void;
}
