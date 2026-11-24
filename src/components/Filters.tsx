import { countActive, EMPTY_FILTERS } from '../lib/filters';
import type { Facet, FilterState } from '../lib/filters';
import { check, fieldInput, linkButton, paper, paperTitle } from '../ui';

interface FiltersProps {
  facets: Facet[];
  state: FilterState;
  onChange: (state: FilterState) => void;
  open: boolean;
}

const FACET = 'min-w-0 border-b border-dashed border-palorosa/35 py-[1.1rem] last:border-b-0 last:pb-0';
const FACET_TITLE = 'mb-[0.6rem] p-0 font-bold';

/* Hoja de filtros: se arma con los productos del pasillo y cambia el listado al marcar cada opción */
export function Filters({ facets, state, onChange, open }: FiltersProps) {
  const toggle = (key: string) =>
    onChange({
      ...state,
      checked: state.checked.includes(key) ? state.checked.filter((item) => item !== key) : [...state.checked, key],
    });

  const active = countActive(state);

  return (
    <aside
      id="filtros"
      className={`${paper} sticky top-36 max-h-[calc(100vh-10rem)] overflow-y-auto px-5 py-6 max-lg:static max-lg:max-h-none ${open ? 'max-lg:block' : 'max-lg:hidden'}`}
      aria-label="Filtros"
    >
      <div className="flex items-baseline justify-between gap-4 border-b-2 border-palorosa pb-4">
        <h2 className={paperTitle}>Filtros</h2>
        <button className={linkButton} type="button" onClick={() => onChange(EMPTY_FILTERS)} disabled={active === 0}>
          Limpiar
        </button>
      </div>

      {facets.map((facet) => (
        <fieldset className={FACET} key={facet.id}>
          <legend className={FACET_TITLE}>{facet.label}</legend>
          <div className="grid gap-2">
            {facet.options.map((option) => (
              <label className={check} key={option.key}>
                <input type="checkbox" checked={state.checked.includes(option.key)} onChange={() => toggle(option.key)} />
                <span>
                  {option.label} <span className="text-tinta-suave">({option.count})</span>
                </span>
              </label>
            ))}
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
              value={state.min}
              onChange={(event) => onChange({ ...state, min: event.target.value.replace(/\D/g, '') })}
            />
          </label>
          <span aria-hidden="true">a</span>
          <label>
            <span className="sr-only">Precio máximo</span>
            <input
              className={fieldInput}
              inputMode="numeric"
              placeholder="Máximo"
              value={state.max}
              onChange={(event) => onChange({ ...state, max: event.target.value.replace(/\D/g, '') })}
            />
          </label>
        </div>
      </fieldset>
    </aside>
  );
}

