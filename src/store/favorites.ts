import { createStore, useStore } from './persist';

/* Favoritos por persona: { [idDeUsuario]: [idsDeProductos] } */
type FavoriteMap = Record<string, string[]>;

const isMap = (value: unknown): value is FavoriteMap =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const favoritesStore = createStore<FavoriteMap>('favorites', () => ({}), isMap);

const EMPTY: string[] = [];

export function useFavoriteIds(userId: string | undefined): string[] {
  const map = useStore(favoritesStore);
  return (userId && map[userId]) || EMPTY;
}

export function toggleFavorite(userId: string, productId: string): boolean {
  return favoritesStore.set((map) => {
    const current = map[userId] ?? [];
    const next = current.includes(productId) ? current.filter((id) => id !== productId) : [productId, ...current];
    return { ...map, [userId]: next };
  });
}
