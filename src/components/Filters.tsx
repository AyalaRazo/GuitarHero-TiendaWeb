import { useState } from 'react';
import type { CategoryId } from '../data/catalog';
import { FACETS } from '../data/facets';
import { check, fieldInput, linkButton, paper, paperTitle } from '../ui';

interface FiltersProps {
  categoryId?: CategoryId;
  open: boolean;
}

const FACET = 'min-w-0 border-b border-dashed border-palorosa/35 py-[1.1rem] last:border-b-0 last:pb-0';
const FACET_TITLE = 'mb-[0.6rem] p-0 font-bold';

/* Hoja de filtros: cada pasillo tiene los suyos. Por ahora solo cambian de estado en pantalla. */
export function Filters({ categoryId, open }: FiltersProps) {
  const facets = FACETS[categoryId ?? 'todo'];
  const [checked, setChecked] = useState<string[]>([]);
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  const toggle = (key: string) =>
    setChecked((current) => (current.includes(key) ? current.filter((k) => k !== key) : [...current, key]));

  const clear = () => {
    setChecked([]);
    setMin('');
    setMax('');
  };

  const activeCount = checked.length + (min || max ? 1 : 0);

  return (
    <aside id="filtros" className={`${paper} sticky top-36 max-h-[calc(100vh-10rem)] overflow-y-auto px-5 py-6 max-lg:static max-lg:max-h-none ${open ? 'max-lg:block' : 'max-lg:hidden'}`} aria-label="Filtros">
      <div className="flex items-baseline justify-between gap-4 border-b-2 border-palorosa pb-4">
        <h2 className={paperTitle}>Filtros</h2>
        <button className={linkButton} type="button" onClick={clear} disabled={activeCount === 0}>
          Limpiar
        </button>
      </div>

      {facets.map((facet) => (
        <fieldset className={FACET} key={facet.id}>
          <legend className={FACET_TITLE}>{facet.label}</legend>
          <div className="grid gap-2">
            {facet.options.map((option) => {
              const key = `${facet.id}:${option}`;
              return (
                <label className={check} key={key}>
                  <input type="checkbox" checked={checked.includes(key)} onChange={() => toggle(key)} />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      <fieldset className={FACET}>
        <legend className={FACET_TITLE}>Precio</legend>
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <label>
            <span className="sr-only">Precio mínimo</span>
            <input
              className={fieldInput}
              inputMode="numeric"
              placeholder="Mínimo"
              value={min}
              onChange={(event) => setMin(event.target.value)}
            />
          </label>
          <span aria-hidden="true">a</span>
          <label>
            <span className="sr-only">Precio máximo</span>
            <input
              className={fieldInput}
              inputMode="numeric"
              placeholder="Máximo"
              value={max}
              onChange={(event) => setMax(event.target.value)}
            />
          </label>
        </div>
      </fieldset>
    </aside>
  );
}
