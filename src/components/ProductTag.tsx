import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../data/catalog';
import type { Product } from '../data/catalog';
import { addToCart } from '../store/cart';
import { btn } from '../ui';
import { FavoriteButton } from './FavoriteButton';
import { ProductArt } from './ProductArt';

interface ProductTagProps {
  product: Product;
  /* Vista previa en el panel administrativo: sin enlaces ni botones activos */
  preview?: boolean;
}

/* Cada producto cuelga de la pared con una etiqueta de cartulina */
export function ProductTag({ product, preview = false }: ProductTagProps) {
  const { id, name, detail, price, oldPrice, art, tone, badge, image } = product;
  const [added, setAdded] = useState(false);

  // El aviso "Agregado" dura un momento y vuelve al botón normal
  useEffect(() => {
    if (!added) return undefined;
    const timer = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [added]);

  return (
    <article className="group/tag relative flex flex-col pt-[0.45rem]">
      {/* Gancho de latón en el tablero */}
      <span
        className="absolute top-0 left-1/2 z-[3] -ml-[0.45rem] size-[0.9rem] rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--color-laton-claro),var(--color-laton)_60%,#7a5a1e)] shadow-[0_2px_3px_rgba(0,0,0,0.55)]"
        aria-hidden="true"
      />
      {/* La sombra va aquí porque el clip-path del cuerpo recortaría una sombra propia */}
      <div
        className={`relative flex flex-1 origin-[50%_0] flex-col drop-shadow-[0_10px_8px_rgba(0,0,0,0.45)] group-hover/tag:[animation:swing_1.1s_ease-out] group-focus-within/tag:[animation:swing_1.1s_ease-out]`}
      >
        {/* Cordón que atraviesa el ojal */}
        <span className="absolute top-0 left-1/2 z-[2] -ml-px h-[2.9rem] w-[2px] bg-tweed" aria-hidden="true" />
        <div className="relative mt-[1.6rem] flex flex-1 flex-col gap-[0.85rem] bg-tweed px-[0.9rem] pt-[1.9rem] pb-[0.9rem] text-palorosa [clip-path:polygon(14%_0,86%_0,100%_7%,100%_100%,0_100%,0_7%)] before:absolute before:top-[0.6rem] before:left-1/2 before:-ml-[0.7rem] before:size-[1.4rem] before:rounded-full before:border-[0.3rem] before:border-hueso before:bg-pared-hondo before:content-[''] max-sm:px-[0.65rem]">
          {!preview && <FavoriteButton className="absolute top-[3.2rem] left-[0.6rem] z-[3]" productId={id} productName={name} />}
          {badge && (
            <span className="absolute top-[3.2rem] right-[0.6rem] z-[1] grid size-[3.7rem] rotate-[10deg] place-items-center rounded-full bg-sunburst-rojo p-[0.2rem] text-center font-display text-[0.72rem] leading-none text-hueso">
              {badge}
            </span>
          )}

          <ProductArt
            kind={art}
            tone={tone}
            image={image}
            className="grid aspect-[4/3.3] place-items-center rounded-[3px] bg-hueso p-[0.8rem] [&_svg]:h-full [&_svg]:w-auto [&_svg]:max-w-full"
          />

          <div className="grid gap-1">
            <h3 className="text-sm leading-[1.3] font-semibold">
              {/* Toda la etiqueta es clicable; el botón queda por encima */}
              {preview ? (
                name
              ) : (
                <Link
                  className="after:absolute after:inset-0 after:content-[''] hover:underline hover:underline-offset-[0.2em]"
                  to={`/producto/${id}`}
                >
                  {name}
                </Link>
              )}
            </h3>
            <p className="text-xs leading-[1.4] text-tinta-suave">{detail}</p>
          </div>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-[0.6rem]">
            <p className="grid">
              {oldPrice && (
                <span className="text-xs text-tinta-suave line-through">
                  <span className="sr-only">Antes </span>
                  {formatPrice(oldPrice)}
                </span>
              )}
              <span className="font-display text-[1.5rem] leading-[1.1] max-sm:text-[1.25rem]">
                {formatPrice(price)}
              </span>
            </p>
            <button
              className={`${btn('oscuro', { sm: true })} relative z-[2] max-sm:w-full`}
              type="button"
              disabled={preview}
              onClick={() => {
                addToCart(id);
                setAdded(true);
              }}
            >
              {added ? 'Agregado' : 'Agregar'}
            </button>
            <span className="sr-only" role="status">
              {added ? `${name} se agregó al carrito` : ''}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
