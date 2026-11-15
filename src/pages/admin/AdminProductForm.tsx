import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProductTag } from '../../components/ProductTag';
import { CATEGORIES, productById } from '../../data/catalog';
import type { ArtKind, ArtTone, CategoryId, Product } from '../../data/catalog';
import { btn, check, field, fieldHint, fieldInput, fieldLabel, fieldWide, formGrid, paperMuted, paperPad, paperTitle, pegboard, tituloSeccion } from '../../ui';

const BACK = 'mb-3 inline-block font-semibold underline decoration-laton decoration-2 underline-offset-[0.25em]';

const CATEGORY_ART: Record<CategoryId, ArtKind> = {
  guitarras: 'electric',
  bajos: 'bass',
  amplificadores: 'amp',
  teclados: 'keys',
  bateria: 'drum',
  accesorios: 'pedal',
};

const TONES: { id: ArtTone; label: string }[] = [
  { id: 'sunburst', label: 'Sunburst' },
  { id: 'negro', label: 'Negro' },
  { id: 'blanco', label: 'Blanco' },
  { id: 'verde', label: 'Verde' },
  { id: 'natural', label: 'Natural' },
];

interface FormState {
  name: string;
  detail: string;
  category: CategoryId;
  tone: ArtTone;
  price: string;
  oldPrice: string;
  badge: string;
  featured: boolean;
}

const EMPTY: FormState = {
  name: '',
  detail: '',
  category: 'guitarras',
  tone: 'sunburst',
  price: '',
  oldPrice: '',
  badge: '',
  featured: false,
};

const fromProduct = (product: Product): FormState => ({
  name: product.name,
  detail: product.detail,
  category: product.category,
  tone: product.tone,
  price: String(product.price),
  oldPrice: product.oldPrice ? String(product.oldPrice) : '',
  badge: product.badge ?? '',
  featured: Boolean(product.featured),
});

/* La clave reinicia el formulario al pasar de "nuevo" a editar, o de un producto a otro */
export function AdminProductForm() {
  const { id } = useParams();
  const editing = id ? productById(id) : undefined;

  if (id && !editing) {
    return (
      <div className={`${paperPad} mt-4 grid max-w-[34rem] justify-items-start gap-3`}>
        <h1 className={paperTitle}>No encontramos ese producto</h1>
        <p className={paperMuted}>Puede que ya lo hayan eliminado.</p>
        <Link className={btn('oscuro')} to="/cuenta/admin">
          Volver a productos
        </Link>
      </div>
    );
  }

  return <ProductForm key={id ?? 'nuevo'} editing={editing} />;
}

function ProductForm({ editing }: { editing?: Product }) {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(editing ? fromProduct(editing) : EMPTY);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    navigate('/cuenta/admin');
  };

  // La etiqueta de la derecha se arma con lo que se va escribiendo
  const preview: Product = {
    id: 'vista-previa',
    name: form.name.trim() || 'Nombre del producto',
    detail: form.detail.trim() || 'Descripción corta del producto',
    price: Number(form.price) || 0,
    oldPrice: Number(form.oldPrice) || undefined,
    category: form.category,
    art: CATEGORY_ART[form.category],
    tone: form.tone,
    badge: form.badge.trim() || undefined,
    featured: form.featured,
  };

  return (
    <>
      <Link className={BACK} to="/cuenta/admin">
        Volver a productos
      </Link>
      <h1 className={tituloSeccion}>{editing ? 'Editar producto' : 'Nuevo producto'}</h1>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)_15rem] items-start gap-6 max-xl:grid-cols-1">
        <form className={paperPad} onSubmit={handleSubmit} noValidate>
          <div className={formGrid}>
            <div className={fieldWide}>
              <label className={fieldLabel} htmlFor="p-nombre">
                Nombre
              </label>
              <input
                id="p-nombre"
                className={fieldInput}
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
              />
            </div>

            <div className={fieldWide}>
              <label className={fieldLabel} htmlFor="p-detalle">
                Descripción corta
              </label>
              <input
                id="p-detalle"
                className={fieldInput}
                value={form.detail}
                onChange={(event) => update('detail', event.target.value)}
                aria-describedby="p-detalle-hint"
              />
              <p className={fieldHint} id="p-detalle-hint">
                Una línea. Aparece debajo del nombre en la etiqueta.
              </p>
            </div>

            <div className={field}>
              <label className={fieldLabel} htmlFor="p-categoria">
                Categoría
              </label>
              <select
                id="p-categoria"
                className={fieldInput}
                value={form.category}
                onChange={(event) => update('category', event.target.value as CategoryId)}
              >
                {CATEGORIES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={field}>
              <label className={fieldLabel} htmlFor="p-acabado">
                Acabado
              </label>
              <select
                id="p-acabado"
                className={fieldInput}
                value={form.tone}
                onChange={(event) => update('tone', event.target.value as ArtTone)}
              >
                {TONES.map((tone) => (
                  <option key={tone.id} value={tone.id}>
                    {tone.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={field}>
              <label className={fieldLabel} htmlFor="p-precio">
                Precio (MXN)
              </label>
              <input
                id="p-precio"
                className={fieldInput}
                inputMode="numeric"
                placeholder="0"
                value={form.price}
                onChange={(event) => update('price', event.target.value.replace(/[^\d]/g, ''))}
              />
            </div>

            <div className={field}>
              <label className={fieldLabel} htmlFor="p-anterior">
                Precio anterior (MXN)
              </label>
              <input
                id="p-anterior"
                className={fieldInput}
                inputMode="numeric"
                placeholder="Opcional"
                value={form.oldPrice}
                onChange={(event) => update('oldPrice', event.target.value.replace(/[^\d]/g, ''))}
                aria-describedby="p-anterior-hint"
              />
              <p className={fieldHint} id="p-anterior-hint">
                Llénalo solo si está en oferta.
              </p>
            </div>

            <div className={field}>
              <label className={fieldLabel} htmlFor="p-insignia">
                Insignia
              </label>
              <input
                id="p-insignia"
                className={fieldInput}
                placeholder="Nueva, -15%, Quedan 3"
                value={form.badge}
                onChange={(event) => update('badge', event.target.value)}
              />
            </div>

            <div className={`${field} content-end pb-[0.6rem]`}>
              <label className={check}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => update('featured', event.target.checked)}
                />
                <span>Mostrar en «Colgado en la pared esta semana»</span>
              </label>
            </div>

            <div className={fieldWide}>
              <span className={fieldLabel} id="p-foto-label">
                Foto del producto
              </span>
              <label
                className="relative grid cursor-pointer gap-[0.2rem] rounded-md border-2 border-dashed border-palorosa/45 p-5 transition-colors duration-200 hover:border-palorosa hover:bg-palorosa/5 has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-3 has-[input:focus-visible]:outline-laton-claro"
                aria-labelledby="p-foto-label"
              >
                <input className="absolute inset-0 cursor-pointer opacity-0" type="file" accept="image/png,image/jpeg" />
                <span className="font-semibold">Elige una imagen</span>
                <span className="text-sm text-tinta-suave">JPG o PNG, de al menos 1200 px. Mientras tanto se usa una ilustración.</span>
              </label>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3 border-t border-dashed border-palorosa/35 pt-5">
            <button className={btn('oscuro')} type="submit">
              {editing ? 'Guardar cambios' : 'Crear producto'}
            </button>
            <Link className={btn('lineaOscura')} to="/cuenta/admin">
              Cancelar
            </Link>
          </div>
        </form>

        <aside className="sticky top-36 max-xl:static max-xl:max-w-68" aria-label="Vista previa">
          <h2 className="mb-3 text-base font-semibold">Así se verá en la tienda</h2>
          <div className={`${pegboard} rounded-md px-4 pt-4 pb-5 text-hueso`}>
            <ProductTag product={preview} />
          </div>
        </aside>
      </div>
    </>
  );
}
