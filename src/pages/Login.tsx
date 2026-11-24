import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

/* A dónde iba la persona antes de que la mandaran a iniciar sesión (puede venir como ruta o como location) */
export function destinationOf(state: unknown): string | undefined {
  const from = (state as { from?: unknown } | null)?.from;
  if (typeof from === 'string') return from;
  if (from && typeof (from as { pathname?: unknown }).pathname === 'string') return (from as { pathname: string }).pathname;
  return undefined;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; auth?: string }>({});
  
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = destinationOf(location.state);
  const reason = (location.state as { reason?: string } | null)?.reason;
  const notice =
    from === '/checkout'
      ? 'Inicia sesión para terminar tu compra. Tu carrito se queda como está.'
      : reason === 'favoritos'
        ? 'Inicia sesión para guardar tus favoritos.'
        : '';

  // Si ya hay sesión, no tiene caso ver el login
  if (isAuthenticated) return <Navigate to={from ?? '/cuenta'} replace />;

  const validate = () => {
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'El formato del correo no es válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // El rol (cliente o administrador) lo decide el correo; al entrar siempre se ve el panel de la cuenta
      const result = signIn(email, password, true);
      if (result.ok) {
        navigate(from ?? '/cuenta', { replace: true });
      } else {
        setErrors({ auth: result.error });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="bg-[#111a16]/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        
        <h2 className="text-3xl font-black mb-6 text-center text-[#f1e6d0]">Iniciar Sesión</h2>

        {notice && (
          <div className="bg-[#f1e6d0]/10 border border-[#f1e6d0]/30 text-[#f1e6d0] p-3 rounded-lg text-sm mb-4 text-center font-medium" role="status">
            {notice}
          </div>
        )}
        
        {errors.auth && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm mb-4 text-center font-medium" role="alert">
            {errors.auth}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="l-correo" className="block text-sm font-medium text-[#c4b9a3] mb-1">Correo Electrónico</label>
            <input 
              id="l-correo"
              autoComplete="email"
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`block w-full rounded-lg shadow-sm p-3 bg-black/40 text-[#f1e6d0] border focus:ring-[#f1e6d0] focus:border-[#f1e6d0] outline-none transition ${errors.email ? 'border-red-500/50' : 'border-white/10'}`}
              placeholder="ejemplo@uabc.edu.mx"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="l-clave" className="block text-sm font-medium text-[#c4b9a3] mb-1">Contraseña</label>
            <input 
              id="l-clave"
              autoComplete="current-password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`block w-full rounded-lg shadow-sm p-3 bg-black/40 text-[#f1e6d0] border focus:ring-[#f1e6d0] focus:border-[#f1e6d0] outline-none transition ${errors.password ? 'border-red-500/50' : 'border-white/10'}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.password}</p>}
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#f1e6d0] text-[#111a16] font-bold p-3 rounded-lg hover:bg-[#dfd4be] transition duration-200 mt-2 shadow-lg"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#c4b9a3]">
          ¿Primera vez en la tienda?{' '}
          <Link className="font-semibold text-[#f1e6d0] underline underline-offset-4 hover:text-white" to="/registro" state={location.state}>
            Crea tu cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}