import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import type { Role } from '../auth/AuthContext';

interface RequireAuthProps {
  children: ReactNode;
  role?: Role;
}

/* Sin sesión manda al login y recuerda a dónde iba; con sesión pero sin el rol, vuelve a Mi cuenta */
export function RequireAuth({ children, role }: RequireAuthProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/cuenta/ingresar" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to="/cuenta" replace />;
  return <>{children}</>;
}
