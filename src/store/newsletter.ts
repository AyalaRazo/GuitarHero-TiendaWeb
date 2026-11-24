import { emailError } from '../lib/validate';
import { createStore, isArray } from './persist';

const isList = (value: unknown): value is string[] => isArray(value) && value.every((item) => typeof item === 'string');

export const newsletterStore = createStore<string[]>('newsletter', () => [], isList);

export function subscribeToNewsletter(email: string): { ok: true; already: boolean } | { ok: false; error: string } {
  const message = emailError(email);
  if (message) return { ok: false, error: message };
  const normalized = email.trim().toLowerCase();
  if (newsletterStore.get().includes(normalized)) return { ok: true, already: true };
  return newsletterStore.set((list) => [...list, normalized])
    ? { ok: true, already: false }
    : { ok: false, error: 'No se pudo guardar tu correo en este navegador.' };
}
