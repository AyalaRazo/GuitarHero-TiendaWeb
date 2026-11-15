import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { SearchIcon, UserIcon, CartIcon } from './Icons'; 

const ICON_LINK = "flex flex-col items-center gap-1 text-gray-400 hover:text-[#f1e6d0] transition";
const ICON_LABEL = "text-xs font-medium mt-1";

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  const userName = user ? user.split('@')[0] : 'Mi cuenta';

  return (
    <header className="border-b border-white/5 bg-[#0a0f0d]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-6">
        
        <Link to="/" className="text-3xl font-black text-[#f1e6d0] tracking-tighter">
          GUITAR<span className="opacity-70">HERO</span>
        </Link>

        <form className="flex-1 max-w-2xl flex items-center border border-white/10 rounded-lg overflow-hidden bg-black/30 transition-colors focus-within:border-white/30">
          <input 
            type="text" 
            placeholder="Buscar guitarras, accesorios..."
            className="w-full px-4 py-2.5 bg-transparent outline-none text-sm text-[#f1e6d0] placeholder-gray-500"
          />
          <button type="submit" className="px-4 text-gray-400 hover:text-[#f1e6d0]">
            <SearchIcon className="size-[1.3rem]" />
          </button>
        </form>

        <div className="flex gap-6 max-[52rem]:gap-4">
          
          {isAuthenticated ? (
            <>
              <Link className={ICON_LINK} to="/admin/products">
                <UserIcon className="size-6 text-[#f1e6d0]" />
                <span className={ICON_LABEL + " text-[#f1e6d0]"}>{userName}</span>
              </Link>
              
              <button onClick={handleLogout} className={ICON_LINK}>
                <svg className="size-6 text-red-400 hover:text-red-300 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className={ICON_LABEL + " text-red-400 hover:text-red-300 transition"}>Salir</span>
              </button>
            </>
          ) : (
            <Link className={ICON_LINK} to="/login">
              <UserIcon className="size-6" />
              <span className={ICON_LABEL}>Ingresar</span>
            </Link>
          )}

          <Link className={ICON_LINK} to="/cart">
            <CartIcon className="size-6" />
            <span className={ICON_LABEL}>Carrito</span>
          </Link>
          
        </div>
      </div>
    </header>
  );
}