import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';
import { FavoriteButton } from '../components/FavoriteButton';
import { ProductArt } from '../components/ProductArt';
import { ProductTag } from '../components/ProductTag';
import { ART_LABEL, TONE_LABEL, categoryById, formatPrice } from '../data/catalog';
import { FREE_SHIPPING_FROM, MAX_QTY, addToCart } from '../store/cart';
import { findProduct, useProducts } from '../store/products';
import { btn, container, paperMuted, paperPad, paperTitle, pegboard, tituloSeccion } from '../ui';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const products = useProducts();
  const product = findProduct(products, id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <section className="bg-pared pt-8 pb-section text-hueso">
        <div className={container}>
          <h1 className={tituloSeccion}>No encontramos ese producto</h1>
          <div className={`${paperPad} mt-8 grid max-w-[34rem] justify-items-start gap-3`}>
            <p className={paperMuted}>Puede que ya no esté a la venta o que el enlace esté mal escrito.</p>
            <Link className={btn('oscuro')} to="/productos">
              Ver el catálogo
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const category = categoryById(product.category);
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const saving = product.oldPrice ? product.oldPrice - product.price : 0;

  const handleAdd = () => {
    addToCart(product.id, qty);
    setAdded(true);
  };

  return (
    <>
      <section className="bg-pared pt-7 pb-[clamp(2.5rem,6vw,4rem)] text-hueso" aria-labelledby="producto-title">
        <div className={container}>
          <Breadcrumb
            items={[
              { label: 'Inicio', to: '/' },
              { label: 'Productos', to: '/productos' },
              ...(category ? [{ label: category.name, to: `/productos/${category.id}` }] : []),
              { label: product.name },
            ]}
          />

          <div className="mt-8 grid grid-cols-2 items-start gap-[clamp(2rem,5vw,4rem)] max-lg:grid-cols-1">
            <div className="relative grid min-h-[26rem] place-items-center rounded-md bg-hueso p-8 shadow-papel max-sm:min-h-72">
              {product.badge && (
                <span className="absolute top-4 right-4 grid size-[4.2rem] rotate-[10deg] place-items-center rounded-full bg-sunburst-rojo p-1 text-center font-display text-sm leading-none text-hueso">
                  {product.badge}
                </span>
              )}
              <ProductArt
                kind={product.art}
                tone={product.tone}
                image={product.image}
                className="grid h-[22rem] w-full place-items-center max-sm:h-60 [&_img]:max-h-full [&_img]:max-w-full [&_svg]:h-full [&_svg]:w-auto"
              />
            </div>

            <div className="grid gap-5">
              <div>
                <h1 className={tituloSeccion} id="producto-title">
                  {product.name}
                </h1>
                <p className="mt-3 text-lg text-tweed">{product.detail}</p>
              </div>

              <p className="grid">
                {product.oldPrice && (
                  <span className="text-tweed line-through">
                    <span className="sr-only">Antes </span>
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
                <span className="font-display text-[2.6rem] leading-[1.1]">{formatPrice(product.price)}</span>
                {saving > 0 && <span className="font-semibold text-laton-claro">Ahorras {formatPrice(saving)}</span>}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center rounded-md border-2 border-hueso/45" role="group" aria-label="Cantidad">
                  <button
                    className="grid size-11 place-items-center text-xl leading-none hover:bg-hueso/10 disabled:opacity-40"
                    type="button"
                    aria-label="Quitar una unidad"
                    disabled={qty <= 1}
                    onClick={() => setQty((current) => Math.max(1, current - 1))}
                  >
                    −
                  </button>
                  <span className="min-w-10 text-center font-bold" aria-live="polite">
                    {qty}
                  </span>
                  <button
                    className="grid size-11 place-items-center text-xl leading-none hover:bg-hueso/10 disabled:opacity-40"
                    type="button"
                    aria-label="Agregar una unidad"
                    disabled={qty >= MAX_QTY}
                    onClick={() => setQty((current) => Math.min(MAX_QTY, current + 1))}
                  >
                    +
                  </button>
                </div>
                <button className={btn('laton')} type="button" onClick={handleAdd}>
                  Agregar al carrito
                </button>
                <button className={btn('line')} type="button" onClick={() => {
                  addToCart(product.id, qty);
                  navigate('/cart');
                }}>
                  Comprar ahora
                </button>
                <FavoriteButton productId={product.id} productName={product.name} />
              </div>

              <p className="min-h-6 font-semibold text-laton-claro" role="status">
                {added && (
                  <>
                    Agregaste {qty} al carrito.{' '}
                    <Link className="underline underline-offset-[0.2em]" to="/cart">
                      Ver carrito
                    </Link>
                  </>
                )}
              </p>

              <div className={`${paperPad} text-palorosa`}>
                <h2 className={paperTitle}>Ficha del producto</h2>
                <dl className="mt-4 grid gap-3">
                <div className="flex justify-between gap-4 border-b border-dashed border-palorosa/35 pb-2">
                  <dt className={paperMuted}>Pasillo</dt>
                  <dd className="font-semibold">{category?.name}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-dashed border-palorosa/35 pb-2">
                  <dt className={paperMuted}>Tipo</dt>
                  <dd className="font-semibold">{ART_LABEL[product.art]}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-dashed border-palorosa/35 pb-2">
                  <dt className={paperMuted}>Acabado</dt>
                  <dd className="font-semibold">{TONE_LABEL[product.tone]}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className={paperMuted}>Envío</dt>
                  <dd className="text-right font-semibold">
                    {product.price >= FREE_SHIPPING_FROM ? 'Gratis' : `Gratis desde ${formatPrice(FREE_SHIPPING_FROM)} de compra`}
                  </dd>
                </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className={`${pegboard} py-section text-hueso`} aria-labelledby="relacionados-title">
          <div className={container}>
            <h2 className={tituloSeccion} id="relacionados-title">
              Más de {category?.name.toLowerCase()}
            </h2>
            <ul className="mt-10 grid grid-cols-4 gap-x-6 gap-y-10 max-xl:grid-cols-3 max-[48rem]:grid-cols-2 max-[48rem]:gap-x-[0.9rem] max-[48rem]:gap-y-8">
              {related.map((item) => (
                <li className="flex *:flex-1" key={item.id}>
                  <ProductTag product={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
