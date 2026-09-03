export type { HistoryRepository } from './historyRepository';
export { createLocalStorageHistoryRepository } from './historyLocalStorage';
export type { VehicleRepository } from './repository';
export { createLocalStorageRepository } from './localStorage';
export type { SessionRepository } from './sessionRepository';
export { createLocalStorageSessionRepository } from './sessionLocalStorage';

import { createLocalStorageHistoryRepository } from './historyLocalStorage';
import { createLocalStorageRepository } from './localStorage';
import { createLocalStorageSessionRepository } from './sessionLocalStorage';

export const vehicleRepository = createLocalStorageRepository();
export const historyRepository = createLocalStorageHistoryRepository();
export const sessionRepository = createLocalStorageSessionRepository();
