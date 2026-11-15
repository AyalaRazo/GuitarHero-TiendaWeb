import { ProductTag } from '../../components/ProductTag';
import { productById } from '../../data/catalog';
import { FAVORITE_IDS } from '../../data/sample';
import { pegboard, tituloSeccion } from '../../ui';

export function Favorites() {
  const products = FAVORITE_IDS.flatMap((id) => {
    const product = productById(id);
    return product ? [product] : [];
  });

  return (
    <>
      <h1 className={tituloSeccion}>Favoritos</h1>
      <p className="mt-2 text-lg text-tinta-suave">Lo que guardaste para decidir con calma.</p>

      <div className={`${pegboard} mt-6 rounded-md p-[clamp(1rem,3vw,2rem)] text-hueso`}>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-x-5 gap-y-8">
          {products.map((product) => (
            <li className="flex *:flex-1" key={product.id}>
              <ProductTag product={product} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
