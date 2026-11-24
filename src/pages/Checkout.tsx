import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Field, SelectField } from '../components/Field';
import { ProductArt } from '../components/ProductArt';
import { formatPrice } from '../data/catalog';
import {
  EXPRESS_SHIPPING,
  FREE_SHIPPING_FROM,
  STANDARD_SHIPPING,
  STATES,
  cartSubtotal,
  shippingCost,
} from '../data/sample';
import type { ShippingMethod } from '../data/sample';
import {
  btn,
  container,
  formGrid,
  paperPad,
  paperTitle,
  radioCard,
  radioCardPrice,
  radioCardText,
  radioCardTitle,
  receipt,
  receiptFree,
  receiptRow,
  receiptRows,
  receiptTotal,
  receiptTotalLabel,
  receiptTotalValue,
  tituloSeccion,
} from '../ui';

const STEP = `${paperPad}`;
const STEP_TITLE = 'mb-6 flex items-center gap-[0.85rem] font-display text-xl leading-[1.1]';
const STEP_NUM = 'grid size-10 flex-none place-items-center rounded-full bg-laton text-[1.35rem] leading-none';
const OPTIONS = 'grid min-w-0 gap-3 border-0 p-0';
const PAY_PANEL = 'mt-6';
const PAY_TEXT = 'mt-6 rounded-md bg-pared/8 px-[1.1rem] py-4 leading-normal';

type PaymentMethod = 'tarjeta' | 'transferencia' | 'efectivo';

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  tarjeta: 'Tarjeta de crédito o débito',
  transferencia: 'Transferencia bancaria',
  efectivo: 'Depósito en efectivo',
};

export function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('estandar');
  const [payment, setPayment] = useState<PaymentMethod>('tarjeta');
  const [errors, setErrors] = useState<string[]>([]);

  const [cartLines] = useState(() => {
    const saved = localStorage.getItem('cart_lines');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const subtotal = cartSubtotal(cartLines);
  const shipping = shippingCost(subtotal, shippingMethod);
  const total = subtotal + shipping;
  const standardFree = subtotal >= FREE_SHIPPING_FROM;
  const fullUserName = user ? `${user.firstName} ${user.lastName}`.trim() : '';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cartLines.length === 0) {
      setErrors(['Tu carrito está vacío. Agrega al menos un producto para continuar.']);
      return;
    }

    const form = event.currentTarget;
    const getVal = (id: string) =>
      (form.elements.namedItem(id) as HTMLInputElement | HTMLSelectElement | null)?.value?.trim() ?? '';

    const correo = getVal('correo');
    const telefono = getVal('telefono').replace(/\D/g, '');
    const nombre = getVal('nombre');
    const calle = getVal('calle');
    const cp = getVal('cp').replace(/\D/g, '');
    const ciudad = getVal('ciudad');
    const estado = getVal('estado');

    const validationErrors: string[] = [];

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      validationErrors.push('Ingresa un correo electrónico válido.');
    }
    if (telefono.length < 10) {
      validationErrors.push('Ingresa un teléfono de al menos 10 dígitos.');
    }
    if (nombre.length < 3) {
      validationErrors.push('Ingresa tu nombre completo.');
    }
    if (calle.length < 4) {
      validationErrors.push('Ingresa la calle y número de entrega.');
    }
    if (!/^\d{5}$/.test(cp)) {
      validationErrors.push('El código postal debe tener 5 dígitos.');
    }
    if (ciudad.length < 2) {
      validationErrors.push('Ingresa tu ciudad o municipio.');
    }
    if (!estado) {
      validationErrors.push('Selecciona un estado.');
    }

    if (payment === 'tarjeta') {
      const tarjeta = getVal('tarjeta').replace(/\D/g, '');
      const titular = getVal('titular');
      const vence = getVal('vence');
      const cvv = getVal('cvv').replace(/\D/g, '');

      if (tarjeta.length !== 16) {
        validationErrors.push('El número de tarjeta debe tener 16 dígitos.');
      }
      if (titular.length < 3) {
        validationErrors.push('Ingresa el nombre del titular de la tarjeta.');
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(vence)) {
        validationErrors.push('El vencimiento debe tener formato MM/AA (ej. 08/28).');
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        validationErrors.push('El código de seguridad (CVV) debe tener 3 o 4 dígitos.');
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);

    const fechaCompra = new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());

    const nuevoPedido = {
      id: 'GH-' + Math.floor(10000 + Math.random() * 90000),
      date: fechaCompra,
      status: 'En taller',
      items: cartLines,
      subtotal,
      shipping,
      shippingMethod,
      paymentMethod: PAYMENT_LABELS[payment],
      total,
      customerName: nombre,
      customerEmail: correo,
    };

    localStorage.setItem('latest_order', JSON.stringify(nuevoPedido));

    try {
      const prev = JSON.parse(localStorage.getItem('orders_history') || '[]');
      const history = Array.isArray(prev) ? [nuevoPedido, ...prev] : [nuevoPedido];
      localStorage.setItem('orders_history', JSON.stringify(history));
    } catch {
      localStorage.setItem('orders_history', JSON.stringify([nuevoPedido]));
    }

    localStorage.removeItem('cart_lines');
    window.dispatchEvent(new Event('storage'));

    navigate('/pedido-confirmado');
  };

  return (
    <section className="bg-pared pt-8 pb-section text-hueso" aria-labelledby="checkout-title">
      <div className={container}>
        <h1 className={tituloSeccion} id="checkout-title">
          Finaliza tu compra
        </h1>

        <form
          className="mt-8 grid grid-cols-[minmax(0,7fr)_minmax(0,4fr)] items-start gap-10 max-[60rem]:grid-cols-1"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="grid gap-7">
            {/* 1. Contacto */}
            <section className={STEP} aria-labelledby="paso-contacto">
              <h2 className={STEP_TITLE} id="paso-contacto">
                <span className={STEP_NUM} aria-hidden="true">
                  1
                </span>
                Tus datos de contacto
              </h2>
              <div className={formGrid}>
                <Field
                  id="correo"
                  label="Correo electrónico"
                  type="email"
                  autoComplete="email"
                  defaultValue={user?.email ?? ''}
                  placeholder="tucorreo@ejemplo.com"
                  hint="Aquí te mandamos la confirmación y la guía de rastreo."
                  wide
                />
                <Field id="telefono" label="Teléfono" type="tel" inputMode="tel" autoComplete="tel" placeholder="10 dígitos" />
              </div>
            </section>

            {/* 2. Envío */}
            <section className={STEP} aria-labelledby="paso-envio">
              <h2 className={STEP_TITLE} id="paso-envio">
                <span className={STEP_NUM} aria-hidden="true">
                  2
                </span>
                Dónde lo entregamos
              </h2>
              <div className={formGrid}>
                <Field
                  id="nombre"
                  label="Nombre completo"
                  autoComplete="name"
                  defaultValue={fullUserName}
                  placeholder="Tu nombre"
                  wide
                />
                <Field id="calle" label="Calle y número" autoComplete="address-line1" wide />
                <Field id="colonia" label="Colonia" autoComplete="address-level3" />
                <Field id="cp" label="Código postal" inputMode="numeric" autoComplete="postal-code" placeholder="5 dígitos" />
                <Field id="ciudad" label="Ciudad o municipio" autoComplete="address-level2" />
                <SelectField id="estado" label="Estado" options={STATES} placeholder="Elige un estado" />
                <Field id="referencias" label="Referencias para el repartidor" placeholder="Por ejemplo: portón negro, entre dos calles" wide />
              </div>

              <fieldset className={`${OPTIONS} mt-6`}>
                <legend className="mb-1 p-0 font-bold">Método de envío</legend>
                <label className={radioCard}>
                  <input
                    type="radio"
                    name="envio"
                    checked={shippingMethod === 'estandar'}
                    onChange={() => setShippingMethod('estandar')}
                  />
                  <span>
                    <span className={radioCardTitle}>Estándar</span>
                    <span className={radioCardText}> Llega en 3 a 5 días hábiles.</span>
                  </span>
                  <span className={radioCardPrice}>
                    {standardFree ? 'Gratis' : formatPrice(STANDARD_SHIPPING)}
                  </span>
                </label>
                <label className={radioCard}>
                  <input
                    type="radio"
                    name="envio"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                  />
                  <span>
                    <span className={radioCardTitle}>Express</span>
                    <span className={radioCardText}> Llega en 1 o 2 días hábiles.</span>
                  </span>
                  <span className={radioCardPrice}>{formatPrice(EXPRESS_SHIPPING)}</span>
                </label>
              </fieldset>
            </section>

            {/* 3. Pago */}
            <section className={STEP} aria-labelledby="paso-pago">
              <h2 className={STEP_TITLE} id="paso-pago">
                <span className={STEP_NUM} aria-hidden="true">
                  3
                </span>
                Cómo pagas
              </h2>

              <fieldset className={OPTIONS}>
                <legend className="sr-only">Forma de pago</legend>
                <label className={radioCard}>
                  <input type="radio" name="pago" checked={payment === 'tarjeta'} onChange={() => setPayment('tarjeta')} />
                  <span>
                    <span className={radioCardTitle}>Tarjeta de crédito o débito</span>
                    <span className={radioCardText}> Hasta 12 meses sin intereses con tarjetas participantes.</span>
                  </span>
                </label>
                <label className={radioCard}>
                  <input type="radio" name="pago" checked={payment === 'transferencia'} onChange={() => setPayment('transferencia')} />
                  <span>
                    <span className={radioCardTitle}>Transferencia bancaria</span>
                    <span className={radioCardText}> Apartamos tu pedido por 24 horas.</span>
                  </span>
                </label>
                <label className={radioCard}>
                  <input type="radio" name="pago" checked={payment === 'efectivo'} onChange={() => setPayment('efectivo')} />
                  <span>
                    <span className={radioCardTitle}>Depósito en efectivo</span>
                    <span className={radioCardText}> Pagas en un banco o tienda de conveniencia con una referencia.</span>
                  </span>
                </label>
              </fieldset>

              {payment === 'tarjeta' && (
                <div className={`${formGrid} ${PAY_PANEL}`}>
                  <Field id="tarjeta" label="Número de tarjeta" inputMode="numeric" autoComplete="cc-number" placeholder="0000 0000 0000 0000" wide />
                  <Field id="titular" label="Nombre como aparece en la tarjeta" autoComplete="cc-name" wide />
                  <Field id="vence" label="Vencimiento" autoComplete="cc-exp" placeholder="MM/AA" />
                  <Field id="cvv" label="Código de seguridad" inputMode="numeric" autoComplete="cc-csc" placeholder="3 o 4 dígitos" />
                  <SelectField
                    id="meses"
                    label="Meses sin intereses"
                    options={['Pago de contado', '3 meses', '6 meses', '12 meses']}
                    wide
                  />
                </div>
              )}

              {payment === 'transferencia' && (
                <p className={PAY_TEXT}>
                  Al confirmar te mostramos la cuenta para transferir. Cuando recibamos el pago, el pedido entra al
                  taller.
                </p>
              )}

              {payment === 'efectivo' && (
                <p className={PAY_TEXT}>
                  Al confirmar generamos una referencia de pago. Tienes 48 horas para pagarla en un banco o tienda de
                  conveniencia.
                </p>
              )}
            </section>
          </div>

          <div className="sticky top-6 max-[60rem]:static">
            <aside className={receipt} aria-label="Resumen del pedido">
              <h2 className={paperTitle}>Tu pedido</h2>

              {cartLines.length === 0 ? (
                <div className="mt-5 border-b border-dashed border-palorosa/35 pb-5">
                  <p className="text-sm text-tinta-suave">No tienes productos en tu carrito.</p>
                  <Link className={`${btn('lineaOscura', { sm: true })} mt-3`} to="/productos">
                    Ir al catálogo
                  </Link>
                </div>
              ) : (
                <ul className="mt-5 grid gap-[0.9rem] border-b border-dashed border-palorosa/35 pb-[1.1rem]">
                  {cartLines.map(({ product, qty }: { product: any; qty: number }) => (
                    <li className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-3" key={product.id}>
                      <ProductArt
                        kind={product.art}
                        tone={product.tone}
                        className="grid aspect-square place-items-center rounded-[3px] bg-tweed p-[0.3rem] [&_svg]:size-full"
                      />
                      <div>
                        <p className="text-sm leading-[1.3] font-semibold">{product.name}</p>
                        <p className="text-xs text-tinta-suave">Cantidad: {qty}</p>
                      </div>
                      <p className="text-sm font-semibold">{formatPrice(product.price * qty)}</p>
                    </li>
                  ))}
                </ul>
              )}

              <dl className={receiptRows}>
                <div className={receiptRow}>
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className={receiptRow}>
                  <dt>Envío {shippingMethod === 'express' ? 'express' : 'estándar'}</dt>
                  <dd className={shipping === 0 ? receiptFree : undefined}>
                    {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                  </dd>
                </div>
              </dl>

              <p className={receiptTotal}>
                <span className={receiptTotalLabel}>Total</span>
                <span className={receiptTotalValue}>{formatPrice(total)}</span>
              </p>

              {errors.length > 0 && (
                <div
                  className="mt-4 rounded-md border border-sunburst-rojo/40 bg-sunburst-rojo/10 p-3 text-sm text-sunburst-rojo"
                  role="alert"
                >
                  <p className="font-semibold">Revisa lo siguiente antes de confirmar:</p>
                  <ul className="mt-1 list-disc pl-5">
                    {errors.map((err) => (
                      <li key={err}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                className={`${btn('oscuro', { block: true })} mt-5 disabled:cursor-not-allowed disabled:opacity-50`}
                type="submit"
                disabled={cartLines.length === 0}
              >
                Confirmar pedido
              </button>
              <p className="mt-[0.8rem] text-center text-sm text-tinta-suave">
                Al confirmar aceptas los{' '}
                <a className="underline underline-offset-[0.2em]" href="#">
                  términos de compra
                </a>
                .
              </p>
            </aside>
          </div>
        </form>
      </div>
    </section>
  );
}