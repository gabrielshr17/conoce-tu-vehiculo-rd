export type { HistoryRepository } from './historyRepository';
export { createLocalStorageHistoryRepository } from './historyLocalStorage';
export type { VehicleRepository } from './repository';
export { createLocalStorageRepository } from './localStorage';

import { createLocalStorageHistoryRepository } from './historyLocalStorage';
import { createLocalStorageRepository } from './localStorage';

export const vehicleRepository = createLocalStorageRepository();
export const historyRepository = createLocalStorageHistoryRepository();
