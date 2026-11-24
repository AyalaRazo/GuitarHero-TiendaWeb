import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/catalog';
import { countByCategory, useProducts } from '../store/products';
import { container, tituloSeccion } from '../ui';
import { ProductArt } from './ProductArt';

/* Tamaños de cartel en la cuadrícula de 12 columnas */
const SIZES = {
  lg: 'col-span-6 row-span-2 min-h-[31rem] max-lg:col-span-12 max-lg:row-auto max-lg:min-h-60',
  md: 'col-span-6 min-h-60 max-lg:col-span-12 max-lg:row-auto',
  sm: 'col-span-3 min-h-60 max-lg:col-span-6 max-sm:col-span-12',
} as const;

const ART_BASE =
  'absolute transition-transform duration-300 ease-in-out [&_svg]:h-full [&_svg]:w-full group-hover/link:scale-[1.03] group-focus-visible/link:scale-[1.03]';
const ART_NORMAL = `${ART_BASE} top-1/2 right-5 h-[78%] w-[46%] -translate-y-1/2 rotate-[8deg] group-hover/link:-translate-y-[52%] group-hover/link:rotate-[4deg] group-focus-visible/link:-translate-y-[52%] group-focus-visible/link:rotate-[4deg] max-sm:w-[42%]`;
/* Piezas anchas (teclado): van arriba y el texto queda libre abajo */
const ART_WIDE = `${ART_BASE} top-6 right-5 h-[42%] w-[62%] rotate-[4deg] group-hover/link:-translate-y-[2%] group-hover/link:rotate-[2deg] group-focus-visible/link:-translate-y-[2%] group-focus-visible/link:rotate-[2deg]`;

export function Pasillos() {
  const products = useProducts();
  return (
    <section className="bg-tweed py-section text-palorosa" id="pasillos" aria-labelledby="pasillos-title">
      <div className={container}>
        <header className="max-w-[34rem]">
          <h2 className={tituloSeccion} id="pasillos-title">
            Recorre los pasillos
          </h2>
          <p className="mt-3 text-lg text-tinta-suave">Todo lo que necesita una banda, ordenado como en la tienda.</p>
        </header>

        <ul className="mt-10 grid grid-cols-12 gap-4">
          {CATEGORIES.map((category) => {
            const wide = category.art === 'keys';
            return (
              <li
                className={`relative overflow-hidden rounded-md bg-palorosa text-hueso after:pointer-events-none after:absolute after:inset-2 after:rounded-[3px] after:border after:border-laton/45 after:content-[''] ${SIZES[category.size]}`}
                key={category.id}
              >
                {/* El marco de latón (::after) imita la placa de un cartel */}
                <Link
                  className="group/link relative flex h-full min-h-[inherit] flex-col justify-end p-6"
                  to={`/productos/${category.id}`}
                >
                  <ProductArt kind={category.art} tone={category.tone} className={wide ? ART_WIDE : ART_NORMAL} />
                  <span className={`relative grid gap-1 ${wide ? 'max-w-full' : 'max-w-[50%] max-sm:max-w-[54%]'}`}>
                    <span
                      className={`font-display leading-[1.1] decoration-laton decoration-2 underline-offset-[0.25em] group-hover/link:underline ${category.size === 'lg' ? 'text-2xl' : 'text-xl'}`}
                    >
                      {category.name}
                    </span>
                    <span className="text-sm leading-[1.4] text-tweed">{category.blurb}</span>
                    <span className="mt-[0.35rem] text-sm font-semibold text-laton-claro">
                      {countByCategory(products, category.id)} {countByCategory(products, category.id) === 1 ? 'modelo' : 'modelos'}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
