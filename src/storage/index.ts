export type { VehicleRepository } from './repository';
export { createLocalStorageRepository } from './localStorage';

import { createLocalStorageRepository } from './localStorage';

export const vehicleRepository = createLocalStorageRepository();
