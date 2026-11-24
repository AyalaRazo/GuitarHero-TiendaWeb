import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { emailError, passwordError, required } from '../lib/validate';
import { destinationOf } from './Login';

const FIELD =
  'block w-full rounded-lg shadow-sm p-3 bg-black/40 text-[#f1e6d0] border focus:ring-[#f1e6d0] focus:border-[#f1e6d0] outline-none transition';
const LABEL = 'block text-sm font-medium text-[#c4b9a3] mb-1';

type Errors = Record<string, string>;

/* Registro de clientes. El rol de administrador nunca se elige aquí: depende del correo. */
export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = destinationOf(location.state);
  const [values, setValues] = useState({ firstName: '', lastName: '', email: '', password: '', repeat: '' });
  const [errors, setErrors] = useState<Errors>({});

  if (isAuthenticated) return <Navigate to={from ?? '/cuenta'} replace />;

  const set = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const found: Errors = {
      firstName: required(values.firstName.trim(), 'Escribe tu nombre.'),
      lastName: required(values.lastName.trim(), 'Escribe tus apellidos.'),
      email: emailError(values.email),
      password: passwordError(values.password),
      repeat: values.repeat === values.password ? '' : 'Las contraseñas no coinciden.',
    };
    const clean = Object.fromEntries(Object.entries(found).filter(([, message]) => message));
    if (Object.keys(clean).length > 0) {
      setErrors(clean);
      return;
    }
    const result = register(values);
    if (result.ok) {
      navigate(from ?? '/cuenta', { replace: true });
    } else {
      setErrors({ [result.field ?? 'auth']: result.error });
    }
  };

  const field = (key: keyof typeof values, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`r-${key}`} className={LABEL}>
        {label}
      </label>
      <input
        id={`r-${key}`}
        className={`${FIELD} ${errors[key] ? 'border-red-500/50' : 'border-white/10'}`}
        value={values[key]}
        onChange={set(key)}
        aria-invalid={errors[key] ? true : undefined}
        aria-describedby={errors[key] ? `r-${key}-error` : undefined}
        {...props}
      />
      {errors[key] && (
        <p id={`r-${key}-error`} className="text-red-400 text-xs mt-1.5 font-medium">
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 py-10">
      <div className="bg-[#111a16]/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-black mb-6 text-center text-[#f1e6d0]">Crear cuenta</h1>

        {errors.auth && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm mb-4 text-center font-medium" role="alert">
            {errors.auth}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {field('firstName', 'Nombre', { autoComplete: 'given-name' })}
          {field('lastName', 'Apellidos', { autoComplete: 'family-name' })}
          {field('email', 'Correo Electrónico', { type: 'email', autoComplete: 'email', placeholder: 'tucorreo@ejemplo.com' })}
          {field('password', 'Contraseña', { type: 'password', autoComplete: 'new-password', placeholder: 'Mínimo 8 caracteres, letras y números' })}
          {field('repeat', 'Repite la contraseña', { type: 'password', autoComplete: 'new-password' })}

          <button
            type="submit"
            className="w-full bg-[#f1e6d0] text-[#111a16] font-bold p-3 rounded-lg hover:bg-[#dfd4be] transition duration-200 mt-2 shadow-lg"
          >
            Crear cuenta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#c4b9a3]">
          ¿Ya tienes cuenta?{' '}
          <Link className="font-semibold text-[#f1e6d0] underline underline-offset-4 hover:text-white" to="/login" state={location.state}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
