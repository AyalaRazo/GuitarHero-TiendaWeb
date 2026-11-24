import { createContext, useCallback, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { emailError, passwordError, phoneError, required } from '../lib/validate';
import { useStore } from '../store/persist';
import {
  findUserByEmail,
  hashPassword,
  isSessionAlive,
  markTabSession,
  newSalt,
  normalizeEmail,
  roleForEmail,
  sessionStore,
  usersStore,
} from '../store/users';
import type { Role, UserRecord } from '../store/users';
import { uid } from '../store/persist';

export type { Role };

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
}

/* Cada operación responde con ok, o con el error y el campo al que pertenece */
export type AuthResult = { ok: true } | { ok: false; error: string; field?: string };

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthValue {
  /* Contrato original del equipo: isAuthenticated, user (correo) y logout */
  isAuthenticated: boolean;
  user: string | null;
  logout: () => void;
  /* Datos completos de la cuenta y su rol, que se decide por el correo */
  account: AuthUser | null;
  isAdmin: boolean;
  register: (data: RegisterData) => AuthResult;
  signIn: (email: string, password: string, remember: boolean) => AuthResult;
  updateProfile: (data: { firstName: string; lastName: string; phone: string }) => AuthResult;
  changePassword: (current: string, next: string) => AuthResult;
}

const AuthContext = createContext<AuthValue | null>(null);

export const initialsOf = (user: AuthUser): string =>
  `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();

const publicUser = ({ id, firstName, lastName, email, phone }: UserRecord): AuthUser => ({
  id,
  firstName,
  lastName,
  email,
  phone,
  role: roleForEmail(email), // el rol sale del correo, no de lo que haya quedado guardado
});

const fail = (error: string, field?: string): AuthResult => ({ ok: false, error, field });

export function AuthProvider({ children }: { children: ReactNode }) {
  const users = useStore(usersStore);
  const session = useStore(sessionStore);

  const record = isSessionAlive(session) ? users.find((item) => item.id === session.userId) : undefined;
  const account = useMemo(() => (record ? publicUser(record) : null), [record]);

  const startSession = useCallback((userId: string, remember: boolean) => {
    markTabSession(userId);
    sessionStore.set({ userId, remember });
  }, []);

  const register = useCallback<AuthValue['register']>(
    (data) => {
      const firstName = data.firstName.trim();
      const lastName = data.lastName.trim();
      const checks: [string, string][] = [
        ['firstName', required(firstName, 'Escribe tu nombre.')],
        ['lastName', required(lastName, 'Escribe tus apellidos.')],
        ['email', emailError(data.email)],
        ['password', passwordError(data.password)],
      ];
      const first = checks.find(([, message]) => message);
      if (first) return fail(first[1], first[0]);
      if (findUserByEmail(data.email)) return fail('Ya existe una cuenta con ese correo. Inicia sesión.', 'email');

      const salt = newSalt();
      const created: UserRecord = {
        id: uid(),
        firstName,
        lastName,
        email: normalizeEmail(data.email),
        phone: '',
        role: 'cliente', // el rol de administrador nunca se elige al registrarse
        salt,
        hash: hashPassword(salt, data.password),
        createdAt: Date.now(),
      };
      if (!usersStore.set((current) => [...current, created])) return fail('No se pudo guardar tu cuenta en este navegador.');
      startSession(created.id, true);
      return { ok: true };
    },
    [startSession],
  );

  const signIn = useCallback<AuthValue['signIn']>(
    (email, password, remember) => {
      const emailMessage = emailError(email);
      if (emailMessage) return fail(emailMessage, 'email');
      if (!password) return fail('Escribe tu contraseña.', 'password');
      const found = findUserByEmail(email);
      // El mismo mensaje en los dos casos: no revela qué correos existen
      if (!found || found.hash !== hashPassword(found.salt, password)) return fail('Correo o contraseña incorrectos.');
      startSession(found.id, remember);
      return { ok: true };
    },
    [startSession],
  );

  const logout = useCallback(() => {
    markTabSession(null);
    sessionStore.set(null);
  }, []);

  const updateProfile = useCallback<AuthValue['updateProfile']>(
    (data) => {
      if (!account) return fail('Inicia sesión para cambiar tus datos.');
      const firstName = data.firstName.trim();
      const lastName = data.lastName.trim();
      const checks: [string, string][] = [
        ['firstName', required(firstName, 'Escribe tu nombre.')],
        ['lastName', required(lastName, 'Escribe tus apellidos.')],
        ['phone', phoneError(data.phone, true)],
      ];
      const first = checks.find(([, message]) => message);
      if (first) return fail(first[1], first[0]);
      const saved = usersStore.set((current) =>
        current.map((item) => (item.id === account.id ? { ...item, firstName, lastName, phone: data.phone.trim() } : item)),
      );
      return saved ? { ok: true } : fail('No se pudieron guardar los cambios.');
    },
    [account],
  );

  const changePassword = useCallback<AuthValue['changePassword']>(
    (current, next) => {
      if (!record) return fail('Inicia sesión para cambiar tu contraseña.');
      if (record.hash !== hashPassword(record.salt, current)) return fail('La contraseña actual no es correcta.', 'current');
      const message = passwordError(next);
      if (message) return fail(message, 'next');
      if (current === next) return fail('La nueva contraseña debe ser distinta de la actual.', 'next');
      const salt = newSalt();
      const saved = usersStore.set((all) =>
        all.map((item) => (item.id === record.id ? { ...item, salt, hash: hashPassword(salt, next) } : item)),
      );
      return saved ? { ok: true } : fail('No se pudo guardar la contraseña.');
    },
    [record],
  );

  const value = useMemo(
    () => ({
      isAuthenticated: account !== null,
      user: account ? account.email : null,
      account,
      isAdmin: account?.role === 'admin',
      register,
      signIn,
      logout,
      updateProfile,
      changePassword,
    }),
    [account, register, signIn, logout, updateProfile, changePassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
