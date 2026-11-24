import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductArt } from '../../components/ProductArt';
import { formatPrice, productById } from '../../data/catalog';
import { useAuth } from '../../auth/AuthContext';
import { ADDRESSES, FAVORITE_IDS, ORDERS, orderLines, orderTotal } from '../../data/sample';
import type { Order } from '../../data/sample';
import { btn, linkButton, paperMuted, paperPad, paperTitle, status, tituloSeccion } from '../../ui';
import { OrderTracker, statusTone } from './OrderTracker';

type OrderStatus = 'Recibido' | 'En taller' | 'Enviado' | 'Entregado';

const ORDER_STEPS: OrderStatus[] = ['Recibido', 'En taller', 'Enviado', 'Entregado'];
const STORAGE_OVERRIDES_KEY = 'guitar_hero_order_status_overrides';

const CARD = `${paperPad} mt-6`;
const CARD_HEAD = 'flex flex-wrap items-start justify-between gap-x-4 gap-y-2';
const ADDRESS = 'mt-3 mb-4 block leading-[1.55] not-italic';

const getSavedStatusForOrder = (orderId: string, fallbackStatus: Order['status']): Order['status'] => {
  try {
    const raw = localStorage.getItem(STORAGE_OVERRIDES_KEY);
    if (!raw) return fallbackStatus;
    const overrides = JSON.parse(raw);
    return overrides[orderId] || fallbackStatus;
  } catch {
    return fallbackStatus;
  }
};

const getLatestOrderForUser = (email?: string): Order => {
  const accountKey = `guitar_hero_orders_${email || 'invitado'}`;

  try {
    const accountRaw = localStorage.getItem(accountKey);
    if (accountRaw) {
      const parsed = JSON.parse(accountRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0] as Order;
      }
    }

    const latestRaw = localStorage.getItem('latest_order');
    if (latestRaw) {
      const parsedLatest = JSON.parse(latestRaw);
      if (parsedLatest && parsedLatest.id) {
        return {
          id: parsedLatest.id,
          date: parsedLatest.date,
          status: parsedLatest.status || 'Recibido',
          items: Array.isArray(parsedLatest.items)
            ? parsedLatest.items.map((i: any) => ({
                productId: i.product?.id || i.productId || 'p-custom',
                qty: i.qty,
                ...(i.product ? { product: i.product } : {}),
              }))
            : [],
          shipping: parsedLatest.shipping ?? 0,
        };
      }
    }
  } catch (e) {
    console.error('Error leyendo el último pedido en Resumen', e);
  }

  return ORDERS[0];
};

export function Overview() {
  const { user } = useAuth();
  const last = getLatestOrderForUser(user?.email);
  const [currentStatus, setCurrentStatus] = useState<Order['status']>(() =>
    getSavedStatusForOrder(last.id, last.status)
  );

  useEffect(() => {
    setCurrentStatus(getSavedStatusForOrder(last.id, last.status));
  }, [last.id, last.status]);

  const handleAdvanceStatus = () => {
    const idx = ORDER_STEPS.indexOf(currentStatus as OrderStatus);
    if (idx === -1 || idx >= ORDER_STEPS.length - 1) return;
    const nextStatus = ORDER_STEPS[idx + 1];
    setCurrentStatus(nextStatus);

    try {
      const raw = localStorage.getItem(STORAGE_OVERRIDES_KEY);
      const prev = raw ? JSON.parse(raw) : {};
      localStorage.setItem(
        STORAGE_OVERRIDES_KEY,
        JSON.stringify({ ...prev, [last.id]: nextStatus })
      );
    } catch (e) {
      console.error('Error guardando estado desde Resumen', e);
    }
  };

  const canAdvance =
    currentStatus === 'Recibido' ||
    currentStatus === 'En taller' ||
    currentStatus === 'Enviado';

  const lines = orderLines(last);
  const address = ADDRESSES.find((a) => a.primary) ?? ADDRESSES[0];
  const favorites = FAVORITE_IDS.slice(0, 3).flatMap((id) => {
    const product = productById(id);
    return product ? [product] : [];
  });

  const summaryItems = lines.length
    ? lines.map((l) => l.product.name).join(', ')
    : 'Compra reciente';

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
          <span className={status(statusTone(currentStatus))}>{currentStatus}</span>
        </div>

        <OrderTracker status={currentStatus} />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-dashed border-palorosa/35 pt-[1.1rem]">
          <p>
            {summaryItems}. Total <strong>{formatPrice(orderTotal(last))}</strong>.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {canAdvance && (
              <button
                className={btn('lineaOscura', { sm: true })}
                type="button"
                onClick={handleAdvanceStatus}
              >
                Avanzar estado
              </button>
            )}
            <Link className={btn('oscuro', { sm: true })} to="/cuenta/pedidos">
              Ver mis pedidos
            </Link>
          </div>
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