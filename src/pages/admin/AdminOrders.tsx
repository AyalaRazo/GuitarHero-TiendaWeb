import { formatPrice } from '../../data/catalog';
import { STATUS_STEPS, formatOrderDate, setOrderStatus, useAllOrders } from '../../store/orders';
import type { OrderStatus } from '../../store/orders';
import { useStore } from '../../store/persist';
import { usersStore } from '../../store/users';
import { btn, fieldInput, paper, paperMuted, paperPad, paperTitle, status, tituloSeccion } from '../../ui';
import { Link } from 'react-router-dom';
import { statusTone } from '../account/OrderTracker';
import { AdminTabs } from './AdminTabs';

const STATUSES: OrderStatus[] = [...STATUS_STEPS, 'Cancelado'];
const TH = 'border-b-2 border-palorosa px-4 py-[0.9rem] text-left text-sm font-semibold whitespace-nowrap text-tinta-suave';
const TD = 'border-b border-dashed border-palorosa/35 px-4 py-[0.85rem] align-middle';

/* Pedidos de todos los clientes: el administrador cambia en qué paso va cada uno */
export function AdminOrders() {
  const orders = useAllOrders();
  const users = useStore(usersStore);
  const sorted = [...orders].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <>
      <div>
        <h1 className={tituloSeccion}>Panel administrativo</h1>
        <p className="mt-2 text-lg text-tinta-suave">Cambia el estado de los pedidos y el cliente lo ve en Mis pedidos.</p>
      </div>

      <AdminTabs />

      {sorted.length === 0 ? (
        <div className={`${paperPad} mt-6 grid max-w-[34rem] justify-items-start gap-3`}>
          <h2 className={paperTitle}>Todavía no hay pedidos</h2>
          <p className={paperMuted}>Cuando alguien compre en la tienda, su pedido aparece aquí.</p>
          <Link className={btn('oscuro')} to="/productos">
            Ver la tienda
          </Link>
        </div>
      ) : (
        <div className={`${paper} mt-6 overflow-x-auto`}>
          <table className="w-full border-collapse">
            <caption className="sr-only">Pedidos de la tienda</caption>
            <thead>
              <tr>
                <th className={TH} scope="col">Pedido</th>
                <th className={TH} scope="col">Cliente</th>
                <th className={TH} scope="col">Total</th>
                <th className={TH} scope="col">Estado</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((order) => {
                const customer = users.find((user) => user.id === order.userId);
                return (
                  <tr key={order.id}>
                    <td className={TD}>
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-xs text-tinta-suave">{formatOrderDate(order.createdAt)}</p>
                    </td>
                    <td className={TD}>
                      <p>{customer ? `${customer.firstName} ${customer.lastName}` : order.address.name}</p>
                      <p className="text-xs text-tinta-suave">{customer?.email}</p>
                    </td>
                    <td className={`${TD} font-semibold whitespace-nowrap`}>{formatPrice(order.totals.total)}</td>
                    <td className={TD}>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={status(statusTone(order.status))}>{order.status}</span>
                        <label>
                          <span className="sr-only">Cambiar el estado del pedido {order.id}</span>
                          <select
                            className={`${fieldInput} w-auto py-[0.4rem]`}
                            value={order.status}
                            onChange={(event) => setOrderStatus(order.id, event.target.value as OrderStatus)}
                          >
                            {STATUSES.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
