import type { GoogleProfile } from '../auth/google';
import type { SessionRepository } from './sessionRepository';

const STORAGE_KEY = 'ctvrd:session';

export function createLocalStorageSessionRepository(): SessionRepository {
  return {
    get() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as GoogleProfile;
      } catch {
        return null;
      }
    },
    save(profile) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    },
    clear() {
      localStorage.removeItem(STORAGE_KEY);
    },
  };
}
