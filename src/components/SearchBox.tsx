import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { categoryById, formatPrice, searchProducts } from '../data/catalog';
import { highlightParts, suggestProducts } from '../lib/search';
import { useProducts } from '../store/products';
import { ProductArt } from './ProductArt';
import { SearchIcon } from './Icons';

const MAX_SUGGESTIONS = 6;

function Highlight({ text, query }: { text: string; query: string }) {
  return (
    <>
      {highlightParts(text, query).map((part, index) =>
        part.match ? (
          <mark className="rounded-[2px] bg-laton/45 text-inherit" key={index}>
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  );
}

/*
  Barra de búsqueda con sugerencias. Patrón "combobox" de ARIA:
  el foco se queda en el campo y las flechas mueven la opción activa.
  Escribir una sola letra ya sugiere productos; Enter sin opción activa busca en todo el catálogo.
*/
export function SearchBox() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const urlQuery = params.get('q') ?? '';
  const products = useProducts();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(urlQuery);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  // Si la búsqueda cambia desde la dirección (por ejemplo al quitarla), el campo la sigue
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  const trimmed = query.trim();
  const suggestions = useMemo(() => suggestProducts(products, trimmed, MAX_SUGGESTIONS), [products, trimmed]);
  const totalMatches = useMemo(() => (trimmed ? searchProducts(products, trimmed).length : 0), [products, trimmed]);

  // Opciones: cada producto sugerido y, al final, "ver todos los resultados"
  const optionCount = suggestions.length > 0 ? suggestions.length + 1 : 0;
  const showPanel = open && trimmed.length > 0;

  // Cierra el panel al hacer clic fuera
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const close = () => {
    setOpen(false);
    setActive(-1);
  };

  const goToResults = () => {
    close();
    navigate(trimmed ? `/productos?q=${encodeURIComponent(trimmed)}` : '/productos');
  };

  const goToOption = (index: number) => {
    if (index >= 0 && index < suggestions.length) {
      close();
      navigate(`/producto/${suggestions[index].product.id}`);
    } else {
      goToResults();
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (active >= 0) goToOption(active);
    else goToResults();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      if (open) {
        event.preventDefault();
        close();
      }
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (optionCount === 0) return;
      event.preventDefault();
      setOpen(true);
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActive((current) => {
        if (current === -1) return step === 1 ? 0 : optionCount - 1;
        return (current + step + optionCount) % optionCount;
      });
    }
  };

  const optionId = (index: number) => `${listId}-${index}`;

  return (
    <div
      className="relative w-full max-w-[34rem] justify-self-center max-[52rem]:order-last max-[52rem]:col-span-full max-[52rem]:max-w-none"
      ref={rootRef}
    >
      <form className="flex" role="search" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="buscar">
          Buscar en la tienda
        </label>
        <input
          id="buscar"
          className="min-w-0 flex-1 rounded-l-md border-2 border-transparent bg-hueso px-4 py-[0.7rem] text-palorosa placeholder:text-tinta-suave"
          type="search"
          role="combobox"
          aria-expanded={showPanel && optionCount > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showPanel && active >= 0 ? optionId(active) : undefined}
          autoComplete="off"
          placeholder="Busca guitarras, cuerdas, pedales"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="grid w-12 place-items-center rounded-r-md bg-laton text-palorosa transition-colors duration-200 hover:bg-laton-claro"
          type="submit"
          aria-label="Buscar"
        >
          <SearchIcon className="size-[1.3rem]" />
        </button>
      </form>

      {showPanel && (
        <div className="absolute top-full right-0 left-0 z-40 mt-2 overflow-hidden rounded-md bg-hueso text-palorosa shadow-[0_18px_30px_rgba(0,0,0,0.4)]">
          {optionCount === 0 ? (
            <p className="px-4 py-4" role="status">
              No encontramos nada con «{trimmed}». Prueba con otra palabra, como «guitarra» o «cuerdas».
            </p>
          ) : (
            <>
              {/* Las opciones no reciben foco: el foco queda en el campo y aria-activedescendant señala la activa */}
              <ul
                id={listId}
                role="listbox"
                aria-label="Productos sugeridos"
                onMouseDown={(event) => event.preventDefault()}
              >
                {suggestions.map(({ product }, index) => (
                  <li
                    id={optionId(index)}
                    key={product.id}
                    role="option"
                    aria-selected={active === index}
                    className={`flex cursor-pointer items-center gap-3 px-3 py-2 ${active === index ? 'bg-laton/30' : 'hover:bg-palorosa/8'}`}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => goToOption(index)}
                  >
                    <ProductArt
                      kind={product.art}
                      tone={product.tone}
                      image={product.image}
                      className="grid size-11 flex-none place-items-center rounded-[3px] bg-tweed p-[0.25rem] [&_img]:size-full [&_svg]:size-full"
                    />
                    <span className="grid min-w-0 flex-1">
                      <span className="truncate font-semibold">
                        <Highlight text={product.name} query={trimmed} />
                      </span>
                      <span className="truncate text-xs text-tinta-suave">{categoryById(product.category)?.name}</span>
                    </span>
                    <span className="flex-none font-semibold">{formatPrice(product.price)}</span>
                  </li>
                ))}
                <li
                  id={optionId(suggestions.length)}
                  role="option"
                  aria-selected={active === suggestions.length}
                  className={`cursor-pointer border-t border-dashed border-palorosa/35 px-4 py-3 font-semibold ${active === suggestions.length ? 'bg-laton/30' : 'hover:bg-palorosa/8'}`}
                  onMouseEnter={() => setActive(suggestions.length)}
                  onClick={goToResults}
                >
                  Ver {totalMatches === 1 ? 'el resultado' : `los ${totalMatches} resultados`} de «{trimmed}»
                </li>
              </ul>
              <p className="sr-only" role="status">
                {totalMatches} {totalMatches === 1 ? 'sugerencia' : 'sugerencias'} disponibles. Usa las flechas para
                moverte.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
