import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import type { Role } from '../auth/AuthContext';

interface RequireAuthProps {
  children: ReactNode;
  /* Si se indica, además de tener sesión hace falta ese rol (por ejemplo, 'admin') */
  role?: Role;
}

export default function RequireAuth({ children, role }: RequireAuthProps) {
  const { isAuthenticated, account } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Si no está autenticado, lo manda al login y guarda la ruta a la que intentaba ir
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Con sesión pero sin el rol pedido, vuelve al panel de su cuenta
  if (role && account?.role !== role) return <Navigate to="/cuenta" replace />;

  return <>{children}</>;
}

export { RequireAuth };
