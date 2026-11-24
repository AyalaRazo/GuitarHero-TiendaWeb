import { categoryById, normalize } from '../data/catalog';
import type { Product } from '../data/catalog';

/*
  Sugerencias de la barra de búsqueda.
  Puntúa cada producto: el nombre que empieza con lo escrito vale más que una palabra del nombre,
  y esto más que una coincidencia en la descripción o la categoría. Ignora acentos y mayúsculas.
*/

export interface Suggestion {
  product: Product;
  score: number;
}

export function suggestProducts(products: Product[], query: string, limit = 6): Suggestion[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const scored: Suggestion[] = [];
  for (const product of products) {
    const name = normalize(product.name);
    const rest = normalize(`${product.detail} ${categoryById(product.category)?.name ?? ''}`);
    const words = name.split(/\s+/);
    let score = 0;
    let matchesAll = true;

    for (const term of terms) {
      if (name.startsWith(term)) score += 10;
      else if (words.some((word) => word.startsWith(term))) score += 6;
      else if (name.includes(term)) score += 4;
      else if (rest.includes(term)) score += 1;
      else {
        matchesAll = false;
        break;
      }
    }
    if (matchesAll) scored.push({ product, score });
  }

  return scored.sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name, 'es')).slice(0, limit);
}

/* Parte el texto en pedazos para resaltar lo que coincide con lo escrito */
export function highlightParts(text: string, query: string): { text: string; match: boolean }[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [{ text, match: false }];

  const flat = normalize(text);
  // normalize no cambia la longitud de las letras sin acento, pero sí quita marcas: se alinea carácter a carácter
  const aligned = [...text].map((char) => normalize(char));
  if (aligned.join('') !== flat) return [{ text, match: false }];

  const marks = new Array<boolean>(text.length).fill(false);
  for (const term of terms) {
    let from = 0;
    for (;;) {
      const at = flat.indexOf(term, from);
      if (at === -1) break;
      for (let i = at; i < at + term.length; i += 1) marks[i] = true;
      from = at + term.length;
    }
  }

  const parts: { text: string; match: boolean }[] = [];
  [...text].forEach((char, i) => {
    const last = parts[parts.length - 1];
    if (last && last.match === marks[i]) last.text += char;
    else parts.push({ text: char, match: marks[i] });
  });
  return parts;
}
