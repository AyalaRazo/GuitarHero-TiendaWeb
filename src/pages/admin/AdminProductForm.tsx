<<<<<<< HEAD
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

=======
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Field, FieldError, SelectField } from '../../components/Field';
import { ProductArt } from '../../components/ProductArt';
import { ProductTag } from '../../components/ProductTag';
import { ART_BY_CATEGORY, ART_LABEL, CATEGORIES, TONE_LABEL } from '../../data/catalog';
import type { ArtKind, ArtTone, CategoryId, Product } from '../../data/catalog';
import { focusFirstError } from '../../lib/forms';
import { prepareImage } from '../../lib/image';
import { hasErrors } from '../../lib/validate';
import { createProduct, findProduct, updateProduct, useProducts } from '../../store/products';
import {
  btn,
  check,
  field,
  fieldHint,
  fieldInput,
  fieldLabel,
  fieldWide,
  formGrid,
  linkButton,
  paperMuted,
  paperPad,
  paperTitle,
  pegboard,
  tituloSeccion,
} from '../../ui';

const TONES = Object.keys(TONE_LABEL) as ArtTone[];
const BACK = 'mb-3 inline-block font-semibold underline decoration-laton decoration-2 underline-offset-[0.25em]';

>>>>>>> remotes/origin/feat/admin
interface FormState {
  name: string;
  detail: string;
  category: CategoryId;
<<<<<<< HEAD
=======
  art: ArtKind;
>>>>>>> remotes/origin/feat/admin
  tone: ArtTone;
  price: string;
  oldPrice: string;
  badge: string;
  featured: boolean;
<<<<<<< HEAD
=======
  image: string;
>>>>>>> remotes/origin/feat/admin
}

const EMPTY: FormState = {
  name: '',
  detail: '',
  category: 'guitarras',
<<<<<<< HEAD
=======
  art: 'electric',
>>>>>>> remotes/origin/feat/admin
  tone: 'sunburst',
  price: '',
  oldPrice: '',
  badge: '',
  featured: false,
<<<<<<< HEAD
=======
  image: '',
>>>>>>> remotes/origin/feat/admin
};

const fromProduct = (product: Product): FormState => ({
  name: product.name,
  detail: product.detail,
  category: product.category,
<<<<<<< HEAD
=======
  art: product.art,
>>>>>>> remotes/origin/feat/admin
  tone: product.tone,
  price: String(product.price),
  oldPrice: product.oldPrice ? String(product.oldPrice) : '',
  badge: product.badge ?? '',
  featured: Boolean(product.featured),
<<<<<<< HEAD
});

/* La clave reinicia el formulario al pasar de "nuevo" a editar, o de un producto a otro */
export function AdminProductForm() {
  const { id } = useParams();
  const editing = id ? productById(id) : undefined;
=======
  image: product.image ?? '',
});

type Errors = Partial<Record<keyof FormState, string>>;

/* La clave reinicia el formulario al pasar de "nuevo" a editar, o de un producto a otro */
export function AdminProductForm() {
  const { id } = useParams();
  const products = useProducts();
  const editing = findProduct(products, id);
>>>>>>> remotes/origin/feat/admin

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
<<<<<<< HEAD
  const [form, setForm] = useState<FormState>(editing ? fromProduct(editing) : EMPTY);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    navigate('/cuenta/admin');
=======
  const products = useProducts();
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<FormState>(editing ? fromProduct(editing) : EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [imageBusy, setImageBusy] = useState(false);
  const [saveError, setSaveError] = useState('');

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  // Al cambiar de categoría, el tipo de instrumento se ajusta a los que existen en ella
  const changeCategory = (category: CategoryId) => {
    const options = ART_BY_CATEGORY[category];
    setForm((current) => ({ ...current, category, art: options.includes(current.art) ? current.art : options[0] }));
    setErrors((current) => ({ ...current, category: undefined }));
  };

  const handleImage = async (file: File | undefined) => {
    if (!file) return;
    setImageBusy(true);
    const result = await prepareImage(file);
    setImageBusy(false);
    if (result.ok) update('image', result.dataUrl);
    else setErrors((current) => ({ ...current, image: result.error }));
  };

  const validate = (): Errors => {
    const name = form.name.trim();
    const price = Number(form.price);
    const oldPrice = Number(form.oldPrice);
    const duplicated = products.some(
      (item) => item.id !== editing?.id && item.name.trim().toLowerCase() === name.toLowerCase(),
    );
    const found: Errors = {};
    if (!name) found.name = 'Escribe el nombre del producto.';
    else if (name.length < 3) found.name = 'El nombre es muy corto: usa al menos 3 letras.';
    else if (name.length > 80) found.name = 'El nombre es muy largo: máximo 80 caracteres.';
    else if (duplicated) found.name = 'Ya existe un producto con ese nombre.';

    if (!form.detail.trim()) found.detail = 'Escribe una descripción corta.';
    else if (form.detail.trim().length > 120) found.detail = 'Máximo 120 caracteres.';

    if (!form.price) found.price = 'Escribe el precio.';
    else if (!Number.isInteger(price) || price <= 0) found.price = 'El precio debe ser mayor a cero.';
    else if (price > 1_000_000) found.price = 'El precio máximo es $1,000,000.';

    if (form.oldPrice && !found.price && oldPrice <= price) found.oldPrice = 'El precio anterior debe ser mayor al precio actual.';
    if (form.badge.trim().length > 14) found.badge = 'Máximo 14 caracteres.';
    return found;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSaveError('');
    const found = validate();
    if (hasErrors(found as Record<string, string>)) {
      setErrors(found);
      focusFirstError(formRef.current);
      return;
    }

    const input = {
      name: form.name,
      detail: form.detail,
      category: form.category,
      art: form.art,
      tone: form.tone,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      badge: form.badge,
      featured: form.featured,
      image: form.image || undefined,
    };
    const result = editing ? updateProduct(editing.id, input) : createProduct(input);
    if (!result.ok) {
      setSaveError(result.error);
      return;
    }
    const verb = editing ? 'Guardaste los cambios de' : 'Creaste';
    navigate('/cuenta/admin', { state: { notice: `${verb} «${result.product.name}».` } });
>>>>>>> remotes/origin/feat/admin
  };

  // La etiqueta de la derecha se arma con lo que se va escribiendo
  const preview: Product = {
    id: 'vista-previa',
    name: form.name.trim() || 'Nombre del producto',
    detail: form.detail.trim() || 'Descripción corta del producto',
    price: Number(form.price) || 0,
    oldPrice: Number(form.oldPrice) || undefined,
    category: form.category,
<<<<<<< HEAD
    art: CATEGORY_ART[form.category],
    tone: form.tone,
    badge: form.badge.trim() || undefined,
    featured: form.featured,
  };

=======
    art: form.art,
    tone: form.tone,
    badge: form.badge.trim() || undefined,
    featured: form.featured,
    image: form.image || undefined,
  };

  const artOptions = ART_BY_CATEGORY[form.category];

>>>>>>> remotes/origin/feat/admin
  return (
    <>
      <Link className={BACK} to="/cuenta/admin">
        Volver a productos
      </Link>
      <h1 className={tituloSeccion}>{editing ? 'Editar producto' : 'Nuevo producto'}</h1>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)_15rem] items-start gap-6 max-xl:grid-cols-1">
<<<<<<< HEAD
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
=======
        <form className={paperPad} onSubmit={handleSubmit} ref={formRef} noValidate>
          <div className={formGrid}>
            <Field
              id="p-nombre"
              label="Nombre"
              value={form.name}
              onChange={(event) => update('name', event.target.value)}
              error={errors.name}
              wide
            />
            <Field
              id="p-detalle"
              label="Descripción corta"
              hint="Una línea. Aparece debajo del nombre en la etiqueta."
              value={form.detail}
              onChange={(event) => update('detail', event.target.value)}
              error={errors.detail}
              wide
            />
>>>>>>> remotes/origin/feat/admin

            <div className={field}>
              <label className={fieldLabel} htmlFor="p-categoria">
                Categoría
              </label>
              <select
                id="p-categoria"
<<<<<<< HEAD
                className={fieldInput}
                value={form.category}
                onChange={(event) => update('category', event.target.value as CategoryId)}
=======
                name="p-categoria"
                className={fieldInput}
                value={form.category}
                onChange={(event) => changeCategory(event.target.value as CategoryId)}
>>>>>>> remotes/origin/feat/admin
              >
                {CATEGORIES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

<<<<<<< HEAD
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
=======
            <SelectField
              id="p-tipo"
              label="Tipo"
              options={artOptions.map((art) => ART_LABEL[art])}
              value={ART_LABEL[form.art]}
              onChange={(event) => {
                const art = artOptions.find((item) => ART_LABEL[item] === event.target.value);
                if (art) update('art', art);
              }}
            />

            <SelectField
              id="p-acabado"
              label="Acabado"
              options={TONES.map((tone) => TONE_LABEL[tone])}
              value={TONE_LABEL[form.tone]}
              onChange={(event) => {
                const tone = TONES.find((item) => TONE_LABEL[item] === event.target.value);
                if (tone) update('tone', tone);
              }}
            />

            <Field
              id="p-precio"
              label="Precio (MXN)"
              inputMode="numeric"
              placeholder="0"
              value={form.price}
              onChange={(event) => update('price', event.target.value.replace(/\D/g, ''))}
              error={errors.price}
            />
            <Field
              id="p-anterior"
              label="Precio anterior (MXN)"
              inputMode="numeric"
              placeholder="Opcional"
              hint="Llénalo solo si está en oferta."
              value={form.oldPrice}
              onChange={(event) => update('oldPrice', event.target.value.replace(/\D/g, ''))}
              error={errors.oldPrice}
            />
            <Field
              id="p-insignia"
              label="Insignia"
              placeholder="Nueva, -15%, Quedan 3"
              value={form.badge}
              onChange={(event) => update('badge', event.target.value)}
              error={errors.badge}
            />

            <div className={`${field} content-end pb-[0.6rem]`}>
              <label className={check}>
                <input type="checkbox" checked={form.featured} onChange={(event) => update('featured', event.target.checked)} />
>>>>>>> remotes/origin/feat/admin
                <span>Mostrar en «Colgado en la pared esta semana»</span>
              </label>
            </div>

            <div className={fieldWide}>
              <span className={fieldLabel} id="p-foto-label">
                Foto del producto
              </span>
<<<<<<< HEAD
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
=======
              {form.image ? (
                <div className="flex flex-wrap items-center gap-4 rounded-md border-2 border-palorosa/30 p-3">
                  <ProductArt
                    kind={form.art}
                    tone={form.tone}
                    image={form.image}
                    className="grid size-24 place-items-center rounded-[3px] bg-tweed [&_img]:size-full [&_img]:object-cover"
                  />
                  <div className="grid gap-2">
                    <p className={paperMuted}>Esta foto reemplaza a la ilustración.</p>
                    <button className={`${linkButton} justify-self-start text-sunburst-rojo`} type="button" onClick={() => update('image', '')}>
                      Quitar foto
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  className="relative grid cursor-pointer gap-[0.2rem] rounded-md border-2 border-dashed border-palorosa/45 p-5 transition-colors duration-200 hover:border-palorosa hover:bg-palorosa/5 has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-3 has-[input:focus-visible]:outline-laton-claro"
                  aria-labelledby="p-foto-label"
                >
                  <input
                    className="absolute inset-0 cursor-pointer opacity-0"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => {
                      void handleImage(event.target.files?.[0]);
                      event.target.value = '';
                    }}
                    aria-describedby="p-foto-hint"
                  />
                  <span className="font-semibold">{imageBusy ? 'Preparando la imagen…' : 'Elige una imagen'}</span>
                  <span className="text-sm text-tinta-suave" id="p-foto-hint">
                    JPG, PNG o WebP. La reducimos para que quepa en el navegador. Si no subes una, se usa una ilustración.
                  </span>
                </label>
              )}
              <FieldError id="p-foto-error" message={errors.image} />
              <p className={fieldHint}>Se guarda en este navegador, igual que el resto del catálogo.</p>
            </div>
          </div>

          {saveError && (
            <p className="mt-5 rounded-md border-2 border-sunburst-rojo px-4 py-3 font-semibold text-sunburst-rojo" role="alert">
              {saveError}
            </p>
          )}

          <div className="mt-7 flex flex-wrap gap-3 border-t border-dashed border-palorosa/35 pt-5">
            <button className={btn('oscuro')} type="submit" disabled={imageBusy}>
>>>>>>> remotes/origin/feat/admin
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
<<<<<<< HEAD
            <ProductTag product={preview} />
=======
            <ProductTag product={preview} preview />
>>>>>>> remotes/origin/feat/admin
          </div>
        </aside>
      </div>
    </>
  );
}
