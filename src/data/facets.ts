import type { CategoryId } from './catalog';

// Filtros de cada pasillo. Por ahora son solo visuales.

export interface Facet {
  id: string;
  label: string;
  options: string[];
}

const CONDICION: Facet = {
  id: 'condicion',
  label: 'Condición',
  options: ['Nuevo', 'En oferta', 'Envío gratis'],
};

export const FACETS: Record<CategoryId | 'todo', Facet[]> = {
  todo: [
    { id: 'nivel', label: 'Para quién', options: ['Quien empieza', 'Quien ya toca', 'Quien toca en vivo'] },
    CONDICION,
  ],
  guitarras: [
    { id: 'tipo', label: 'Tipo', options: ['Eléctrica', 'Acústica', 'Electroacústica', 'Clásica'] },
    { id: 'acabado', label: 'Acabado', options: ['Sunburst', 'Negro', 'Blanco', 'Verde', 'Natural'] },
    { id: 'cuerdas', label: 'Cuerdas', options: ['6 cuerdas', '7 cuerdas', '12 cuerdas'] },
    CONDICION,
  ],
  bajos: [
    { id: 'cuerdas', label: 'Cuerdas', options: ['4 cuerdas', '5 cuerdas', '6 cuerdas'] },
    { id: 'microfonos', label: 'Micrófonos', options: ['Pasivos', 'Activos'] },
    { id: 'acabado', label: 'Acabado', options: ['Sunburst', 'Negro', 'Blanco'] },
    CONDICION,
  ],
  amplificadores: [
    { id: 'potencia', label: 'Potencia', options: ['Hasta 15 W', 'De 15 a 50 W', 'Más de 50 W'] },
    { id: 'tecnologia', label: 'Tecnología', options: ['De lámparas', 'De transistores', 'Modelado digital'] },
    { id: 'uso', label: 'Uso', options: ['Práctica', 'Estudio', 'Escenario'] },
    CONDICION,
  ],
  teclados: [
    { id: 'teclas', label: 'Teclas', options: ['25 teclas', '49 teclas', '61 teclas', '88 teclas'] },
    { id: 'tipo', label: 'Tipo', options: ['Piano digital', 'Sintetizador', 'Controlador MIDI'] },
    CONDICION,
  ],
  bateria: [
    { id: 'tipo', label: 'Tipo', options: ['Acústica', 'Electrónica', 'Percusiones'] },
    { id: 'pieza', label: 'Pieza', options: ['Tarola', 'Toms', 'Platillos', 'Pedales'] },
    CONDICION,
  ],
  accesorios: [
    { id: 'tipo', label: 'Tipo', options: ['Pedales', 'Cuerdas', 'Cables', 'Estuches', 'Afinadores'] },
    { id: 'para', label: 'Para', options: ['Guitarra eléctrica', 'Guitarra acústica', 'Bajo'] },
    CONDICION,
  ],
};
