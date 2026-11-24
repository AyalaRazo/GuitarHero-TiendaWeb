import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, verifyCredentials } from '../auth/AuthContext';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; auth?: string }>({});
  
  const { login } = useAuth();
  const navigate = useNavigate();

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
    if (verifyCredentials(email, password)) {
      login(email);
      navigate('/cuenta/admin');
    } else {
      setErrors({ auth: 'Credenciales incorrectas o usuario no autorizado' });
    }
  }
};

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="bg-[#111a16]/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        
        <h2 className="text-3xl font-black mb-6 text-center text-[#f1e6d0]">Iniciar Sesión</h2>
        
        {errors.auth && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm mb-4 text-center font-medium">
            {errors.auth}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#c4b9a3] mb-1">Correo Electrónico</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`block w-full rounded-lg shadow-sm p-3 bg-black/40 text-[#f1e6d0] border focus:ring-[#f1e6d0] focus:border-[#f1e6d0] outline-none transition ${errors.email ? 'border-red-500/50' : 'border-white/10'}`}
              placeholder="ejemplo@uabc.edu.mx"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#c4b9a3] mb-1">Contraseña</label>
            <input 
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
            Entrar al Panel
          </button>
        </form>
      </div>
    </div>
  );
}