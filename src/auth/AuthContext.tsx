import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  } | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  // PERSISTENCIA: Se verifica si hay un usuario activo al cargar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }
  }, []);

  const login = (email: string) => {
    setIsAuthenticated(true);
    setUser(email);
    localStorage.setItem('authUser', email); // Guarda la sesión en el navegador
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('authUser'); // Elimina la sesión
  };

  const profile = user
    ? {
        firstName: user.split('@')[0],
        lastName: '',
        email: user,
        role: 'admin',
      }
    : null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, profile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};

export function initialsOf(user: any): string {
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