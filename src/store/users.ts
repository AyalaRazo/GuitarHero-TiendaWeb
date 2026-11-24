import { sha256 } from '../lib/sha256';
import { createStore, isArray, uid } from './persist';

/*
  Usuarios guardados en localStorage. La contraseña se guarda con sal y SHA-256, nunca en texto plano.
  Ojo: esto es una simulación en el navegador; en producción esto lo hace un servidor.
*/

export type Role = 'cliente' | 'admin';

export interface UserRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  salt: string;
  hash: string;
  createdAt: number;
}

/*
  Cuentas administradoras del equipo. El rol de administrador depende SOLO del correo:
  quien se registra nunca puede elegirlo, y estas cuentas existen desde la primera vez que se abre la tienda.
*/
export const ADMIN_ACCOUNTS = [
  { email: 'erick@uabc.edu.mx', firstName: 'Erick', password: 'password123' },
  { email: 'luis@uabc.edu.mx', firstName: 'Luis', password: 'password123' },
  { email: 'julio@uabc.edu.mx', firstName: 'Julio', password: 'password123' },
];

export const isAdminEmail = (email: string): boolean =>
  ADMIN_ACCOUNTS.some((admin) => admin.email === email.trim().toLowerCase());

export const roleForEmail = (email: string): Role => (isAdminEmail(email) ? 'admin' : 'cliente');

const adminRecords = (): UserRecord[] =>
  ADMIN_ACCOUNTS.map((admin) => {
    const salt = `guitarhero-${admin.firstName.toLowerCase()}`;
    return {
      id: `admin-${admin.firstName.toLowerCase()}`,
      firstName: admin.firstName,
      lastName: 'Guitar Hero',
      email: admin.email,
      phone: '',
      role: 'admin' as Role,
      salt,
      hash: sha256(salt + admin.password),
      createdAt: 0,
    };
  });

const isUserList = (value: unknown): value is UserRecord[] =>
  isArray(value) && value.every((item) => typeof item === 'object' && item !== null && typeof (item as UserRecord).email === 'string');

export const usersStore = createStore<UserRecord[]>('users', adminRecords, isUserList);

/* Si el navegador ya tenía usuarios guardados (de una versión anterior), garantiza que los administradores existan */
const missingAdmins = adminRecords().filter((admin) => !usersStore.get().some((user) => user.email === admin.email));
if (missingAdmins.length > 0) usersStore.set((current) => [...current, ...missingAdmins]);

export const hashPassword = (salt: string, password: string): string => sha256(salt + password);

export const newSalt = (): string => uid();

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const findUserByEmail = (email: string): UserRecord | undefined =>
  usersStore.get().find((user) => user.email === normalizeEmail(email));

/* La sesión guarda solo el id. Si no se marcó "mantener sesión", solo vale mientras la pestaña siga abierta. */
export interface Session {
  userId: string;
  remember: boolean;
}

const isSession = (value: unknown): value is Session | null =>
  value === null || (typeof value === 'object' && typeof (value as Session).userId === 'string');

export const sessionStore = createStore<Session | null>('session', () => null, isSession);

const TAB_KEY = 'guitarhero:tab-session';

export const markTabSession = (userId: string | null): void => {
  try {
    if (userId) sessionStorage.setItem(TAB_KEY, userId);
    else sessionStorage.removeItem(TAB_KEY);
  } catch {
    /* sessionStorage no disponible */
  }
};

export const isSessionAlive = (session: Session | null): session is Session => {
  if (!session) return false;
  if (session.remember) return true;
  try {
    return sessionStorage.getItem(TAB_KEY) === session.userId;
  } catch {
    return false;
  }
};
