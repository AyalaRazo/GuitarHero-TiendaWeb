import { Link } from 'react-router-dom';
import { ProductArt } from '../../components/ProductArt';
import { formatPrice, productById } from '../../data/catalog';
import { useAuth } from '../../auth/AuthContext';
import { ADDRESSES, FAVORITE_IDS, ORDERS, orderLines, orderTotal } from '../../data/sample';
import { btn, linkButton, paperMuted, paperPad, paperTitle, status, tituloSeccion } from '../../ui';
import { OrderTracker, statusTone } from './OrderTracker';

const CARD = `${paperPad} mt-6`;
const CARD_HEAD = 'flex flex-wrap items-start justify-between gap-x-4 gap-y-2';
const ADDRESS = 'mt-3 mb-4 block leading-[1.55] not-italic';

export function Overview() {
  const { user } = useAuth();
  const last = ORDERS[0];
  const lines = orderLines(last);
  const address = ADDRESSES.find((a) => a.primary) ?? ADDRESSES[0];
  const favorites = FAVORITE_IDS.slice(0, 3).flatMap((id) => {
    const product = productById(id);
    return product ? [product] : [];
  });

  return (
    <>
      <h1 className={tituloSeccion}>Hola, {user?.firstName}</h1>
      <p className="mt-2 text-lg text-tinta-suave">Aquí ves tus pedidos, tus direcciones y lo que guardaste para después.</p>

      <section className={CARD} aria-labelledby="ultimo-pedido">
        <div className={CARD_HEAD}>
          <div>
            <h2 className={paperTitle} id="ultimo-pedido">
              Tu último pedido
            </h2>
            <p className={paperMuted}>
              {last.id}, hecho el {last.date}
            </p>
          </div>
          <span className={status(statusTone(last.status))}>{last.status}</span>
        </div>

        <OrderTracker status={last.status} />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-dashed border-palorosa/35 pt-[1.1rem]">
          <p>
            {lines.map((l) => l.product.name).join(', ')}. Total <strong>{formatPrice(orderTotal(last))}</strong>.
          </p>
          <Link className={btn('oscuro', { sm: true })} to="/cuenta/pedidos">
            Ver mis pedidos
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
        <section className={CARD} aria-labelledby="dir-principal">
          <h2 className={paperTitle} id="dir-principal">
            Dirección principal
          </h2>
          <address className={ADDRESS}>
            {address.name}
            <br />
            {address.street}
            <br />
            {address.area}
            <br />
            {address.city}
          </address>
          <Link className={linkButton} to="/cuenta/direcciones">
            Cambiar dirección
          </Link>
        </section>

        <section className={CARD} aria-labelledby="favs">
          <h2 className={paperTitle} id="favs">
            Tus favoritos
          </h2>
          <ul className="mt-[0.9rem] mb-4 flex gap-[0.6rem]">
            {favorites.map((product) => (
              <li className="max-w-22 flex-1" key={product.id}>
                <ProductArt kind={product.art} tone={product.tone} className="grid aspect-square place-items-center rounded-[3px] bg-tweed p-[0.4rem] [&_svg]:size-full" />
                <span className="sr-only">{product.name}</span>
              </li>
            ))}
          </ul>
          <Link className={linkButton} to="/cuenta/favoritos">
            Ver favoritos
          </Link>
        </section>
      </div>
    </>
  );
}
