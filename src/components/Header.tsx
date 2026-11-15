import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { NAV_LINKS } from '../data/catalog';
import { CART_LINES, cartUnits } from '../data/sample';
import { container } from '../ui';
import { CartIcon, PickIcon, SearchIcon, UserIcon } from './Icons';

const ICON_LINK = 'relative inline-flex items-center gap-2 font-medium transition-colors duration-200 hover:text-laton-claro';
const ICON_LABEL = 'max-[52rem]:sr-only';

export function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const urlQuery = params.get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);
  const units = cartUnits(CART_LINES);
  const { user } = useAuth();

  // Si cambia la búsqueda de la dirección (por ejemplo al quitarla), el campo la sigue
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  // Buscar siempre lleva a todo el catálogo con la búsqueda aplicada
  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/productos?q=${encodeURIComponent(trimmed)}` : '/productos');
  };

  return (
    <>
      <div className="bg-pared-hondo text-xs text-tweed">
        <div className={`${container} flex justify-between gap-4 py-2`}>
          <p>Atención por chat de lunes a sábado, de 10:00 a 19:00</p>
          <nav className="flex gap-5 max-[52rem]:hidden" aria-label="Pedidos y ayuda">
            <Link className="hover:text-hueso" to="/cuenta/pedidos">
              Mis pedidos
            </Link>
            <a className="hover:text-hueso" href="#">
              Ayuda
            </a>
          </nav>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-hueso/14 bg-pared">
        <div
          className={`${container} grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-[clamp(1rem,3vw,2.5rem)] py-4 max-[52rem]:grid-cols-[1fr_auto] max-[52rem]:gap-x-4 max-[52rem]:gap-y-3 max-[52rem]:py-3`}
        >
          <Link className="inline-flex items-center gap-[0.6rem]" to="/" aria-label="Guitar Hero, ir al inicio">
            <PickIcon className="h-8 w-[1.9rem] text-laton" />
            <span className="font-display text-[1.75rem] leading-none tracking-[-0.01em] text-hueso">Guitar Hero</span>
          </Link>

          <form
            className="flex w-full max-w-[34rem] justify-self-center max-[52rem]:order-last max-[52rem]:col-span-full max-[52rem]:max-w-none"
            role="search" 
            onSubmit={handleSearch}
          >
            <label className="sr-only" htmlFor="buscar">
              Buscar en la tienda
            </label>
            <input
              id="buscar"
              className="min-w-0 flex-1 rounded-l-md border-2 border-transparent bg-hueso px-4 py-[0.7rem] text-palorosa placeholder:text-tinta-suave"
              type="search"
              placeholder="Busca guitarras, cuerdas, pedales"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button
              className="grid w-12 place-items-center rounded-r-md bg-laton text-palorosa transition-colors duration-200 hover:bg-laton-claro"
              type="submit"
              aria-label="Buscar"
            >
              <SearchIcon className="size-[1.3rem]" />
            </button>
          </form>

          <div className="flex gap-6 max-[52rem]:gap-4">
            <Link className={ICON_LINK} to="/cuenta">
              <UserIcon className="size-6" />
              <span className={ICON_LABEL}>{user ? user.firstName : 'Mi cuenta'}</span>
            </Link>
            <Link className={ICON_LINK} to="/carrito">
              <CartIcon className="size-6" />
              <span className={ICON_LABEL}>Carrito</span>
              <span className="grid h-[1.4rem] min-w-[1.4rem] place-items-center rounded-full bg-sunburst-rojo px-[0.3rem] text-xs leading-none font-bold text-hueso">
                {units}
                <span className="sr-only"> artículos</span>
              </span>
            </Link>
          </div>
        </div>

        <nav className="border-t border-hueso/10" aria-label="Categorías">
          <ul className={`${container} flex gap-[clamp(1.1rem,2.5vw,2rem)] overflow-x-auto py-[0.7rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
            {NAV_LINKS.map((link) => {
              const active = pathname === link.to;
              return (
                <li key={link.label}>
                  <Link
                    className={[
                      'block border-b-2 py-[0.15rem] font-medium whitespace-nowrap transition-colors duration-200 hover:border-laton hover:text-hueso',
                      link.featured && !active ? 'text-laton-claro' : '',
                      active ? 'border-laton text-hueso' : 'border-transparent text-tweed',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    to={link.to}
                    aria-current={active ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
    </>
  );
}
