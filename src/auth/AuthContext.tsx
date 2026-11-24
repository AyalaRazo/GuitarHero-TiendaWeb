import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface AuthUser {
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'customer';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  profile: AuthUser | null;
  login: (email: string) => void;
  logout: () => void;
  signOut: () => void;
  updateProfile: (updates: Partial<Pick<AuthUser, 'firstName' | 'lastName'>>) => void;
  changePassword: (currentPassword: string, newPassword: string) => { ok: boolean; message: string };
}

const STORAGE_KEY = 'authUser';
const PASSWORDS_KEY = 'guitarhero_passwords';

const KNOWN_USERS: Record<string, { firstName: string; lastName: string; role: 'admin' | 'customer' }> = {
  'erick@uabc.edu.mx': { firstName: 'Erick', lastName: 'González', role: 'admin' },
  'julio@uabc.edu.mx': { firstName: 'Julio', lastName: 'Ayala', role: 'admin' },
  'luis@uabc.edu.mx': { firstName: 'Luis', lastName: 'Gómez', role: 'admin' },
  'admin@uabc.edu.mx': { firstName: 'Admin', lastName: 'Guitar Hero', role: 'admin' },
};

const DEFAULT_PASSWORDS: Record<string, string> = {
  'erick@uabc.edu.mx': 'password123',
  'julio@uabc.edu.mx': 'password123',
  'luis@uabc.edu.mx': 'password123',
  'admin@uabc.edu.mx': 'admin123',
};

function getStoredPasswords(): Record<string, string> {
  try {
    const saved = localStorage.getItem(PASSWORDS_KEY);
    if (saved) {
      return { ...DEFAULT_PASSWORDS, ...JSON.parse(saved) };
    }
  } catch {
    // Si hay datos corruptos, usa las contraseñas por defecto
  }
  return { ...DEFAULT_PASSWORDS };
}

export function verifyCredentials(email: string, password: string): boolean {
  const normalized = email.trim().toLowerCase();
  const passwords = getStoredPasswords();
  return Boolean(passwords[normalized] && passwords[normalized] === password);
}

function buildUserFromEmail(email: string): AuthUser {
  const normalized = email.trim().toLowerCase();
  const known = KNOWN_USERS[normalized];
  if (known) {
    return { ...known, email: normalized };
  }
  const rawName = normalized.split('@')[0] || 'Usuario';
  const firstName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  return {
    firstName,
    lastName: '',
    email: normalized,
    role: 'admin',
  };
}

function loadStoredUser(): AuthUser | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    if (saved.startsWith('{')) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed.email === 'string') {
        return {
          firstName: parsed.firstName || parsed.email.split('@')[0],
          lastName: parsed.lastName || '',
          email: parsed.email,
          role: parsed.role || 'admin',
        };
      }
    }
    return buildUserFromEmail(saved);
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(loadStoredUser);
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (email: string) => {
    setUser(buildUserFromEmail(email));
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<Pick<AuthUser, 'firstName' | 'lastName'>>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const changePassword = (currentPassword: string, newPassword: string) => {
    if (!user) {
      return { ok: false, message: 'No hay una sesión activa.' };
    }
    const email = user.email.trim().toLowerCase();
    const passwords = getStoredPasswords();

    if (passwords[email] !== currentPassword) {
      return { ok: false, message: 'La contraseña actual es incorrecta.' };
    }

    const updated = { ...passwords, [email]: newPassword };
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(updated));
    return { ok: true, message: 'Contraseña actualizada. Úsala en tu próximo inicio de sesión.' };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        profile: user,
        login,
        logout,
        signOut: logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};

export function initialsOf(user: AuthUser | string | null | undefined): string {
  if (!user) return 'GH';
  if (typeof user === 'string') {
    const clean = user.trim();
    return clean ? clean.slice(0, 2).toUpperCase() : 'GH';
  }
  const first = user.firstName?.[0] ?? '';
  const last = user.lastName?.[0] ?? '';
  const combined = `${first}${last}`.trim();
  if (combined) return combined.toUpperCase();
  if (user.email) return String(user.email).slice(0, 2).toUpperCase();
  return 'GH';
}