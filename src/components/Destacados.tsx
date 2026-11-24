import { Link } from 'react-router-dom';
import { useProducts } from '../store/products';
import { container, pegboard, tituloSeccion } from '../ui';
import { ProductTag } from './ProductTag';

export function Destacados() {
  const featured = useProducts().filter((product) => product.featured);

  return (
    <section className={`${pegboard} py-section text-hueso`} id="destacados" aria-labelledby="destacados-title">
      <div className={container}>
        <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-[36rem]">
            <h2 className={tituloSeccion} id="destacados-title">
              Colgado en la pared esta semana
            </h2>
            <p className="mt-3 text-lg text-tweed">Las piezas más destacadas de la semana.</p>
          </div>
          <Link
            className="border-b-2 border-laton pb-[0.2rem] font-semibold transition-colors duration-200 hover:text-laton-claro"
            to="/productos"
          >
            Ver todo el catálogo
          </Link>
        </header>

        {/* Todas las etiquetas de una fila miden lo mismo */}
        {featured.length === 0 ? (
          <p className="mt-10 max-w-[34rem] text-lg text-tweed">
            Todavía no hay piezas destacadas. Se eligen desde el panel administrativo.
          </p>
        ) : (
        <ul className="mt-10 grid grid-cols-4 gap-x-6 gap-y-10 max-xl:grid-cols-3 max-[48rem]:grid-cols-2 max-[48rem]:gap-x-[0.9rem] max-[48rem]:gap-y-8">
          {featured.map((product) => (
            <li className="flex [&>*]:flex-1" key={product.id}>
              <ProductTag product={product} />
            </li>
          ))}
        </ul>
        )}
      </div>
    </section>
  );
}
