import { useState } from 'react';
import { Link, NavLink, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';
import { Filters } from '../components/Filters';
import { ProductTag } from '../components/ProductTag';
import { CATEGORIES, categoryById, searchProducts } from '../data/catalog';
import { EMPTY_FILTERS, applyFilters, buildFacets, countActive } from '../lib/filters';
import type { FilterState } from '../lib/filters';
import { useProducts } from '../store/products';
import { btn, chip, container, paperMuted, paperPad, paperTitle, pegboard, tituloSeccion } from '../ui';

type SortKey = 'destacados' | 'menor' | 'mayor';

export function Products() {
  const { categoria } = useParams();
  const [params] = useSearchParams();
  const [sort, setSort] = useState<SortKey>('destacados');
  const [filtersOpen, setFiltersOpen] = useState(false);
  // Los filtros pertenecen a un pasillo: al cambiar de pasillo empiezan limpios
  const [filterBox, setFilterBox] = useState<{ scope: string; state: FilterState }>({ scope: '', state: EMPTY_FILTERS });
  const products = useProducts();

  const query = (params.get('q') ?? '').trim();
  const category = categoryById(categoria);

  // Un pasillo que no existe vuelve a todo el catálogo
  if (categoria && !category) return <Navigate to="/productos" replace />;

  const scope = category?.id ?? 'todo';
  const filters = filterBox.scope === scope ? filterBox.state : EMPTY_FILTERS;
  const inCategory = category ? products.filter((product) => product.category === category.id) : products;
  const found = query ? searchProducts(inCategory, query) : inCategory;
  const facets = buildFacets(found);
  const filtered = applyFilters(found, filters);
  const results = [...filtered].sort((a, b) => {
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
          <Filters
            facets={facets}
            state={filters}
            onChange={(state) => setFilterBox({ scope, state })}
            open={filtersOpen}
          />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-md bg-pared-hondo px-4 py-3">
              <p className="font-semibold" aria-live="polite">
                {count} {count === 1 ? 'producto' : 'productos'}
                {countActive(filters) > 0 && <span className="font-normal text-tweed"> con filtros</span>}
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
                {found.length > 0 ? (
                  <>
                    <h2 className={paperTitle}>Ningún producto cumple esos filtros</h2>
                    <p className={paperMuted}>Quita alguno para ver más opciones.</p>
                    <button className={btn('oscuro')} type="button" onClick={() => setFilterBox({ scope, state: EMPTY_FILTERS })}>
                      Limpiar filtros
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className={paperTitle}>{query ? `No encontramos «${query}»` : 'Este pasillo está vacío'}</h2>
                    <p className={paperMuted}>
                      {query
                        ? 'Revisa que esté bien escrito o prueba con una palabra más corta, como «cuerdas» o «pedal».'
                        : 'Todavía no hay productos aquí. Mira el resto del catálogo.'}
                    </p>
                    <Link className={btn('oscuro')} to="/productos">
                      Ver todo el catálogo
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
