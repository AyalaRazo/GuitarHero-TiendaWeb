import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { formatPrice } from '../data/catalog';
import { useAllOrders } from '../store/orders';
import type { PaymentMethod } from '../store/orders';
import { btn, container, paperMuted, paperPad, paperTitle, tituloSeccion } from '../ui';

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  tarjeta: 'Tarjeta',
  transferencia: 'Transferencia bancaria',
  deposito: 'Depósito en efectivo',
};

const NEXT_STEPS = [
  { title: 'Lo revisamos en el taller', text: 'Trastes, clavijas, electrónica y altura de las cuerdas.' },
  { title: 'Lo empacamos y lo mandamos', text: 'Te avisamos por correo con la guía de rastreo.' },
  { title: 'Llega a tu puerta', text: 'En 3 a 5 días hábiles con envío estándar.' },
];

export function OrderConfirmed() {
  const { account: user } = useAuth();
  const orders = useAllOrders();
  const orderId = (useLocation().state as { orderId?: string } | null)?.orderId;
  const order = orders.find((item) => item.id === orderId && item.userId === user?.id);

  // Sin un pedido recién hecho no hay nada que confirmar
  if (!order) return <Navigate to="/cuenta/pedidos" replace />;

  const steps = NEXT_STEPS.map((step, i) =>
    i === 2 && order.shippingMethod === 'express' ? { ...step, text: 'En 1 o 2 días hábiles con envío express.' } : step,
  );

  return (
    <section className="bg-pared pt-[clamp(2.5rem,6vw,4.5rem)] pb-section text-hueso" aria-labelledby="gracias-title">
      <div className={container}>
        <div className={`${paperPad} relative mx-auto max-w-184`}>
          <p className="absolute top-6 right-6 rotate-8 rounded-md border-3 border-sunburst-rojo px-[0.9rem] py-[0.35rem] font-display text-[1.1rem] leading-[1.2] text-sunburst-rojo outline-[1.5px] outline-offset-3 outline-sunburst-rojo max-[40rem]:static max-[40rem]:mb-4 max-[40rem]:inline-block max-[40rem]:-rotate-4">
            Pedido recibido
          </p>

          <h1 className={`${tituloSeccion} max-w-[calc(100%-11rem)] max-[40rem]:max-w-none`} id="gracias-title">
            Gracias por tu compra
          </h1>
          <p className="mt-3 max-w-[28rem] text-lg text-tinta-suave">
            Te mandamos la confirmación a <strong>{user?.email}</strong>.
          </p>

          <dl className="mt-7 grid grid-cols-3 gap-4 border-y border-dashed border-palorosa/40 py-[1.1rem] max-[40rem]:grid-cols-1 [&_dd]:font-display [&_dd]:text-xl [&_dd]:leading-[1.2] [&_dt]:text-sm [&_dt]:text-tinta-suave">
            <div>
              <dt>Número de pedido</dt>
              <dd>{order.id}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{formatPrice(order.totals.total)}</dd>
            </div>
            <div>
              <dt>Forma de pago</dt>
              <dd>
                {PAYMENT_LABEL[order.payment]}
                {order.cardLast4 ? ` ···· ${order.cardLast4}` : ''}
              </dd>
            </div>
          </dl>

          {order.reference && (
            <div className="mt-6 rounded-md bg-laton/25 px-4 py-4">
              <p className="font-semibold">
                {order.payment === 'transferencia' ? 'Para pagar por transferencia' : 'Para pagar en efectivo'}
              </p>
              <p className="mt-1">
                Usa la referencia <strong className="font-display text-xl">{order.reference}</strong> por{' '}
                <strong>{formatPrice(order.totals.total)}</strong>.{' '}
                {order.payment === 'transferencia'
                  ? 'Apartamos tu pedido por 24 horas.'
                  : 'Tienes 48 horas para pagarla en un banco o tienda de conveniencia.'}
              </p>
              <p className={`${paperMuted} mt-1 text-sm`}>Esta referencia también queda en Mis pedidos.</p>
            </div>
          )}

          <h2 className={`${paperTitle} mt-8`}>Qué sigue</h2>
          <ol className="mt-5 grid gap-5">
            {steps.map((step, i) => (
              <li className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-3" key={step.title}>
                <span
                  className="grid size-[2.1rem] place-items-center rounded-full bg-laton font-display text-[1.1rem] leading-none"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="text-tinta-suave">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link className={btn('oscuro')} to="/cuenta/pedidos">
              Ver mis pedidos
            </Link>
            <Link className={btn('lineaOscura')} to="/productos">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
