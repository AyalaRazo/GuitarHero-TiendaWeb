import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { container, tituloSeccion } from '../ui';
import { ProductTag } from './ProductTag';

const PEGBOARD =
  'bg-pared-hondo bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.55)_0_3px,transparent_3.5px)] bg-[size:30px_30px]';

export function Destacados() {
  const { products } = useProducts();
  const featured = products.filter((product) => product.featured);

  return (
    <section className={`${PEGBOARD} py-section text-hueso`} id="destacados" aria-labelledby="destacados-title">
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

        <ul className="mt-10 grid grid-cols-4 gap-x-6 gap-y-10 max-xl:grid-cols-3 max-[48rem]:grid-cols-2 max-[48rem]:gap-x-[0.9rem] max-[48rem]:gap-y-8">
          {featured.map((product) => (
            <li className="flex [&>*]:flex-1" key={product.id}>
              <ProductTag product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}