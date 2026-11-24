import { SEED_PRODUCTS } from '../data/catalog';
import type { CategoryId, Product } from '../data/catalog';
import { createStore, isArray, useStore } from './persist';

/* Catálogo de la tienda: se siembra con los productos de ejemplo y a partir de ahí lo administra el panel. */

const isProductList = (value: unknown): value is Product[] =>
  isArray(value) &&
  value.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Product).id === 'string' &&
      typeof (item as Product).name === 'string' &&
      typeof (item as Product).price === 'number',
  );

export const productsStore = createStore<Product[]>('products', () => SEED_PRODUCTS, isProductList);

export const useProducts = (): Product[] => useStore(productsStore);

export const findProduct = (products: Product[], id: string | undefined): Product | undefined =>
  id ? products.find((product) => product.id === id) : undefined;

export const countByCategory = (products: Product[], id: CategoryId): number =>
  products.filter((product) => product.category === id).length;

export type ProductInput = Omit<Product, 'id'>;

type Result = { ok: true; product: Product } | { ok: false; error: string };

const slugify = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'producto';

function uniqueId(name: string, taken: Set<string>): string {
  const base = slugify(name);
  let id = base;
  for (let n = 2; taken.has(id); n += 1) id = `${base}-${n}`;
  return id;
}

const STORAGE_ERROR = 'No se pudo guardar: el navegador se quedó sin espacio. Prueba con una foto más pequeña.';

/* Quita los campos vacíos para que lo guardado quede limpio */
function clean(input: ProductInput): ProductInput {
  const product: ProductInput = {
    name: input.name.trim(),
    detail: input.detail.trim(),
    price: input.price,
    category: input.category,
    art: input.art,
    tone: input.tone,
  };
  if (input.oldPrice) product.oldPrice = input.oldPrice;
  if (input.badge?.trim()) product.badge = input.badge.trim();
  if (input.featured) product.featured = true;
  if (input.image) product.image = input.image;
  return product;
}

export function createProduct(input: ProductInput): Result {
  const current = productsStore.get();
  const product: Product = { id: uniqueId(input.name, new Set(current.map((p) => p.id))), ...clean(input) };
  // Lo más nuevo arriba, para que se vea en cuanto se crea
  return productsStore.set([product, ...current]) ? { ok: true, product } : { ok: false, error: STORAGE_ERROR };
}

export function updateProduct(id: string, input: ProductInput): Result {
  const current = productsStore.get();
  if (!current.some((product) => product.id === id)) return { ok: false, error: 'Ese producto ya no existe.' };
  const product: Product = { id, ...clean(input) };
  const saved = productsStore.set(current.map((item) => (item.id === id ? product : item)));
  return saved ? { ok: true, product } : { ok: false, error: STORAGE_ERROR };
}

export function deleteProduct(id: string): boolean {
  return productsStore.set((current) => current.filter((product) => product.id !== id));
}

export const resetCatalog = (): void => productsStore.reset();
