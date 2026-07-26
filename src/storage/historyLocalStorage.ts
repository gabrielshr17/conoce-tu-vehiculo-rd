import type { HistoryEntry } from '../core/types';
import type { HistoryRepository } from './historyRepository';

const STORAGE_KEY = 'ctvrd:history';

function readAll(): HistoryEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(entries: HistoryEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function createLocalStorageHistoryRepository(): HistoryRepository {
  return {
    getAll(vehicleId) {
      return readAll().filter((e) => e.vehicleId === vehicleId);
    },
    add(entry) {
      writeAll([...readAll(), entry]);
    },
    update(entry) {
      writeAll(readAll().map((e) => (e.id === entry.id ? entry : e)));
    },
    remove(id) {
      writeAll(readAll().filter((e) => e.id !== id));
    },
  };
}
