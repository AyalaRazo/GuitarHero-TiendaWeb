// Datos de muestra solo para el diseño. La fuente real de datos se conectará después.

export type ArtKind = 'electric' | 'bass' | 'acoustic' | 'amp' | 'keys' | 'pedal' | 'strings' | 'drum';
export type ArtTone = 'sunburst' | 'negro' | 'blanco' | 'verde' | 'natural';
export type CategoryId = 'guitarras' | 'bajos' | 'amplificadores' | 'teclados' | 'bateria' | 'accesorios';

export interface NavLink {
  label: string;
  to: string;
  featured?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Guitarras', to: '/productos/guitarras' },
  { label: 'Bajos', to: '/productos/bajos' },
  { label: 'Amplificadores', to: '/productos/amplificadores' },
  { label: 'Teclados', to: '/productos/teclados' },
  { label: 'Batería', to: '/productos/bateria' },
  { label: 'Accesorios', to: '/productos/accesorios' },
  { label: 'Taller', to: '/#taller' },
  { label: 'Ofertas', to: '/#destacados', featured: true },
];

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
  art: ArtKind;
  tone: ArtTone;
  size: 'lg' | 'md' | 'sm';
}

export const CATEGORIES: Category[] = [
  { id: 'guitarras', name: 'Guitarras', blurb: 'Eléctricas, acústicas y clásicas', art: 'electric', tone: 'sunburst', size: 'lg' },
  { id: 'amplificadores', name: 'Amplificadores', blurb: 'De lámparas, de transistores y para practicar', art: 'amp', tone: 'natural', size: 'md' },
  { id: 'bajos', name: 'Bajos', blurb: 'De 4 y 5 cuerdas', art: 'bass', tone: 'negro', size: 'sm' },
  { id: 'teclados', name: 'Teclados', blurb: 'Pianos digitales y sintetizadores', art: 'keys', tone: 'natural', size: 'sm' },
  { id: 'bateria', name: 'Batería', blurb: 'Acústica, electrónica y percusiones', art: 'drum', tone: 'sunburst', size: 'md' },
  { id: 'accesorios', name: 'Accesorios', blurb: 'Cuerdas, pedales, cables y estuches', art: 'pedal', tone: 'verde', size: 'md' },
];

export interface Product {
  id: string;
  name: string;
  detail: string;
  price: number;
  oldPrice?: number;
  category: CategoryId;
  art: ArtKind;
  tone: ArtTone;
  badge?: string;
  featured?: boolean;
}

export const PRODUCTS: Product[] = [
  // Guitarras
  { id: 'sunburst-60', name: 'Guitarra eléctrica Sunburst 60', detail: 'Mástil de maple y tres micrófonos sencillos', price: 12490, category: 'guitarras', art: 'electric', tone: 'sunburst', badge: 'Nueva', featured: true },
  { id: 'cedro-clasica', name: 'Guitarra acústica Cedro', detail: 'Tapa de cedro macizo y cuerdas de nailon', price: 5890, category: 'guitarras', art: 'acoustic', tone: 'natural', featured: true },
  { id: 'surf-verde', name: 'Guitarra eléctrica Surf Verde', detail: 'Cuerpo de aliso y mástil atornillado', price: 10990, oldPrice: 12900, category: 'guitarras', art: 'electric', tone: 'verde', badge: '-15%', featured: true },
  { id: 'perla-blanca', name: 'Guitarra eléctrica Perla', detail: 'Cuerpo blanco y golpeador de carey', price: 8950, category: 'guitarras', art: 'electric', tone: 'blanco' },
  { id: 'noche-negra', name: 'Guitarra eléctrica Noche', detail: 'Doble micrófono y puente fijo', price: 9490, category: 'guitarras', art: 'electric', tone: 'negro' },
  { id: 'sol-electroacustica', name: 'Guitarra electroacústica Sol', detail: 'Preamplificador con afinador integrado', price: 7990, category: 'guitarras', art: 'acoustic', tone: 'sunburst', badge: 'Nueva' },
  { id: 'estudiante-clasica', name: 'Guitarra clásica Estudiante', detail: 'Cuerdas de nailon y tamaño 4/4', price: 2490, category: 'guitarras', art: 'acoustic', tone: 'natural' },

  // Bajos
  { id: 'precision-4', name: 'Bajo eléctrico de 4 cuerdas', detail: 'Cuerpo negro mate y mástil de maple', price: 9750, category: 'bajos', art: 'bass', tone: 'negro', featured: true },
  { id: 'grave-5', name: 'Bajo eléctrico de 5 cuerdas', detail: 'Micrófonos activos y ecualizador de tres bandas', price: 12400, category: 'bajos', art: 'bass', tone: 'sunburst' },
  { id: 'viaje-corto', name: 'Bajo compacto Viaje', detail: 'Escala corta, ideal para ensayar', price: 6890, category: 'bajos', art: 'bass', tone: 'blanco' },

  // Amplificadores
  { id: 'tweed-20', name: 'Amplificador de lámparas 20 W', detail: 'Forro tweed y reverberación de resortes', price: 14900, oldPrice: 16900, category: 'amplificadores', art: 'amp', tone: 'natural', badge: '-12%', featured: true },
  { id: 'practica-10', name: 'Amplificador de práctica 10 W', detail: 'Entrada para audífonos y canal limpio', price: 1990, category: 'amplificadores', art: 'amp', tone: 'natural' },
  { id: 'escenario-50', name: 'Combo de escenario 50 W', detail: 'Dos canales y reverberación digital', price: 8490, category: 'amplificadores', art: 'amp', tone: 'natural', badge: 'Nuevo' },

  // Teclados
  { id: 'estudio-61', name: 'Teclado de 61 teclas', detail: 'Teclas sensibles al toque y 300 sonidos', price: 6320, category: 'teclados', art: 'keys', tone: 'natural', featured: true },
  { id: 'piano-88', name: 'Piano digital de 88 teclas', detail: 'Teclas con peso y pedal incluido', price: 15900, category: 'teclados', art: 'keys', tone: 'natural' },
  { id: 'midi-25', name: 'Controlador MIDI de 25 teclas', detail: 'Pads y perillas asignables', price: 2790, category: 'teclados', art: 'keys', tone: 'negro' },

  // Batería
  { id: 'tarola-14', name: 'Tarola de maple de 14 pulgadas', detail: 'Casco de 10 capas y aros de acero', price: 3290, category: 'bateria', art: 'drum', tone: 'sunburst' },
  { id: 'tom-piso-16', name: 'Tom de piso de 16 pulgadas', detail: 'Acabado natural y patas incluidas', price: 3890, category: 'bateria', art: 'drum', tone: 'natural' },
  { id: 'practica-12', name: 'Redoblante de práctica de 12 pulgadas', detail: 'Parche de goma que no hace ruido', price: 1490, oldPrice: 1660, category: 'bateria', art: 'drum', tone: 'negro', badge: '-10%' },

  // Accesorios
  { id: 'calle-od', name: 'Pedal de overdrive Calle', detail: 'Distorsión cálida y true bypass', price: 1890, category: 'accesorios', art: 'pedal', tone: 'verde', badge: 'Quedan 3', featured: true },
  { id: 'cuerdas-010', name: 'Cuerdas para eléctrica .010 (3 juegos)', detail: 'Níquel, calibres del 10 al 46', price: 290, category: 'accesorios', art: 'strings', tone: 'sunburst', featured: true },
  { id: 'eco-delay', name: 'Pedal de delay Eco', detail: 'Hasta 800 ms y tap tempo', price: 2190, category: 'accesorios', art: 'pedal', tone: 'sunburst' },
  { id: 'fuzz-ladrido', name: 'Pedal de fuzz Ladrido', detail: 'Saturación espesa y perilla de tono', price: 1690, category: 'accesorios', art: 'pedal', tone: 'negro' },
  { id: 'cuerdas-012', name: 'Cuerdas para acústica .012 (3 juegos)', detail: 'Bronce fosforado, calibres del 12 al 53', price: 320, category: 'accesorios', art: 'strings', tone: 'natural' },
  { id: 'cuerdas-bajo', name: 'Cuerdas para bajo .045 (juego)', detail: 'Acero inoxidable, 4 cuerdas', price: 540, category: 'accesorios', art: 'strings', tone: 'verde' },
];

export const productById = (id: string): Product | undefined => PRODUCTS.find((p) => p.id === id);

export const categoryById = (id: string | undefined): Category | undefined => CATEGORIES.find((c) => c.id === id);

export const countByCategory = (id: CategoryId): number => PRODUCTS.filter((p) => p.category === id).length;

// Quita acentos y mayúsculas para que "bateria" encuentre "Batería"
const normalize = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

export function searchProducts(list: Product[], query: string): Product[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return list;
  return list.filter((product) => {
    const haystack = normalize(`${product.name} ${product.detail} ${categoryById(product.category)?.name ?? ''}`);
    return terms.every((term) => haystack.includes(term));
  });
}

const priceFormat = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
});

export const formatPrice = (value: number): string => priceFormat.format(value);
