import type { GoogleProfile } from '../auth/google';

export interface SessionRepository {
  get(): GoogleProfile | null;
  save(profile: GoogleProfile): void;
  clear(): void;
}
