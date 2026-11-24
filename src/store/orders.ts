import type { ArtKind, ArtTone } from '../data/catalog';
import { createStore, isArray, useStore } from './persist';
import type { CartLine, ShippingMethod, Totals } from './cart';

export const STATUS_STEPS = ['Recibido', 'En taller', 'Enviado', 'Entregado'] as const;
export type OrderStatus = (typeof STATUS_STEPS)[number] | 'Cancelado';

/* Foto fija del producto al momento de comprar: si luego cambia de precio o se elimina, el pedido no cambia */
export interface OrderItem {
  productId: string;
  name: string;
  detail: string;
  price: number;
  qty: number;
  art: ArtKind;
  tone: ArtTone;
}

export interface ShippingAddress {
  name: string;
  street: string;
  colony: string;
  zip: string;
  city: string;
  state: string;
  phone: string;
  notes?: string;
}

export type PaymentMethod = 'tarjeta' | 'transferencia' | 'deposito';

export interface Order {
  id: string;
  userId: string;
  createdAt: number;
  status: OrderStatus;
  items: OrderItem[];
  totals: Totals;
  coupon?: string;
  shippingMethod: ShippingMethod;
  address: ShippingAddress;
  payment: PaymentMethod;
  cardLast4?: string;
  /* Referencia para pagar por transferencia o en efectivo */
  reference?: string;
  tracking?: string;
}

const isOrderList = (value: unknown): value is Order[] =>
  isArray(value) &&
  value.every((item) => typeof item === 'object' && item !== null && typeof (item as Order).id === 'string');

export const ordersStore = createStore<Order[]>('orders', () => [], isOrderList);

export const useAllOrders = (): Order[] => useStore(ordersStore);

/* Pedidos de una persona, del más reciente al más antiguo */
export function useOrders(userId: string | undefined): Order[] {
  const all = useAllOrders();
  return all.filter((order) => order.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
}

const nextOrderId = (orders: Order[]): string => {
  const highest = orders.reduce((max, order) => Math.max(max, Number(order.id.replace(/\D/g, '')) || 0), 20000);
  return `GH-${highest + 1}`;
};

const randomDigits = (length: number): string =>
  Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');

export interface NewOrder {
  userId: string;
  lines: CartLine[];
  totals: Totals;
  coupon: string | null;
  shippingMethod: ShippingMethod;
  address: ShippingAddress;
  payment: PaymentMethod;
  cardLast4?: string;
}

export function createOrder(data: NewOrder): Order | null {
  const current = ordersStore.get();
  const order: Order = {
    id: nextOrderId(current),
    userId: data.userId,
    createdAt: Date.now(),
    status: 'Recibido',
    items: data.lines.map(({ product, qty }) => ({
      productId: product.id,
      name: product.name,
      detail: product.detail,
      price: product.price,
      qty,
      art: product.art,
      tone: product.tone,
    })),
    totals: data.totals,
    shippingMethod: data.shippingMethod,
    address: data.address,
    payment: data.payment,
  };
  if (data.coupon) order.coupon = data.coupon;
  if (data.cardLast4) order.cardLast4 = data.cardLast4;
  if (data.payment !== 'tarjeta') order.reference = randomDigits(12);
  return ordersStore.set([...current, order]) ? order : null;
}

/* Solo se puede cancelar mientras el taller no ha empezado */
export const canCancel = (order: Order): boolean => order.status === 'Recibido';

export function cancelOrder(id: string): boolean {
  return ordersStore.set((orders) =>
    orders.map((order) => (order.id === id && canCancel(order) ? { ...order, status: 'Cancelado' } : order)),
  );
}

export function setOrderStatus(id: string, status: OrderStatus): boolean {
  return ordersStore.set((orders) =>
    orders.map((order) => {
      if (order.id !== id) return order;
      const next: Order = { ...order, status };
      if (status === 'Enviado' && !next.tracking) next.tracking = `Guía ${randomDigits(4)} ${randomDigits(4)} ${randomDigits(4)}`;
      return next;
    }),
  );
}

export const formatOrderDate = (timestamp: number): string =>
  new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(timestamp);

export function formatAddressLines(address: ShippingAddress): { street: string; area: string; city: string } {
  return {
    street: address.street,
    area: `Col. ${address.colony}, C. P. ${address.zip}`,
    city: `${address.city}, ${address.state}`,
  };
}
