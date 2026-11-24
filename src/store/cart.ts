import { useMemo } from 'react';
import type { Product } from '../data/catalog';
import { createStore, isArray, useStore } from './persist';
import { findProduct, useProducts } from './products';

export const FREE_SHIPPING_FROM = 2500;
export const STANDARD_SHIPPING = 149;
export const EXPRESS_SHIPPING = 199;
export const MAX_QTY = 10;

export type ShippingMethod = 'estandar' | 'express';

export interface CartItem {
  productId: string;
  qty: number;
}

export interface CartLine {
  product: Product;
  qty: number;
}

const isCart = (value: unknown): value is CartItem[] =>
  isArray(value) &&
  value.every((item) => typeof item === 'object' && item !== null && typeof (item as CartItem).productId === 'string');

/* El carrito se guarda en el navegador, haya o no sesión iniciada */
export const cartStore = createStore<CartItem[]>('cart', () => [], isCart);
export const couponStore = createStore<string | null>('coupon', () => null);

const clampQty = (qty: number): number => Math.min(MAX_QTY, Math.max(1, Math.floor(qty)));

export function addToCart(productId: string, qty = 1): void {
  cartStore.set((items) => {
    const existing = items.find((item) => item.productId === productId);
    if (!existing) return [...items, { productId, qty: clampQty(qty) }];
    return items.map((item) => (item.productId === productId ? { ...item, qty: clampQty(item.qty + qty) } : item));
  });
}

export const setCartQty = (productId: string, qty: number): void => {
  cartStore.set((items) => items.map((item) => (item.productId === productId ? { ...item, qty: clampQty(qty) } : item)));
};

export const removeFromCart = (productId: string): void => {
  cartStore.set((items) => items.filter((item) => item.productId !== productId));
};

export const clearCart = (): void => {
  cartStore.set([]);
  couponStore.set(null);
};

/* Cupones de ejemplo */
export const COUPONS: Record<string, { label: string; percent?: number; freeShipping?: boolean }> = {
  GUITARRA10: { label: '10% de descuento en tu compra', percent: 10 },
  ENVIOGRATIS: { label: 'Envío gratis', freeShipping: true },
};

export function applyCoupon(code: string): { ok: true } | { ok: false; error: string } {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { ok: false, error: 'Escribe tu código de descuento.' };
  if (!COUPONS[normalized]) return { ok: false, error: 'Ese código no existe o ya venció.' };
  couponStore.set(normalized);
  return { ok: true };
}

/* Líneas del carrito con su producto actual; si un producto se eliminó del catálogo, desaparece del carrito */
export function useCartLines(): CartLine[] {
  const items = useStore(cartStore);
  const products = useProducts();
  return useMemo(
    () =>
      items.flatMap(({ productId, qty }) => {
        const product = findProduct(products, productId);
        return product ? [{ product, qty }] : [];
      }),
    [items, products],
  );
}

export const useCoupon = (): string | null => useStore(couponStore);

export const cartUnits = (lines: CartLine[]): number => lines.reduce((sum, line) => sum + line.qty, 0);

export const cartSubtotal = (lines: CartLine[]): number =>
  lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export function totalsFor(subtotal: number, method: ShippingMethod, coupon: string | null): Totals {
  const rule = coupon ? COUPONS[coupon] : undefined;
  const discount = rule?.percent ? Math.round((subtotal * rule.percent) / 100) : 0;
  let shipping = 0;
  if (subtotal > 0) {
    if (method === 'express') shipping = EXPRESS_SHIPPING;
    else shipping = subtotal - discount >= FREE_SHIPPING_FROM ? 0 : STANDARD_SHIPPING;
    if (rule?.freeShipping) shipping = 0;
  }
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}
