import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';
import { ProductArt } from '../components/ProductArt';
import { formatPrice } from '../data/catalog';
import {
  COUPONS,
  FREE_SHIPPING_FROM,
  MAX_QTY,
  applyCoupon,
  cartSubtotal,
  cartUnits,
  couponStore,
  removeFromCart,
  setCartQty,
  totalsFor,
  useCartLines,
  useCoupon,
} from '../store/cart';
import {
  btn,
  container,
  fieldInput,
  fieldLabel,
  linkButton,
  paper,
  paperMuted,
  paperPad,
  paperTitle,
  receipt,
  receiptFree,
  receiptRow,
  receiptRows,
  receiptTotal,
  receiptTotalLabel,
  receiptTotalValue,
  tituloSeccion,
} from '../ui';

const ROW_GRID = 'grid grid-cols-[6rem_minmax(0,1fr)_8rem_6.5rem] items-center gap-x-5 gap-y-4';
const AREAS = "max-[40rem]:grid-cols-[4.5rem_minmax(0,1fr)] max-[40rem]:[grid-template-areas:'art_info'_'qty_total']";
const QTY_BTN = 'grid size-[2.4rem] place-items-center border-0 bg-transparent text-xl leading-none transition-colors duration-200 hover:bg-palorosa/8';

export function Cart() {
  const lines = useCartLines();
  const coupon = useCoupon();
  const [code, setCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = cartSubtotal(lines);
  const units = cartUnits(lines);
  const { discount, shipping, total } = totalsFor(subtotal, 'estandar', coupon);
  const missing = Math.max(0, FREE_SHIPPING_FROM - (subtotal - discount));
  const progress = Math.min(100, Math.round(((subtotal - discount) / FREE_SHIPPING_FROM) * 100));

  const handleCoupon = (event: FormEvent) => {
    event.preventDefault();
    const result = applyCoupon(code);
    if (result.ok) {
      setCode('');
      setCouponError('');
    } else {
      setCouponError(result.error);
    }
  };

  return (
    <section className="bg-pared pt-7 pb-section text-hueso" aria-labelledby="carrito-title">
      <div className={container}>
        <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Carrito' }]} />
        <h1 className={`${tituloSeccion} mt-4`} id="carrito-title">
          Tu carrito
        </h1>

        {lines.length === 0 ? (
          <div className={`${paperPad} mt-8 grid max-w-[34rem] justify-items-start gap-3`}>
            <h2 className={paperTitle}>Tu carrito está vacío</h2>
            <p className={paperMuted}>Descuelga algo de la pared y vuelve aquí para pagarlo.</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Link className={btn('oscuro')} to="/productos">
                Ver el catálogo
              </Link>
              <Link className={btn('lineaOscura')} to="/#destacados">
                Ver lo destacado
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-2 text-lg text-tweed">
              {units} {units === 1 ? 'artículo' : 'artículos'}
            </p>

            <div className="mt-8 grid grid-cols-[minmax(0,1fr)_22rem] items-start gap-8 max-[60rem]:grid-cols-1">
              <div className={`${paper} px-[clamp(1rem,3vw,2rem)] pt-2 pb-3`}>
                <div
                  className={`${ROW_GRID} border-b-2 border-palorosa pt-4 pb-3 text-sm font-semibold text-tinta-suave max-[40rem]:hidden`}
                  aria-hidden="true"
                >
                  <span className="col-span-2">Producto</span>
                  <span>Cantidad</span>
                  <span className="text-right">Total</span>
                </div>
                <ul>
                  {lines.map(({ product, qty }) => (
                    <li
                      className={`${ROW_GRID} ${AREAS} border-b border-dashed border-palorosa/35 py-5 last:border-b-0`}
                      key={product.id}
                    >
                      <ProductArt
                        kind={product.art}
                        tone={product.tone}
                        image={product.image}
                        className="grid aspect-square place-items-center rounded-[3px] bg-tweed p-[0.6rem] max-[40rem]:[grid-area:art] [&_img]:size-full [&_svg]:size-full"
                      />

                      <div className="grid justify-items-start gap-[0.2rem] max-[40rem]:[grid-area:info]">
                        <h2 className="text-base leading-[1.3] font-semibold">
                          <Link className="hover:underline hover:underline-offset-[0.2em]" to={`/producto/${product.id}`}>
                            {product.name}
                          </Link>
                        </h2>
                        <p className="text-sm text-tinta-suave">{product.detail}</p>
                        <p className="text-sm">{formatPrice(product.price)} cada uno</p>
                        <button className={`${linkButton} mt-[0.4rem] text-sm`} type="button" onClick={() => removeFromCart(product.id)}>
                          Quitar<span className="sr-only"> {product.name}</span>
                        </button>
                      </div>

                      <div
                        className="inline-flex items-center justify-self-start rounded-md border-2 border-palorosa/40 max-[40rem]:[grid-area:qty]"
                        role="group" 
                        aria-label={`Cantidad de ${product.name}`}
                      >
                        <button
                          className={QTY_BTN}
                          type="button"
                          aria-label="Quitar una unidad"
                          disabled={qty <= 1}
                          onClick={() => setCartQty(product.id, qty - 1)}
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center font-bold" aria-live="polite">
                          {qty}
                        </span>
                        <button
                          className={QTY_BTN}
                          type="button"
                          aria-label="Agregar una unidad"
                          disabled={qty >= MAX_QTY}
                          onClick={() => setCartQty(product.id, qty + 1)}
                        >
                          +
                        </button>
                      </div>

                      <p className="text-right font-display text-[1.4rem] leading-[1.1] max-[40rem]:[grid-area:total]">{formatPrice(product.price * qty)}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sticky top-36 max-[60rem]:static">
              <aside className={receipt} aria-label="Resumen del pedido">
                <h2 className={paperTitle}>Resumen del pedido</h2>

                <div className="mt-[1.1rem]">
                  <div
                    className="h-[0.6rem] overflow-hidden rounded-full bg-palorosa/15"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={FREE_SHIPPING_FROM}
                    aria-valuenow={Math.min(subtotal, FREE_SHIPPING_FROM)}
                    aria-label="Avance hacia el envío gratis"
                  >
                    <div className="h-full rounded-full bg-laton" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-2 text-sm font-semibold">
                    {missing === 0
                      ? 'Tu pedido ya tiene envío gratis.'
                      : `Te faltan ${formatPrice(missing)} para el envío gratis.`}
                  </p>
                </div>

                <dl className={receiptRows}>
                  <div className={receiptRow}>
                    <dt>Subtotal</dt>
                    <dd>{formatPrice(subtotal)}</dd>
                  </div>
                  {discount > 0 && coupon && (
                    <div className={receiptRow}>
                      <dt>Descuento {coupon}</dt>
                      <dd className={receiptFree}>-{formatPrice(discount)}</dd>
                    </div>
                  )}
                  <div className={receiptRow}>
                    <dt>Envío estándar</dt>
                    <dd className={shipping === 0 ? receiptFree : undefined}>
                      {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                    </dd>
                  </div>
                </dl>

                {coupon ? (
                  <p className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-md bg-laton/25 px-3 py-2 text-sm" role="status">
                    <span>
                      <strong>{coupon}</strong>: {COUPONS[coupon]?.label}
                    </span>
                    <button className={linkButton} type="button" onClick={() => couponStore.set(null)}>
                      Quitar
                    </button>
                  </p>
                ) : (
                  <form className="mt-5 grid gap-[0.35rem]" onSubmit={handleCoupon} noValidate>
                    <label className={fieldLabel} htmlFor="cupon">
                      Código de descuento
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="cupon"
                        className={fieldInput}
                        placeholder="Escríbelo aquí"
                        value={code}
                        onChange={(event) => setCode(event.target.value)}
                        aria-invalid={couponError ? true : undefined}
                        aria-describedby={couponError ? 'cupon-error' : undefined}
                      />
                      <button className={btn('lineaOscura', { sm: true })} type="submit">
                        Aplicar
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-sm font-semibold text-sunburst-rojo" id="cupon-error">
                        {couponError}
                      </p>
                    )}
                  </form>
                )}

                <p className={receiptTotal}>
                  <span className={receiptTotalLabel}>Total</span>
                  <span className={receiptTotalValue}>{formatPrice(total)}</span>
                </p>

                <Link className={`${btn('oscuro', { block: true })} mt-5`} to="/checkout">
                  Ir a pagar
                </Link>
                <Link
                  className="mt-[0.9rem] block text-center font-semibold underline decoration-laton decoration-2 underline-offset-[0.25em]"
                  to="/productos"
                >
                  Seguir comprando
                </Link>
                <p className="mt-[0.9rem] text-center text-sm text-tinta-suave">Pagas con tarjeta, transferencia o depósito en efectivo.</p>
              </aside>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
