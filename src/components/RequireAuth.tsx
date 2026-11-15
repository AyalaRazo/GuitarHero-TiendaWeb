import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Si no está autenticado, lo manda al login y guarda la ruta a la que intentaba ir
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}