// Datos de muestra para carrito, checkout y cuenta. Se reemplazarán por datos reales.

import { productById } from './catalog';
import type { Product } from './catalog';

export const FREE_SHIPPING_FROM = 2500;
export const STANDARD_SHIPPING = 149;
export const EXPRESS_SHIPPING = 199;

export type ShippingMethod = 'estandar' | 'express';

export interface CartLine {
  product: Product;
  qty: number;
}

const CART_SEED: { id: string; qty: number }[] = [
  { id: 'sunburst-60', qty: 1 },
  { id: 'calle-od', qty: 1 },
  { id: 'cuerdas-010', qty: 2 },
];

export const CART_LINES: CartLine[] = CART_SEED.flatMap(({ id, qty }) => {
  const product = productById(id);
  return product ? [{ product, qty }] : [];
});

export const cartUnits = (lines: CartLine[]): number => lines.reduce((sum, line) => sum + line.qty, 0);

export const cartSubtotal = (lines: CartLine[]): number =>
  lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);

export function shippingCost(subtotal: number, method: ShippingMethod): number {
  if (subtotal === 0) return 0;
  if (method === 'express') return EXPRESS_SHIPPING;
  return subtotal >= FREE_SHIPPING_FROM ? 0 : STANDARD_SHIPPING;
}

/* Cuenta */

export const USER = {
  firstName: 'Mariana',
  lastName: 'Soto',
  email: 'mariana.soto@ejemplo.com',
  phone: '55 1234 5678',
  initials: 'MS',
};

export const STATUS_STEPS = ['Recibido', 'En taller', 'Enviado', 'Entregado'] as const;
export type OrderStatus = (typeof STATUS_STEPS)[number] | 'Cancelado';

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: { productId: string; qty: number }[];
  shipping: number;
  tracking?: string;
}

export const ORDERS: Order[] = [
  {
    id: 'GH-20418',
    date: '8 de noviembre de 2026',
    status: 'En taller',
    items: [{ productId: 'sunburst-60', qty: 1 }],
    shipping: 0,
  },
  {
    id: 'GH-20311',
    date: '27 de octubre de 2026',
    status: 'Enviado',
    items: [
      { productId: 'tweed-20', qty: 1 },
      { productId: 'cuerdas-010', qty: 2 },
    ],
    shipping: 0,
    tracking: 'Guía 7788 2231 0045',
  },
  {
    id: 'GH-19876',
    date: '3 de septiembre de 2026',
    status: 'Entregado',
    items: [
      { productId: 'calle-od', qty: 1 },
      { productId: 'cuerdas-010', qty: 1 },
    ],
    shipping: STANDARD_SHIPPING,
  },
  {
    id: 'GH-19421',
    date: '14 de julio de 2026',
    status: 'Cancelado',
    items: [{ productId: 'estudio-61', qty: 1 }],
    shipping: 0,
  },
];

export function orderLines(order: Order): CartLine[] {
  return order.items.flatMap(({ productId, qty }) => {
    const product = productById(productId);
    return product ? [{ product, qty }] : [];
  });
}

export const orderTotal = (order: Order): number => cartSubtotal(orderLines(order)) + order.shipping;

export interface Address {
  id: string;
  label: string;
  name: string;
  street: string;
  area: string;
  city: string;
  phone: string;
  primary?: boolean;
}

export const ADDRESSES: Address[] = [
  {
    id: 'casa',
    label: 'Casa',
    name: 'Mariana Soto',
    street: 'Av. Reforma 1520, interior 4',
    area: 'Col. Centro, C. P. 64000',
    city: 'Monterrey, Nuevo León',
    phone: '55 1234 5678',
    primary: true,
  },
  {
    id: 'trabajo',
    label: 'Trabajo',
    name: 'Mariana Soto',
    street: 'Calle 5 de Mayo 88',
    area: 'Col. Obrera, C. P. 44100',
    city: 'Guadalajara, Jalisco',
    phone: '33 9876 5432',
  },
];

export const FAVORITE_IDS = ['sunburst-60', 'tweed-20', 'eco-delay', 'piano-88'];

export const STATES = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua',
  'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Estado de México', 'Guanajuato', 'Guerrero',
  'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla',
  'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas',
  'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas',
];
