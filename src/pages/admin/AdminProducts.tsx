import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductArt } from '../../components/ProductArt';
import { CATEGORIES, PRODUCTS, categoryById, formatPrice, searchProducts } from '../../data/catalog';
import type { CategoryId, Product } from '../../data/catalog';
import {
  btn,
  btnPeligro,
  field,
  fieldInput,
  fieldLabel,
  linkButton,
  paper,
  paperMuted,
  paperPad,
  paperTitle,
  status,
  tituloSeccion,
} from '../../ui';

const TD_BASE = 'border-b border-dashed border-palorosa/35 px-4 py-[0.85rem] align-middle group-last/row:border-b-0 max-md:border-0 max-md:px-0 max-md:py-[0.4rem]';
const TD = `${TD_BASE} max-md:block`;
const TD_LABELED = `${TD_BASE} max-md:flex max-md:items-baseline max-md:justify-between max-md:gap-4 max-md:before:text-sm max-md:before:text-tinta-suave max-md:before:content-[attr(data-label)]`;
const TH = 'border-b-2 border-palorosa px-4 py-[0.9rem] text-left text-sm font-semibold whitespace-nowrap text-tinta-suave';

export function AdminProducts() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'todas' | CategoryId>('todas');
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // El diálogo nativo se abre y se cierra según el producto elegido
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (toDelete && !dialog.open) dialog.showModal();
    if (!toDelete && dialog.open) dialog.close();
  }, [toDelete]);

  const inCategory = category === 'todas' ? PRODUCTS : PRODUCTS.filter((product) => product.category === category);
  const rows = searchProducts(inCategory, query);

  const featured = PRODUCTS.filter((product) => product.featured).length;
  const onSale = PRODUCTS.filter((product) => product.oldPrice).length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <h1 className={tituloSeccion}>Panel administrativo</h1>
          <p className="mt-2 text-lg text-tinta-suave">Agrega, edita y quita los productos de la tienda.</p>
        </div>
        <Link className={btn('oscuro')} to="/cuenta/admin/productos/nuevo">
          Nuevo producto
        </Link>
      </div>

      <dl className={`${paper} mt-6 grid grid-cols-3 [&_dd]:font-display [&_dd]:text-[2rem] [&_dd]:leading-[1.1] [&_dt]:text-sm [&_dt]:text-tinta-suave`}>
        <div className="px-5 py-4 not-first:border-l not-first:border-dashed not-first:border-palorosa/35 max-md:px-3">
          <dt>Productos</dt>
          <dd>{PRODUCTS.length}</dd>
        </div>
        <div className="px-5 py-4 not-first:border-l not-first:border-dashed not-first:border-palorosa/35 max-md:px-3">
          <dt>Destacados</dt>
          <dd>{featured}</dd>
        </div>
        <div className="px-5 py-4 not-first:border-l not-first:border-dashed not-first:border-palorosa/35 max-md:px-3">
          <dt>En oferta</dt>
          <dd>{onSale}</dd>
        </div>
      </dl>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)_14rem] gap-4 max-md:grid-cols-1">
        <div className={field}>
          <label className={fieldLabel} htmlFor="a-buscar">
            Buscar producto
          </label>
          <input
            id="a-buscar"
            className={fieldInput}
            type="search"
            placeholder="Nombre o descripción"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className={field}>
          <label className={fieldLabel} htmlFor="a-categoria">
            Categoría
          </label>
          <select
            id="a-categoria"
            className={fieldInput}
            value={category}
            onChange={(event) => setCategory(event.target.value as 'todas' | CategoryId)}
          >
            <option value="todas">Todas</option>
            {CATEGORIES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-5 font-semibold" aria-live="polite">
        {rows.length} {rows.length === 1 ? 'producto' : 'productos'}
      </p>

      {rows.length === 0 ? (
        <div className={`${paperPad} mt-4 grid max-w-[34rem] justify-items-start gap-3`}>
          <h2 className={paperTitle}>No hay productos con ese filtro</h2>
          <p className={paperMuted}>Prueba con otra palabra o elige otra categoría.</p>
          <button
            className={btn('oscuro')}
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('todas');
            }}
          >
            Quitar filtros
          </button>
        </div>
      ) : (
        <div className={`${paper} mt-3 overflow-x-auto`}>
          <table className="w-full border-collapse">
            <caption className="sr-only">Productos de la tienda</caption>
            <thead className="max-md:sr-only">
              <tr>
                <th className={TH} scope="col">Producto</th>
                <th className={TH} scope="col">Categoría</th>
                <th className={TH} scope="col">Precio</th>
                <th className={TH} scope="col">Estado</th>
                <th className={TH} scope="col">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((product) => (
                <tr className="group/row max-md:block max-md:border-b-2 max-md:border-palorosa max-md:px-4 max-md:pt-2 max-md:pb-3 max-md:last:border-b-0" key={product.id}>
                  <td className={TD}>
                    <div className="flex min-w-60 items-center gap-[0.85rem] max-md:min-w-0">
                    <ProductArt
                      kind={product.art}
                      tone={product.tone}
                      className="grid size-14 flex-none place-items-center rounded-[3px] bg-tweed p-[0.35rem] [&_svg]:size-full"
                    />
                    <div>
                      <p className="leading-[1.3] font-semibold">{product.name}</p>
                      <p className="text-xs leading-[1.35] text-tinta-suave">{product.detail}</p>
                    </div>
                    </div>
                  </td>
                  <td className={TD_LABELED} data-label="Categoría">{categoryById(product.category)?.name}</td>
                  <td data-label="Precio" className={`${TD_LABELED} font-semibold whitespace-nowrap`}>
                    {product.oldPrice && <span className="block text-xs font-normal text-tinta-suave line-through max-md:inline max-md:mr-2">{formatPrice(product.oldPrice)}</span>}
                    {formatPrice(product.price)}
                  </td>
                  <td className={TD_LABELED} data-label="Estado">
                    <span className="flex flex-wrap gap-[0.35rem]">
                      {product.featured && <span className={status('taller')}>Destacado</span>}
                      {product.oldPrice && <span className={status('enviado')}>En oferta</span>}
                      {!product.featured && !product.oldPrice && <span className={paperMuted}>Publicado</span>}
                    </span>
                  </td>
                  <td className={`${TD} whitespace-nowrap max-md:pt-[0.6rem] [&>*+*]:ml-4`}>
                    <Link className={linkButton} to={`/cuenta/admin/productos/${product.id}`}>
                      Editar
                      <span className="sr-only"> {product.name}</span>
                    </Link>
                    <button className={`${linkButton} text-sunburst-rojo`} type="button" onClick={() => setToDelete(product)}>
                      Eliminar
                      <span className="sr-only"> {product.name}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <dialog
        className={`${paper} m-auto w-[min(28rem,calc(100vw-2rem))] border-0 p-7 backdrop:bg-pared-hondo/70`}
        ref={dialogRef} 
        onClose={() => setToDelete(null)}
        aria-labelledby="dialog-title"
      >
        <h2 className={paperTitle} id="dialog-title">
          ¿Eliminar este producto?
        </h2>
        <p className="mt-3 mb-1 font-semibold">{toDelete?.name}</p>
        <p className={paperMuted}>Deja de aparecer en la tienda. Esta acción no se puede deshacer.</p>
        <div className="mt-6 flex flex-wrap justify-end gap-[0.6rem]">
          <button className={btn('lineaOscura')} type="button" onClick={() => setToDelete(null)}>
            Cancelar
          </button>
          <button className={btnPeligro} type="button" onClick={() => setToDelete(null)}>
            Eliminar producto
          </button>
        </div>
      </dialog>
    </>
  );
}
