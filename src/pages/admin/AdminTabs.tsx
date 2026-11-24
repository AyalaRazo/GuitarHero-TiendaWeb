import { NavLink } from 'react-router-dom';

const TAB =
  'rounded-t-[4px] border-b-[3px] px-4 py-[0.6rem] font-semibold transition-colors duration-200 aria-[current=page]:border-palorosa aria-[current=page]:text-palorosa border-transparent text-tinta-suave hover:text-palorosa';

/* Las dos secciones del panel: el catálogo (CRUD) y los pedidos */
export function AdminTabs() {
  return (
    <nav className="mt-6 flex gap-1 border-b border-palorosa/25" aria-label="Secciones del panel">
      <NavLink className={TAB} to="/cuenta/admin" end>
        Productos
      </NavLink>
      <NavLink className={TAB} to="/cuenta/admin/pedidos">
        Pedidos
      </NavLink>
    </nav>
  );
}
