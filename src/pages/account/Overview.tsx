import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { ProductArt } from '../../components/ProductArt';
import { formatPrice } from '../../data/catalog';
import { primaryOf, useAddresses } from '../../store/addresses';
import { useFavoriteIds } from '../../store/favorites';
import { formatOrderDate, useOrders } from '../../store/orders';
import { findProduct, useProducts } from '../../store/products';
import { btn, linkButton, paperMuted, paperPad, paperTitle, status, tituloSeccion } from '../../ui';
import { OrderTracker, statusTone } from './OrderTracker';

const CARD = `${paperPad} mt-6`;
const CARD_HEAD = 'flex flex-wrap items-start justify-between gap-x-4 gap-y-2';
const ADDRESS = 'mt-3 mb-4 block leading-[1.55] not-italic';

export function Overview() {
  const { account: user } = useAuth();
  const orders = useOrders(user?.id);
  const addresses = useAddresses(user?.id);
  const favoriteIds = useFavoriteIds(user?.id);
  const products = useProducts();

  const last = orders[0];
  const address = primaryOf(addresses);
  const favorites = favoriteIds.slice(0, 3).flatMap((id) => {
    const product = findProduct(products, id);
    return product ? [product] : [];
  });

  return (
    <>
      <h1 className={tituloSeccion}>Hola, {user?.firstName}</h1>
      <p className="mt-2 text-lg text-tinta-suave">Aquí ves tus pedidos, tus direcciones y lo que guardaste para después.</p>

      <section className={CARD} aria-labelledby="ultimo-pedido">
        {last ? (
          <>
            <div className={CARD_HEAD}>
              <div>
                <h2 className={paperTitle} id="ultimo-pedido">
                  Tu último pedido
                </h2>
                <p className={paperMuted}>
                  {last.id}, hecho el {formatOrderDate(last.createdAt)}
                </p>
              </div>
              <span className={status(statusTone(last.status))}>{last.status}</span>
            </div>

            <OrderTracker status={last.status} />

            <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-dashed border-palorosa/35 pt-[1.1rem]">
              <p>
                {last.items.map((item) => item.name).join(', ')}. Total <strong>{formatPrice(last.totals.total)}</strong>.
              </p>
              <Link className={btn('oscuro', { sm: true })} to="/cuenta/pedidos">
                Ver mis pedidos
              </Link>
            </div>
          </>
        ) : (
          <div className="grid justify-items-start gap-3">
            <h2 className={paperTitle} id="ultimo-pedido">
              Aún no tienes pedidos
            </h2>
            <p className={paperMuted}>Cuando compres, aquí verás en qué paso va tu pedido.</p>
            <Link className={btn('oscuro', { sm: true })} to="/productos">
              Ir al catálogo
            </Link>
          </div>
        )}
      </section>

      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
        <section className={CARD} aria-labelledby="dir-principal">
          <h2 className={paperTitle} id="dir-principal">
            Dirección principal
          </h2>
          {address ? (
            <address className={ADDRESS}>
              {address.name}
              <br />
              {address.street}
              <br />
              Col. {address.colony}, C. P. {address.zip}
              <br />
              {address.city}, {address.state}
            </address>
          ) : (
            <p className={`${paperMuted} mt-3 mb-4`}>Guarda una dirección para llenar el pago más rápido.</p>
          )}
          <Link className={linkButton} to="/cuenta/direcciones">
            {address ? 'Cambiar dirección' : 'Agregar dirección'}
          </Link>
        </section>

        <section className={CARD} aria-labelledby="favs">
          <h2 className={paperTitle} id="favs">
            Tus favoritos
          </h2>
          {favorites.length > 0 ? (
            <ul className="mt-[0.9rem] mb-4 flex gap-[0.6rem]">
              {favorites.map((product) => (
                <li className="max-w-22 flex-1" key={product.id}>
                  <ProductArt
                    kind={product.art}
                    tone={product.tone}
                    image={product.image}
                    className="grid aspect-square place-items-center rounded-[3px] bg-tweed p-[0.4rem] [&_img]:size-full [&_svg]:size-full"
                  />
                  <span className="sr-only">{product.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`${paperMuted} mt-3 mb-4`}>Toca el corazón de un producto para guardarlo aquí.</p>
          )}
          <Link className={linkButton} to={favorites.length > 0 ? '/cuenta/favoritos' : '/productos'}>
            {favorites.length > 0 ? 'Ver favoritos' : 'Explorar productos'}
          </Link>
        </section>
      </div>
    </>
  );
}
