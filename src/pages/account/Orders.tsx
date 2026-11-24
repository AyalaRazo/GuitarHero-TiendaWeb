import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { ProductArt } from '../../components/ProductArt';
import { formatPrice } from '../../data/catalog';
import { addToCart } from '../../store/cart';
import { canCancel, cancelOrder, formatAddressLines, formatOrderDate, useOrders } from '../../store/orders';
import type { Order } from '../../store/orders';
import { findProduct, useProducts } from '../../store/products';
import { btn, chipClaro, linkButton, paperMuted, paperPad, paperTitle, status, tituloSeccion } from '../../ui';
import { OrderTracker, statusTone } from './OrderTracker';

type Filter = 'todos' | 'curso' | 'entregados' | 'cancelados';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'curso', label: 'En curso' },
  { id: 'entregados', label: 'Entregados' },
  { id: 'cancelados', label: 'Cancelados' },
];

const matches = (order: Order, filter: Filter): boolean => {
  if (filter === 'todos') return true;
  if (filter === 'entregados') return order.status === 'Entregado';
  if (filter === 'cancelados') return order.status === 'Cancelado';
  return order.status === 'Recibido' || order.status === 'En taller' || order.status === 'Enviado';
};

const PAYMENT_LABEL = {
  tarjeta: 'Tarjeta',
  transferencia: 'Transferencia bancaria',
  deposito: 'Depósito en efectivo',
} as const;

export function Orders() {
  const { account: user } = useAuth();
  const orders = useOrders(user?.id);
  const products = useProducts();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('todos');
  const [confirming, setConfirming] = useState<string | null>(null);
  const visible = orders.filter((order) => matches(order, filter));

  const buyAgain = (order: Order) => {
    order.items.forEach((item) => {
      if (findProduct(products, item.productId)) addToCart(item.productId, item.qty);
    });
    navigate('/cart');
  };

  return (
    <>
      <h1 className={tituloSeccion}>Mis pedidos</h1>

      {orders.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filtrar pedidos">
          {FILTERS.map((item) => (
            <button
              className={chipClaro}
              type="button"
              aria-pressed={filter === item.id}
              key={item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className={`${paperPad} mt-6 grid max-w-[34rem] justify-items-start gap-3`}>
          <h2 className={paperTitle}>{orders.length === 0 ? 'Todavía no tienes pedidos' : 'No hay pedidos en esta lista'}</h2>
          <p className={paperMuted}>
            {orders.length === 0
              ? 'Cuando compres algo, aquí podrás seguir cada paso: del taller a tu puerta.'
              : 'Prueba con otro filtro para ver el resto de tus pedidos.'}
          </p>
          <Link className={btn('oscuro')} to="/productos">
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <ul className="mt-6 grid gap-6">
          {visible.map((order) => {
            const address = formatAddressLines(order.address);
            return (
              <li className={paperPad} key={order.id}>
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <div>
                    <h2 className={paperTitle}>Pedido {order.id}</h2>
                    <p className={paperMuted}>{formatOrderDate(order.createdAt)}</p>
                  </div>
                  <span className={status(statusTone(order.status))}>{order.status}</span>
                </div>

                <div className="mt-[1.1rem] flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                  <ul className="flex gap-2">
                    {order.items.map((item) => (
                      <li key={item.productId}>
                        <ProductArt
                          kind={item.art}
                          tone={item.tone}
                          image={findProduct(products, item.productId)?.image}
                          className="grid size-15 place-items-center rounded-[3px] bg-tweed p-[0.35rem] [&_img]:size-full [&_svg]:size-full"
                        />
                        <span className="sr-only">
                          {item.name}, cantidad {item.qty}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="font-display text-[1.6rem] leading-none">{formatPrice(order.totals.total)}</p>
                </div>

                <OrderTracker status={order.status} />
                {order.tracking && <p className="mt-4 font-semibold">{order.tracking}</p>}

                {order.reference && order.status === 'Recibido' && (
                  <p className="mt-4 rounded-md bg-laton/25 px-4 py-3">
                    Paga con la referencia <strong>{order.reference}</strong> para que apartemos tu pedido.
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-start justify-between gap-4 border-t border-dashed border-palorosa/35 pt-[1.1rem]">
                  <details className="min-w-56 flex-1">
                    <summary className="w-fit cursor-pointer font-semibold underline decoration-laton decoration-2 underline-offset-[0.25em]">
                      Ver detalle
                    </summary>
                    <ul className="mt-[0.9rem] grid gap-2">
                      {order.items.map((item) => (
                        <li className="flex justify-between gap-4" key={item.productId}>
                          <span>
                            {item.name} <span className={paperMuted}>x {item.qty}</span>
                          </span>
                          <span>{formatPrice(item.price * item.qty)}</span>
                        </li>
                      ))}
                      {order.totals.discount > 0 && (
                        <li className="flex justify-between gap-4">
                          <span>Descuento {order.coupon}</span>
                          <span>-{formatPrice(order.totals.discount)}</span>
                        </li>
                      )}
                      <li className="flex justify-between gap-4">
                        <span>Envío {order.shippingMethod === 'express' ? 'express' : 'estándar'}</span>
                        <span>{order.totals.shipping === 0 ? 'Gratis' : formatPrice(order.totals.shipping)}</span>
                      </li>
                    </ul>
                    <p className={`${paperMuted} mt-[0.9rem] text-sm`}>
                      Pago: {PAYMENT_LABEL[order.payment]}
                      {order.cardLast4 ? ` terminada en ${order.cardLast4}` : ''}. Envío a {order.address.name}, {address.street},{' '}
                      {address.area}, {address.city}.
                    </p>
                  </details>

                  <div className="flex flex-wrap items-center gap-3">
                    {canCancel(order) &&
                      (confirming === order.id ? (
                        <span className="flex flex-wrap items-center gap-3" role="group" aria-label="Confirmar cancelación">
                          <span className="font-semibold">¿Cancelar este pedido?</span>
                          <button
                            className={`${linkButton} text-sunburst-rojo`}
                            type="button"
                            onClick={() => {
                              cancelOrder(order.id);
                              setConfirming(null);
                            }}
                          >
                            Sí, cancelar
                          </button>
                          <button className={linkButton} type="button" onClick={() => setConfirming(null)}>
                            No
                          </button>
                        </span>
                      ) : (
                        <button className={linkButton} type="button" onClick={() => setConfirming(order.id)}>
                          Cancelar pedido
                        </button>
                      ))}
                    <button className={btn('lineaOscura', { sm: true })} type="button" onClick={() => buyAgain(order)}>
                      Volver a comprar
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
