import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { initialsOf, useAuth } from '../../auth/AuthContext';
import { container } from '../../ui';

const LINK =
  'block rounded-r-[4px] border-l-[3px] px-3 py-[0.6rem] font-medium transition-colors duration-200 max-lg:rounded-t-[4px] max-lg:rounded-r-none max-lg:border-b-[3px] max-lg:border-l-0 max-lg:whitespace-nowrap';
const LINK_IDLE = 'border-transparent text-tweed hover:bg-hueso/8 hover:text-hueso';
const LINK_ACTIVE = 'border-laton bg-hueso/12 text-hueso';
/* El enlace del panel administrativo va en latón, separado del resto */
const ADMIN_LINK = 'font-semibold! [&:not([aria-current=page])]:text-laton-claro [&:not([aria-current=page])]:hover:text-hueso';

const LINKS = [
  { to: '/cuenta', label: 'Resumen', end: true },
  { to: '/cuenta/pedidos', label: 'Mis pedidos', end: false },
  { to: '/cuenta/direcciones', label: 'Direcciones', end: false },
  { to: '/cuenta/favoritos', label: 'Favoritos', end: false },
  { to: '/cuenta/datos', label: 'Mis datos', end: false },
];

export function AccountLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [LINK, isActive ? LINK_ACTIVE : LINK_IDLE].join(' ');

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <section className="bg-tweed pt-[clamp(2rem,5vw,3.5rem)] pb-section text-palorosa">
      <div className={`${container} grid grid-cols-[16rem_minmax(0,1fr)] items-start gap-[clamp(1.5rem,4vw,3rem)] max-lg:grid-cols-1`}>
        <aside className="sticky top-36 rounded-md bg-palorosa p-5 text-hueso max-lg:static">
          <div className="flex items-center gap-[0.8rem] border-b border-laton/40 pb-[1.1rem]">
            <span
              className="grid size-[2.9rem] flex-none place-items-center rounded-full bg-laton font-display text-[1.2rem] leading-none text-palorosa"
              aria-hidden="true"
            >
              {initialsOf(user)}
            </span>
            <div className="min-w-0">
              <p className="leading-tight font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs [overflow-wrap:anywhere] text-tweed">{user.email}</p>
            </div>
          </div>

          <nav aria-label="Mi cuenta">
            <ul className="mt-4 grid gap-[0.2rem] max-lg:flex max-lg:gap-1 max-lg:overflow-x-auto max-lg:[scrollbar-width:none]">
              {LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink className={linkClass} to={link.to} end={link.end}>
                    {link.label}
                  </NavLink>
                </li>
              ))}

              {user.role === 'admin' && (
                <li className="mt-2 border-t border-laton/40 pt-3 max-lg:mt-0 max-lg:flex-none max-lg:border-t-0 max-lg:border-l max-lg:border-laton/40 max-lg:pt-0 max-lg:pl-2">
                  <NavLink className={(state) => `${linkClass(state)} ${ADMIN_LINK}`} to="/cuenta/admin">
                    Panel administrativo
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>

          <button
            className="mt-4 border-0 bg-transparent px-3 py-[0.6rem] font-medium text-tweed underline underline-offset-[0.25em] hover:text-hueso"
            type="button" onClick={handleSignOut}>
            Cerrar sesión
          </button>
        </aside>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
