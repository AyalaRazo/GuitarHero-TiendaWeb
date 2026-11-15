import { useState } from 'react';
import { Link, NavLink, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';
import { Filters } from '../components/Filters';
import { ProductTag } from '../components/ProductTag';
import { CATEGORIES, PRODUCTS, categoryById, searchProducts } from '../data/catalog';
import { btn, chip, container, paperMuted, paperPad, paperTitle, pegboard, tituloSeccion } from '../ui';

type SortKey = 'destacados' | 'menor' | 'mayor';

export function Products() {
  const { categoria } = useParams();
  const [params] = useSearchParams();
  const [sort, setSort] = useState<SortKey>('destacados');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const query = (params.get('q') ?? '').trim();
  const category = categoryById(categoria);

  // Un pasillo que no existe vuelve a todo el catálogo
  if (categoria && !category) return <Navigate to="/productos" replace />;

  const inCategory = category ? PRODUCTS.filter((product) => product.category === category.id) : PRODUCTS;
  const found = query ? searchProducts(inCategory, query) : inCategory;
  const results = [...found].sort((a, b) => {
    if (sort === 'menor') return a.price - b.price;
    if (sort === 'mayor') return b.price - a.price;
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  });

  const searchSuffix = query ? `?q=${encodeURIComponent(query)}` : '';
  const title = query ? `Resultados para «${query}»` : (category?.name ?? 'Todo el catálogo');
  const lead = query
    ? category
      ? `Buscando en ${category.name}.`
      : 'Buscando en todo el catálogo.'
    : (category?.blurb ?? 'Guitarras, bajos, amplificadores, teclados, batería y accesorios.');

  const crumbs = [
    { label: 'Inicio', to: '/' },
    { label: 'Productos', to: '/productos' },
    ...(category ? [{ label: category.name }] : []),
  ];

  const count = results.length;

  return (
    <>
      <section className="border-b border-hueso/12 bg-pared pt-7 pb-8 text-hueso" aria-labelledby="listado-title">
        <div className={container}>
          <Breadcrumb items={crumbs} />
          <h1 className={`${tituloSeccion} mt-4`} id="listado-title">
            {title}
          </h1>
          <p className="mt-2 text-lg text-tweed">{lead}</p>

          <nav className="mt-6 flex flex-wrap gap-2" aria-label="Pasillos">
            <NavLink className={chip} to={{ pathname: '/productos', search: searchSuffix }} end>
              Todo
            </NavLink>
            {CATEGORIES.map((item) => (
              <NavLink className={chip} key={item.id} to={{ pathname: `/productos/${item.id}`, search: searchSuffix }}>
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </section>

      <section className={`${pegboard} pt-8 pb-section text-hueso`} aria-label="Resultados">
        <div className={`${container} grid grid-cols-[16.5rem_minmax(0,1fr)] items-start gap-8 max-lg:grid-cols-1 max-lg:gap-4`}>
          <Filters key={category?.id ?? 'todo'} categoryId={category?.id} open={filtersOpen} />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-md bg-pared-hondo px-4 py-3">
              <p className="font-semibold" aria-live="polite">
                {count} {count === 1 ? 'producto' : 'productos'}
              </p>

              <button
                className={`${btn('line', { sm: true })} lg:hidden`}
                type="button"
                aria-expanded={filtersOpen}
                aria-controls="filtros"
                onClick={() => setFiltersOpen((open) => !open)}
              >
                {filtersOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
              </button>

              <div className="flex items-center gap-[0.6rem]">
                <label className="text-sm text-tweed" htmlFor="orden">
                  Ordenar por
                </label>
                <select
                  id="orden"
                  className="rounded-md border-2 border-transparent bg-hueso px-3 py-[0.45rem] font-medium text-palorosa"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortKey)}
                >
                  <option value="destacados">Destacados primero</option>
                  <option value="menor">Menor precio</option>
                  <option value="mayor">Mayor precio</option>
                </select>
              </div>
            </div>

            {query && (
              <p className="mt-4">
                <Link className={`${chip} bg-pared-hondo`} to={category ? `/productos/${category.id}` : '/productos'}>
                  Búsqueda: «{query}»
                  <span aria-hidden="true">✕</span>
                  <span className="sr-only">Quitar búsqueda</span>
                </Link>
              </p>
            )}

            {count > 0 ? (
              <ul className="mt-6 grid grid-cols-3 gap-x-6 gap-y-10 max-[70rem]:grid-cols-2 max-sm:gap-x-[0.9rem] max-sm:gap-y-8">
                {results.map((product) => (
                  <li className="flex *:flex-1" key={product.id}>
                    <ProductTag product={product} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className={`${paperPad} mt-6 grid max-w-[34rem] justify-items-start gap-3`}>
                <h2 className={paperTitle}>No encontramos «{query}»</h2>
                <p className={paperMuted}>
                  Revisa que esté bien escrito o prueba con una palabra más corta, como «cuerdas» o «pedal».
                </p>
                <Link className={btn('oscuro')} to="/productos">
                  Ver todo el catálogo
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
