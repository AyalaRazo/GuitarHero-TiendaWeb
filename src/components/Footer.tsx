import { Link } from 'react-router-dom';
import { container } from '../ui';
import { PickIcon } from './Icons';

const FOOTER_LINK = 'hover:text-hueso hover:underline hover:underline-offset-[0.2em]';

const COLUMNS = [
  {
    title: 'Tienda',
    links: [
      { label: 'Guitarras', to: '/productos/guitarras' },
      { label: 'Bajos', to: '/productos/bajos' },
      { label: 'Amplificadores', to: '/productos/amplificadores' },
      { label: 'Teclados', to: '/productos/teclados' },
      { label: 'Batería', to: '/productos/bateria' },
      { label: 'Accesorios', to: '/productos/accesorios' },
    ],
  },
  {
    title: 'Ayuda',
    links: [
      { label: 'Envíos', to: '#' },
      { label: 'Cambios y garantía', to: '#' },
      { label: 'Formas de pago', to: '#' },
      { label: 'Contacto', to: '#' },
    ],
  },
  {
    title: 'Taller',
    links: [
      { label: 'Ajuste y mantenimiento', to: '/#taller' },
      { label: 'Reparaciones', to: '/#taller' },
      { label: 'Recompramos tu equipo', to: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-palorosa pt-[clamp(3rem,6vw,4.5rem)] text-tweed">
      <div
        className={`${container} grid grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] gap-x-8 gap-y-10 max-[52rem]:grid-cols-3 max-sm:grid-cols-2`}
      >
        <div className="max-[52rem]:col-span-full">
          <Link className="inline-flex items-center gap-[0.6rem]" to="/" aria-label="Guitar Hero, ir al inicio">
            <PickIcon className="h-8 w-[1.9rem] text-laton" />
            <span className="font-display text-[1.75rem] leading-none text-hueso">Guitar Hero</span>
          </Link>
          <p className="mt-4 max-w-80 leading-normal">Instrumentos y accesorios elegidos por gente que toca, revisados en nuestro taller.</p>
        </div>

        {COLUMNS.map((column) => (
          <nav aria-label={column.title} key={column.title}>
            <h2 className="mb-[0.9rem] font-display text-lg leading-[1.2] text-hueso">{column.title}</h2>
            <ul className="grid gap-[0.55rem]">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.to === '#' ? (
                    <a className={FOOTER_LINK} href="#">
                      {link.label}
                    </a>
                  ) : (
                    <Link className={FOOTER_LINK} to={link.to}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div
        className={`${container} mt-[clamp(2.5rem,5vw,3.5rem)] flex flex-wrap justify-between gap-x-8 gap-y-2 border-t border-tweed/20 py-6 text-sm`}
      >
        <p>© 2026 Guitar Hero. Todos los derechos reservados.</p>
        <p>Precios en pesos mexicanos con IVA incluido.</p>
      </div>
    </footer>
  );
}
