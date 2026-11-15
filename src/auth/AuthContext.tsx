import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

/*
  Sesión PROVISIONAL solo para poder ver el diseño de cada estado.
  No valida nada ni guarda nada: cualquier correo entra, y si empieza con "admin"
  la sesión tiene rol de administrador. Se reemplaza cuando hagamos la autenticación real.
*/

export type Role = 'cliente' | 'admin';

export interface AuthUser {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

interface SignInOptions {
  firstName?: string;
  lastName?: string;
  role?: Role;
}

interface AuthValue {
  user: AuthUser | null;
  signIn: (email: string, options?: SignInOptions) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

const capitalize = (text: string): string => (text ? text[0].toUpperCase() + text.slice(1) : '');

export const initialsOf = (user: AuthUser): string =>
  `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const signIn = useCallback((email: string, options: SignInOptions = {}) => {
    const [first = '', last = ''] = email.split('@')[0].split(/[._-]+/);
    setUser({
      firstName: options.firstName || capitalize(first) || 'Cliente',
      lastName: options.lastName ?? capitalize(last),
      email,
      role: options.role ?? (email.toLowerCase().startsWith('admin') ? 'admin' : 'cliente'),
    });
  }, []);

  const signOut = useCallback(() => setUser(null), []);

  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
