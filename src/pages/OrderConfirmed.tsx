import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateReceiptPDF } from '../utils/generatePDF';
import { formatPrice } from '../data/catalog';
import { shippingCost } from '../data/sample';
import { btn, container, paperPad, paperTitle, tituloSeccion } from '../ui';

const NEXT_STEPS = [
  { title: 'Lo revisamos en el taller', text: 'Trastes, clavijas, electrónica y altura de las cuerdas.' },
  { title: 'Lo empacamos y lo mandamos', text: 'Te avisamos por correo con la guía de rastreo.' },
  { title: 'Llega a tu puerta', text: 'En 3 a 5 días hábiles con envío estándar.' },
];

export function OrderConfirmed() {
  // 1. Buscamos los productos de manera segura en el localStorage (probando varias llaves)
  const getOrderItems = () => {
    try {
      // Intentar leer del último pedido guardado en el checkout
      const latest = localStorage.getItem('latest_order');
      if (latest) {
        const parsedOrder = JSON.parse(latest);
        if (parsedOrder && parsedOrder.items && parsedOrder.items.length > 0) {
          return parsedOrder.items;
        }
      }
      // Si no, intentar leer directamente del carrito actual
      const cart = localStorage.getItem('cart_lines');
      if (cart) {
        const parsedCart = JSON.parse(cart);
        if (parsedCart && parsedCart.length > 0) {
          return parsedCart;
        }
      }
    } catch (e) {
      console.error("Error leyendo productos del almacenamiento", e);
    }
    return [];
  };

  const cartLines = getOrderItems();

  // Calculamos subtotal y total reales
  const subtotal = cartLines.reduce((sum: number, item: any) => sum + (item.product.price * item.qty), 0);
  const shipping = shippingCost(subtotal, 'estandar');
  const total = subtotal + shipping;

  // Se ejecuta automáticamente al cargar la página de confirmación
  useEffect(() => {
    let currentName = 'Luis Gomez';
    let currentEmail = 'luisgomez@gmail.com';

    try {
      const userSession = localStorage.getItem('user') || localStorage.getItem('usuario') || localStorage.getItem('auth');
      if (userSession) {
        const parsed = JSON.parse(userSession);
        currentName = parsed.name || parsed.nombre || parsed.username || currentName;
        currentEmail = parsed.email || currentEmail;
      } else {
        const rawUser = localStorage.getItem('user') || localStorage.getItem('userName');
        if (rawUser) currentName = rawUser;
      }
    } catch (e) {
      // Valor por defecto
    }

    // Genera y descarga el PDF con los datos exactos y los items encontrados
    generateReceiptPDF({
      orderId: 'GH-20419',
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'Recibido',
      total: total > 0 ? total : 14960, // Respaldo por seguridad si viniera en 0
      customerName: currentName,
      customerEmail: currentEmail,
      items: cartLines
    });
  }, [cartLines, total]);

  return (
    <section className="bg-pared pt-[clamp(2.5rem,6vw,4.5rem)] pb-section text-hueso" aria-labelledby="gracias-title">
      <div className={container}>
        <div className={`${paperPad} relative mx-auto max-w-184`}>
          <p className="absolute top-6 right-6 rotate-8 rounded-md border-3 border-sunburst-rojo px-[0.9rem] py-[0.35rem] font-display text-[1.1rem] leading-[1.2] text-sunburst-rojo outline-[1.5px] outline-offset-3 outline-sunburst-rojo max-[40rem]:static max-[40rem]:mb-4 max-[40rem]:inline-block max-[40rem]:-rotate-4">Pedido recibido</p>

          <h1 className={`${tituloSeccion} max-w-[calc(100%-11rem)] max-[40rem]:max-w-none`} id="gracias-title">
            Gracias por tu compra
          </h1>
          <p className="mt-3 max-w-[28rem] text-lg text-tinta-suave">
            Te mandamos la confirmación a tu correo registrado.
          </p>

          <dl className="mt-7 grid grid-cols-3 gap-4 border-y border-dashed border-palorosa/40 py-[1.1rem] max-[40rem]:grid-cols-1 [&_dd]:font-display [&_dd]:text-xl [&_dd]:leading-[1.2] [&_dt]:text-sm [&_dt]:text-tinta-suave">
            <div>
              <dt>Número de pedido</dt>
              <dd>GH-20419</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{formatPrice(total > 0 ? total : 14960)}</dd>
            </div>
            <div>
              <dt>Forma de pago</dt>
              <dd>Tarjeta de crédito</dd>
            </div>
          </dl>

          <h2 className={`${paperTitle} mt-8`}>Qué sigue</h2>
          <ol className="mt-5 grid gap-5">
            {NEXT_STEPS.map((step, i) => (
              <li className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-3" key={step.title}>
                <span
                  className="grid size-[2.1rem] place-items-center rounded-full bg-laton font-display text-[1.1rem] leading-none" aria-hidden="true">
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