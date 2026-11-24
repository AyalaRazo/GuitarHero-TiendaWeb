import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { formatPrice } from '../data/catalog';
import { shippingCost } from '../data/sample';
import { btn, container, paperPad, paperTitle, tituloSeccion } from '../ui';
import { generateReceiptPDF } from '../utils/generatePDF';

const NEXT_STEPS = [
  { title: 'Lo revisamos en el taller', text: 'Trastes, clavijas, electrónica y altura de las cuerdas.' },
  { title: 'Lo empacamos y lo mandamos', text: 'Te avisamos por correo con la guía de rastreo.' },
  { title: 'Llega a tu puerta', text: 'En 3 a 5 días hábiles con envío estándar.' },
];

export function OrderConfirmed() {
  const { user } = useAuth();
  const downloadedRef = useRef(false);

  const order = useMemo(() => {
    try {
      const latest = localStorage.getItem('latest_order');
      if (latest) {
        return JSON.parse(latest);
      }
    } catch {
      // Si falla la lectura, continúa con el respaldo
    }
    return null;
  }, []);

  const cartLines = order?.items ?? [];
  const computedSubtotal = cartLines.reduce(
    (sum: number, item: any) => sum + item.product.price * item.qty,
    0
  );
  const total =
    typeof order?.total === 'number'
      ? order.total
      : computedSubtotal + shippingCost(computedSubtotal, 'estandar');

  const fullUserName = user ? `${user.firstName} ${user.lastName}`.trim() : '';
  const customerName = order?.customerName || fullUserName || 'Cliente Guitar Hero';
  const customerEmail = order?.customerEmail || user?.email || 'cliente@guitarhero.mx';
  const orderId = order?.id || 'GH-00000';
  const orderDate =
    order?.date ||
    new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  const paymentMethod = order?.paymentMethod || 'Tarjeta de crédito o débito';

  const receiptPayload = useMemo(
    () => ({
      orderId,
      date: orderDate,
      status: order?.status || 'Recibido',
      total,
      customerName,
      customerEmail,
      items: cartLines,
    }),
    [orderId, orderDate, order?.status, total, customerName, customerEmail, cartLines]
  );

  useEffect(() => {
    if (downloadedRef.current) return;
    downloadedRef.current = true;
    generateReceiptPDF(receiptPayload);
  }, [receiptPayload]);

  return (
    <section className="bg-pared pt-[clamp(2.5rem,6vw,4.5rem)] pb-section text-hueso" aria-labelledby="gracias-title">
      <div className={container}>
        <div className={`${paperPad} relative mx-auto max-w-184`}>
          <p className="absolute top-6 right-6 rotate-8 rounded-md border-3 border-sunburst-rojo px-[0.9rem] py-[0.35rem] font-display text-[1.1rem] leading-[1.2] text-sunburst-rojo outline-[1.5px] outline-offset-3 outline-sunburst-rojo max-[40rem]:static max-[40rem]:mb-4 max-[40rem]:inline-block max-[40rem]:-rotate-4">
            Pedido recibido
          </p>

          <h1 className={`${tituloSeccion} max-w-[calc(100%-11rem)] max-[40rem]:max-w-none`} id="gracias-title">
            Gracias por tu compra, {customerName}
          </h1>
          <p className="mt-3 max-w-[28rem] text-lg text-tinta-suave">
            Te mandamos la confirmación a <strong>{customerEmail}</strong>.
          </p>

          <dl className="mt-7 grid grid-cols-3 gap-4 border-y border-dashed border-palorosa/40 py-[1.1rem] max-[40rem]:grid-cols-1 [&_dd]:font-display [&_dd]:text-xl [&_dd]:leading-[1.2] [&_dt]:text-sm [&_dt]:text-tinta-suave">
            <div>
              <dt>Número de pedido</dt>
              <dd>{orderId}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
            <div>
              <dt>Forma de pago</dt>
              <dd>{paymentMethod}</dd>
            </div>
          </dl>

          <h2 className={`${paperTitle} mt-8`}>Qué sigue</h2>
          <ol className="mt-5 grid gap-5">
            {NEXT_STEPS.map((step, i) => (
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

          <div className="mt-8 flex flex-wrap gap-3 items-center">
            <button
              className={btn('oscuro')}
              type="button"
              onClick={() => generateReceiptPDF(receiptPayload)}
            >
              Descargar recibo PDF
            </button>
            <Link className={btn('lineaOscura')} to="/cuenta/pedidos">
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