import { createStore, useStore } from './persist';

export interface Preferences {
  newProducts: boolean;
  orderUpdates: boolean;
  weeklyOffers: boolean;
}

const DEFAULTS: Preferences = { newProducts: true, orderUpdates: true, weeklyOffers: false };

type PreferenceMap = Record<string, Preferences>;

const isMap = (value: unknown): value is PreferenceMap =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const preferencesStore = createStore<PreferenceMap>('preferences', () => ({}), isMap);

export function usePreferences(userId: string | undefined): Preferences {
  const map = useStore(preferencesStore);
  return (userId && map[userId]) || DEFAULTS;
}

export const savePreferences = (userId: string, preferences: Preferences): boolean =>
  preferencesStore.set((map) => ({ ...map, [userId]: preferences }));
