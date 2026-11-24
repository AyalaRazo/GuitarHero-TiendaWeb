import { useSyncExternalStore } from 'react';

/*
  Almacén mínimo respaldado por localStorage.
  - Lee una sola vez y guarda el valor en memoria, para que React reciba siempre la misma referencia.
  - Si el valor guardado está corrupto o no existe, arranca con el valor inicial.
  - Se entera de los cambios hechos en otras pestañas (evento "storage").
  - `set` devuelve false si el navegador no pudo guardar (por ejemplo, por falta de espacio).
*/

export interface Store<T> {
  get: () => T;
  set: (next: T | ((previous: T) => T)) => boolean;
  reset: () => void;
  subscribe: (listener: () => void) => () => void;
}

const PREFIX = 'guitarhero:';

export function createStore<T>(name: string, initial: () => T, isValid?: (value: unknown) => value is T): Store<T> {
  const key = PREFIX + name;
  const listeners = new Set<() => void>();
  let cache: T | undefined;
  let loaded = false;

  const read = (): T => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const parsed: unknown = JSON.parse(raw);
        if (!isValid || isValid(parsed)) return parsed as T;
      }
    } catch {
      /* sin acceso o JSON dañado: se usa el valor inicial */
    }
    return initial();
  };

  const notify = () => listeners.forEach((listener) => listener());

  const get = (): T => {
    if (!loaded) {
      cache = read();
      loaded = true;
    }
    return cache as T;
  };

  const set: Store<T>['set'] = (next) => {
    const previous = get();
    const value = typeof next === 'function' ? (next as (p: T) => T)(previous) : next;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return false;
    }
    cache = value;
    notify();
    return true;
  };

  const reset = () => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* nada que hacer */
    }
    cache = initial();
    loaded = true;
    notify();
  };

  const subscribe: Store<T>['subscribe'] = (listener) => {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key === key || event.key === null) {
        loaded = false;
        listener();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', onStorage);
    };
  };

  return { get, set, reset, subscribe };
}

export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

export const uid = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const isArray = (value: unknown): value is unknown[] => Array.isArray(value);
