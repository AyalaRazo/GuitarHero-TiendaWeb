import { ART_LABEL, TONE_LABEL } from '../data/catalog';
import type { Product } from '../data/catalog';
import { FREE_SHIPPING_FROM } from '../store/cart';

/*
  Filtros del catálogo, calculados con los productos que hay ahora mismo:
  si el administrador agrega un acabado o un tipo nuevo, aparece solo.
  Dentro de un mismo grupo se suman (Negro o Blanco); entre grupos se combinan (Negro y en oferta).
*/

export interface FilterState {
  /* Claves con la forma "grupo:valor" */
  checked: string[];
  min: string;
  max: string;
}

export const EMPTY_FILTERS: FilterState = { checked: [], min: '', max: '' };

export interface FacetOption {
  key: string;
  label: string;
  count: number;
}

export interface Facet {
  id: string;
  label: string;
  options: FacetOption[];
}

type Predicate = (product: Product) => boolean;

const isNew = (product: Product): boolean => /nuev/i.test(product.badge ?? '');

const CONDITIONS: { value: string; label: string; test: Predicate }[] = [
  { value: 'nuevo', label: 'Nuevo', test: isNew },
  { value: 'oferta', label: 'En oferta', test: (product) => Boolean(product.oldPrice) },
  { value: 'envio', label: 'Envío gratis', test: (product) => product.price >= FREE_SHIPPING_FROM },
];

const optionMatchers = (key: string): Predicate | undefined => {
  const [group, value] = key.split(':');
  if (group === 'tipo') return (product) => product.art === value;
  if (group === 'acabado') return (product) => product.tone === value;
  if (group === 'condicion') return CONDITIONS.find((item) => item.value === value)?.test;
  return undefined;
};

/* Grupos y opciones disponibles para una lista de productos */
export function buildFacets(products: Product[]): Facet[] {
  const facets: Facet[] = [];

  const arts = [...new Set(products.map((product) => product.art))];
  if (arts.length > 1) {
    facets.push({
      id: 'tipo',
      label: 'Tipo',
      options: arts.map((art) => ({
        key: `tipo:${art}`,
        label: ART_LABEL[art],
        count: products.filter((product) => product.art === art).length,
      })),
    });
  }

  const tones = [...new Set(products.map((product) => product.tone))];
  if (tones.length > 1) {
    facets.push({
      id: 'acabado',
      label: 'Acabado',
      options: tones.map((tone) => ({
        key: `acabado:${tone}`,
        label: TONE_LABEL[tone],
        count: products.filter((product) => product.tone === tone).length,
      })),
    });
  }

  const conditions = CONDITIONS.map((item) => ({
    key: `condicion:${item.value}`,
    label: item.label,
    count: products.filter(item.test).length,
  })).filter((option) => option.count > 0);
  if (conditions.length > 0) facets.push({ id: 'condicion', label: 'Condición', options: conditions });

  return facets;
}

const toNumber = (text: string): number | null => {
  const value = Number(text.replace(/\D/g, ''));
  return text.trim() && Number.isFinite(value) ? value : null;
};

export function applyFilters(products: Product[], state: FilterState): Product[] {
  const min = toNumber(state.min);
  const max = toNumber(state.max);

  // Agrupa las claves marcadas por grupo
  const groups = new Map<string, Predicate[]>();
  for (const key of state.checked) {
    const predicate = optionMatchers(key);
    if (!predicate) continue;
    const group = key.split(':')[0];
    groups.set(group, [...(groups.get(group) ?? []), predicate]);
  }

  return products.filter((product) => {
    if (min !== null && product.price < min) return false;
    if (max !== null && product.price > max) return false;
    return [...groups.values()].every((predicates) => predicates.some((test) => test(product)));
  });
}

export const countActive = (state: FilterState): number =>
  state.checked.length + (state.min.trim() || state.max.trim() ? 1 : 0);
