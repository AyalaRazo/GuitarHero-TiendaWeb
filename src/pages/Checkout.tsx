import { useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Field, SelectField } from '../components/Field';
import { ProductArt } from '../components/ProductArt';
import { formatPrice } from '../data/catalog';
import { STATES } from '../data/states';
import { validateAddress } from '../lib/address';
import type { AddressErrors } from '../lib/address';
import { focusFirstError } from '../lib/forms';
import { cardNumberError, cvvError, emailError, expiryError, hasErrors, phoneError, required } from '../lib/validate';
import { primaryOf, saveAddress, useAddresses } from '../store/addresses';
import type { AddressInput } from '../store/addresses';
import {
  EXPRESS_SHIPPING,
  FREE_SHIPPING_FROM,
  STANDARD_SHIPPING,
  cartSubtotal,
  clearCart,
  totalsFor,
  useCartLines,
  useCoupon,
} from '../store/cart';
import type { ShippingMethod } from '../store/cart';
import { createOrder } from '../store/orders';
import type { PaymentMethod } from '../store/orders';
import {
  btn,
  container,
  formGrid,
  paperMuted,
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
const PAY_TEXT = 'mt-6 rounded-md bg-pared/8 px-[1.1rem] py-4 leading-normal';

type Errors = Record<string, string>;

const BLANK: AddressInput = { label: '', name: '', street: '', colony: '', zip: '', city: '', state: '', phone: '' };

/* Agrupa el número de tarjeta de 4 en 4 mientras se escribe */
const formatCard = (value: string): string =>
  value
    .replace(/\D/g, '')
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ');

/* Inserta la diagonal del vencimiento: 1225 se vuelve 12/25 */
const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export function Checkout() {
  const navigate = useNavigate();
  const { account: user } = useAuth();
  const lines = useCartLines();
  const coupon = useCoupon();
  const addresses = useAddresses(user?.id);
  const formRef = useRef<HTMLFormElement>(null);
  const placed = useRef(false);

  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  // 'nueva' = capturar otra dirección; si no, el id de una dirección guardada
  const [addressChoice, setAddressChoice] = useState<string>(() => primaryOf(addresses)?.id ?? 'nueva');
  const [address, setAddress] = useState<AddressInput>({ ...BLANK, name: user ? `${user.firstName} ${user.lastName}` : '' });
  const [notes, setNotes] = useState('');
  const [remember, setRemember] = useState(true);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('estandar');
  const [payment, setPayment] = useState<PaymentMethod>('tarjeta');
  const [card, setCard] = useState({ number: '', holder: '', expiry: '', cvv: '', months: 'Pago de contado' });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');

  const subtotal = cartSubtotal(lines);
  const totals = useMemo(() => totalsFor(subtotal, shippingMethod, coupon), [subtotal, shippingMethod, coupon]);
  const standardFree = subtotal - totals.discount >= FREE_SHIPPING_FROM;

  // Con el carrito vacío no hay nada que pagar (salvo justo después de confirmar el pedido)
  if (lines.length === 0 && !placed.current) {
    return (
      <section className="bg-pared pt-8 pb-section text-hueso">
        <div className={container}>
          <h1 className={tituloSeccion}>Tu carrito está vacío</h1>
          <div className={`${paperPad} mt-8 grid max-w-[34rem] justify-items-start gap-3`}>
            <p className={paperMuted}>Agrega algo al carrito para poder pagarlo.</p>
            <Link className={btn('oscuro')} to="/productos">
              Ver el catálogo
            </Link>
          </div>
        </div>
      </section>
    );
  }
  if (!user) return <Navigate to="/login" replace state={{ from: '/checkout' }} />;

  const savedChoice = addresses.find((item) => item.id === addressChoice);
  const usingSaved = Boolean(savedChoice);

  const setAddr = (key: keyof AddressInput) => ({
    value: address[key],
    onChange: (event: { target: { value: string } }) => {
      setAddress((current) => ({ ...current, [key]: event.target.value }));
      setErrors((current) => ({ ...current, [key]: '' }));
    },
    error: errors[key],
  });

  const setCardField = (key: keyof typeof card, format?: (value: string) => string) => ({
    value: card[key],
    onChange: (event: { target: { value: string } }) => {
      setCard((current) => ({ ...current, [key]: format ? format(event.target.value) : event.target.value }));
      setErrors((current) => ({ ...current, [`card-${key}`]: '' }));
    },
    error: errors[`card-${key}`],
  });

  const validate = (): Errors => {
    const found: Errors = {
      email: emailError(email),
      phone: phoneError(phone),
    };
    if (!usingSaved) {
      const addressErrors: AddressErrors = validateAddress(address);
      Object.assign(found, addressErrors);
    }
    if (payment === 'tarjeta') {
      found['card-number'] = cardNumberError(card.number);
      found['card-holder'] = required(card.holder, 'Escribe el nombre que aparece en la tarjeta.');
      found['card-expiry'] = expiryError(card.expiry);
      found['card-cvv'] = cvvError(card.cvv);
    }
    return found;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setFormError('');
    const found = validate();
    if (hasErrors(found)) {
      setErrors(found);
      focusFirstError(formRef.current);
      return;
    }

    const shipTo = savedChoice ?? address;
    const order = createOrder({
      userId: user.id,
      lines,
      totals,
      coupon,
      shippingMethod,
      address: {
        name: shipTo.name.trim(),
        street: shipTo.street.trim(),
        colony: shipTo.colony.trim(),
        zip: shipTo.zip.trim(),
        city: shipTo.city.trim(),
        state: shipTo.state,
        phone: shipTo.phone.trim(),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      },
      payment,
      cardLast4: payment === 'tarjeta' ? card.number.replace(/\s/g, '').slice(-4) : undefined,
    });
    if (!order) {
      setFormError('No pudimos guardar tu pedido en este navegador. Libera espacio e inténtalo de nuevo.');
      return;
    }

    if (!usingSaved && remember) {
      saveAddress(user.id, { ...address, label: addresses.length === 0 ? 'Casa' : `Dirección ${addresses.length + 1}` });
    }
    placed.current = true;
    clearCart();
    navigate('/pedido-confirmado', { replace: true, state: { orderId: order.id } });
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
          ref={formRef}
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
                  id="email"
                  label="Correo electrónico"
                  type="email"
                  autoComplete="email"
                  placeholder="tucorreo@ejemplo.com"
                  hint="Aquí te mandamos la confirmación y la guía de rastreo."
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrors((current) => ({ ...current, email: '' }));
                  }}
                  error={errors.email}
                  wide
                />
                <Field
                  id="phone"
                  label="Teléfono"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="10 dígitos"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    setErrors((current) => ({ ...current, phone: '' }));
                  }}
                  error={errors.phone}
                />
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

              {addresses.length > 0 && (
                <fieldset className={`${OPTIONS} mb-6`}>
                  <legend className="mb-1 p-0 font-bold">Tus direcciones</legend>
                  {addresses.map((item) => (
                    <label className={radioCard} key={item.id}>
                      <input type="radio" name="direccion" checked={addressChoice === item.id} onChange={() => setAddressChoice(item.id)} />
                      <span>
                        <span className={radioCardTitle}>
                          {item.label}
                          {item.primary ? ' (principal)' : ''}
                        </span>
                        <span className={radioCardText}>
                          {' '}
                          {item.name}, {item.street}, Col. {item.colony}, C. P. {item.zip}, {item.city}, {item.state}.
                        </span>
                      </span>
                    </label>
                  ))}
                  <label className={radioCard}>
                    <input type="radio" name="direccion" checked={addressChoice === 'nueva'} onChange={() => setAddressChoice('nueva')} />
                    <span>
                      <span className={radioCardTitle}>Usar otra dirección</span>
                    </span>
                  </label>
                </fieldset>
              )}

              {!usingSaved && (
                <div className={formGrid}>
                  <Field id="nombre" label="Nombre completo" autoComplete="name" {...setAddr('name')} wide />
                  <Field id="calle" label="Calle y número" autoComplete="address-line1" {...setAddr('street')} wide />
                  <Field id="colonia" label="Colonia" autoComplete="address-level3" {...setAddr('colony')} />
                  <Field id="cp" label="Código postal" inputMode="numeric" maxLength={5} autoComplete="postal-code" placeholder="5 dígitos" {...setAddr('zip')} />
                  <Field id="ciudad" label="Ciudad o municipio" autoComplete="address-level2" {...setAddr('city')} />
                  <SelectField id="estado" label="Estado" options={STATES} placeholder="Elige un estado" {...setAddr('state')} />
                  <Field id="telefono-envio" label="Teléfono de quien recibe" type="tel" inputMode="numeric" autoComplete="tel" placeholder="10 dígitos" {...setAddr('phone')} wide />
                </div>
              )}

              <div className={`${formGrid} ${usingSaved ? '' : 'mt-4'}`}>
                <Field
                  id="referencias"
                  label="Referencias para el repartidor"
                  placeholder="Por ejemplo: portón negro, entre dos calles"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  wide
                />
              </div>

              {!usingSaved && (
                <label className="mt-4 flex items-center gap-3">
                  <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
                  <span>Guardar esta dirección en mi cuenta</span>
                </label>
              )}

              <fieldset className={`${OPTIONS} mt-6`}>
                <legend className="mb-1 p-0 font-bold">Método de envío</legend>
                <label className={radioCard}>
                  <input type="radio" name="envio" checked={shippingMethod === 'estandar'} onChange={() => setShippingMethod('estandar')} />
                  <span>
                    <span className={radioCardTitle}>Estándar</span>
                    <span className={radioCardText}> Llega en 3 a 5 días hábiles.</span>
                  </span>
                  <span className={radioCardPrice}>{standardFree ? 'Gratis' : formatPrice(STANDARD_SHIPPING)}</span>
                </label>
                <label className={radioCard}>
                  <input type="radio" name="envio" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} />
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
                  <input type="radio" name="pago" checked={payment === 'deposito'} onChange={() => setPayment('deposito')} />
                  <span>
                    <span className={radioCardTitle}>Depósito en efectivo</span>
                    <span className={radioCardText}> Pagas en un banco o tienda de conveniencia con una referencia.</span>
                  </span>
                </label>
              </fieldset>

              {payment === 'tarjeta' && (
                <div className={`${formGrid} mt-6`}>
                  <Field
                    id="card-number"
                    label="Número de tarjeta"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="0000 0000 0000 0000"
                    hint="Para probar usa 4242 4242 4242 4242. No guardamos el número completo."
                    {...setCardField('number', formatCard)}
                    wide
                  />
                  <Field id="card-holder" label="Nombre como aparece en la tarjeta" autoComplete="cc-name" {...setCardField('holder')} wide />
                  <Field id="card-expiry" label="Vencimiento" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" {...setCardField('expiry', formatExpiry)} />
                  <Field
                    id="card-cvv"
                    label="Código de seguridad"
                    inputMode="numeric"
                    maxLength={4}
                    autoComplete="cc-csc"
                    placeholder="3 o 4 dígitos"
                    {...setCardField('cvv', (value) => value.replace(/\D/g, ''))}
                  />
                  <SelectField
                    id="card-months"
                    label="Meses sin intereses"
                    options={['Pago de contado', '3 meses', '6 meses', '12 meses']}
                    value={card.months}
                    onChange={(event) => setCard((current) => ({ ...current, months: event.target.value }))}
                    wide
                  />
                </div>
              )}

              {payment === 'transferencia' && (
                <p className={PAY_TEXT}>
                  Al confirmar te mostramos la cuenta para transferir. Cuando recibamos el pago, el pedido entra al taller.
                </p>
              )}

              {payment === 'deposito' && (
                <p className={PAY_TEXT}>
                  Al confirmar generamos una referencia de pago. Tienes 48 horas para pagarla en un banco o tienda de conveniencia.
                </p>
              )}
            </section>
          </div>

          <div className="sticky top-6 max-[60rem]:static">
            <aside className={receipt} aria-label="Resumen del pedido">
              <h2 className={paperTitle}>Tu pedido</h2>

              <ul className="mt-5 grid gap-[0.9rem] border-b border-dashed border-palorosa/35 pb-[1.1rem]">
                {lines.map(({ product, qty }) => (
                  <li className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-3" key={product.id}>
                    <ProductArt
                      kind={product.art}
                      tone={product.tone}
                      image={product.image}
                      className="grid aspect-square place-items-center rounded-[3px] bg-tweed p-[0.3rem] [&_img]:size-full [&_svg]:size-full"
                    />
                    <div>
                      <p className="text-sm leading-[1.3] font-semibold">{product.name}</p>
                      <p className="text-xs text-tinta-suave">Cantidad: {qty}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatPrice(product.price * qty)}</p>
                  </li>
                ))}
              </ul>

              <dl className={receiptRows}>
                <div className={receiptRow}>
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                {totals.discount > 0 && coupon && (
                  <div className={receiptRow}>
                    <dt>Descuento {coupon}</dt>
                    <dd className={receiptFree}>-{formatPrice(totals.discount)}</dd>
                  </div>
                )}
                <div className={receiptRow}>
                  <dt>Envío {shippingMethod === 'express' ? 'express' : 'estándar'}</dt>
                  <dd className={totals.shipping === 0 ? receiptFree : undefined}>
                    {totals.shipping === 0 ? 'Gratis' : formatPrice(totals.shipping)}
                  </dd>
                </div>
              </dl>

              <p className={receiptTotal}>
                <span className={receiptTotalLabel}>Total</span>
                <span className={receiptTotalValue}>{formatPrice(totals.total)}</span>
              </p>

              {formError && (
                <p className="mt-4 font-semibold text-sunburst-rojo" role="alert">
                  {formError}
                </p>
              )}
              {hasErrors(errors) && (
                <p className="mt-4 font-semibold text-sunburst-rojo" role="alert">
                  Revisa los campos marcados para continuar.
                </p>
              )}

              <button className={`${btn('oscuro', { block: true })} mt-5`} type="submit">
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
