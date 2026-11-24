import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { ProductTag } from '../../components/ProductTag';
import { useFavoriteIds } from '../../store/favorites';
import { findProduct, useProducts } from '../../store/products';
import { btn, paperMuted, paperPad, paperTitle, pegboard, tituloSeccion } from '../../ui';

export function Favorites() {
  const { account: user } = useAuth();
  const ids = useFavoriteIds(user?.id);
  const catalog = useProducts();
  const products = ids.flatMap((id) => {
    const product = findProduct(catalog, id);
    return product ? [product] : [];
  });

  return (
    <>
      <h1 className={tituloSeccion}>Favoritos</h1>
      <p className="mt-2 text-lg text-tinta-suave">Lo que guardaste para decidirte después.</p>

      {products.length === 0 ? (
        <div className={`${paperPad} mt-6 grid max-w-[34rem] justify-items-start gap-3`}>
          <h2 className={paperTitle}>Todavía no guardas nada</h2>
          <p className={paperMuted}>Toca el corazón de cualquier producto y lo encontrarás aquí.</p>
          <Link className={btn('oscuro')} to="/productos">
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className={`${pegboard} mt-6 rounded-md p-[clamp(1rem,3vw,2rem)] text-hueso`}>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-x-5 gap-y-8">
            {products.map((product) => (
              <li className="flex *:flex-1" key={product.id}>
                <ProductTag product={product} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
