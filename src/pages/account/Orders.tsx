import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductArt } from '../../components/ProductArt';
import { formatPrice } from '../../data/catalog';
import { ADDRESSES, ORDERS } from '../../data/sample';
import type { Order } from '../../data/sample';
import { btn, chipClaro, paperMuted, paperPad, paperTitle, status, tituloSeccion } from '../../ui';
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

export function Orders() {
  const [filter, setFilter] = useState<Filter>('todos');
  const address = ADDRESSES.find((a) => a.primary) ?? ADDRESSES[0];

  // Obtenemos los pedidos combinando los de ejemplo y el último pedido realizado por cualquier cuenta
  const allOrders = (() => {
    const list = [...ORDERS];
    try {
      const latest = localStorage.getItem('latest_order');
      if (latest) {
        const parsedOrder = JSON.parse(latest);
        // Evitamos duplicados si el ID ya existe en la lista
        if (!list.some((o) => o.id === parsedOrder.id)) {
          const customOrder: Order = {
            id: parsedOrder.id,
            date: parsedOrder.date,
            status: parsedOrder.status || 'Recibido',
            items: parsedOrder.items.map((i: any) => ({
              productId: i.product?.id || i.productId || 'p-custom',
              qty: i.qty,
              ...(i.product ? { product: i.product } : {}),
            })),
            shipping: parsedOrder.shipping ?? 0,
          };
          list.unshift(customOrder);
        }
      }
    } catch (e) {
      console.error('Error leyendo pedido del almacenamiento', e);
    }
    return list;
  })();

  const visible = allOrders.filter((order) => matches(order, filter));

  return (
    <>
      <h1 className={tituloSeccion}>Mis pedidos</h1>

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

      {visible.length === 0 ? (
        <div className={`${paperPad} mt-6 grid max-w-[34rem] justify-items-start gap-3`}>
          <h2 className={paperTitle}>No hay pedidos en esta lista</h2>
          <p className={paperMuted}>Cuando hagas una compra, aparece aquí con su avance.</p>
          <Link className={btn('oscuro')} to="/productos">
            Ver el catálogo
          </Link>
        </div>
      ) : (
        <ul className="mt-6 grid gap-6">
          {visible.map((order) => {
            const lines = order.items.map((item: any) => {
              if (item.product) return item;
              return {
                product: {
                  id: item.productId || Math.random(),
                  name: item.name || 'Instrumento / Producto',
                  price: item.price || 0,
                  art: item.art || 'electric',
                  tone: item.tone || 'sunburst',
                },
                qty: item.qty,
              };
            });

            const computedTotal =
              lines.reduce((sum: number, i: any) => sum + i.product.price * i.qty, 0) +
              (order.shipping || 0);

            return (
              <li className={paperPad} key={order.id}>
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <div>
                    <h2 className={paperTitle}>Pedido {order.id}</h2>
                    <p className={paperMuted}>{order.date}</p>
                  </div>
                  <span className={status(statusTone(order.status))}>{order.status}</span>
                </div>

                <div className="mt-[1.1rem] flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                  <ul className="flex gap-2">
                    {lines.map(({ product }: any, idx: number) => (
                      <li key={product.id || idx}>
                        <ProductArt
                          kind={product.art}
                          tone={product.tone}
                          className="grid size-15 place-items-center rounded-[3px] bg-tweed p-[0.35rem] [&_svg]:size-full"
                        />
                        <span className="sr-only">{product.name}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="font-display text-[1.6rem] leading-none">{formatPrice(computedTotal)}</p>
                </div>

                <OrderTracker status={order.status} />
                {order.tracking && <p className="mt-4 font-semibold">{order.tracking}</p>}

                <div className="mt-6 flex flex-wrap items-start justify-between gap-4 border-t border-dashed border-palorosa/35 pt-[1.1rem]">
                  <details className="min-w-56 flex-1">
                    <summary className="w-fit cursor-pointer font-semibold underline decoration-laton decoration-2 underline-offset-[0.25em]">
                      Ver detalle
                    </summary>
                    <ul className="mt-[0.9rem] grid gap-2">
                      {lines.map(({ product, qty }: any, idx: number) => (
                        <li className="flex justify-between gap-4" key={product.id || idx}>
                          <span>
                            {product.name} <span className={paperMuted}>x {qty}</span>
                          </span>
                          <span>{formatPrice(product.price * qty)}</span>
                        </li>
                      ))}
                      <li className="flex justify-between gap-4">
                        <span>Envío</span>
                        <span>{order.shipping === 0 ? 'Gratis' : formatPrice(order.shipping)}</span>
                      </li>
                    </ul>
                    <p className={`${paperMuted} mt-[0.9rem] text-sm`}>
                      Entrega en {address.street}, {address.area}, {address.city}.
                    </p>
                  </details>
                  <Link className={btn('lineaOscura', { sm: true })} to="/carrito">
                    Volver a comprar
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}