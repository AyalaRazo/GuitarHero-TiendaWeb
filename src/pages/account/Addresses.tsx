import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { ADDRESSES } from '../../data/sample';
import {
  badgePrincipal,
  btn,
  field,
  fieldInput,
  fieldLabel,
  fieldWide,
  formGrid,
  linkButton,
  paperPad,
  paperTitle,
  tituloSeccion,
} from '../../ui';

export interface UserAddress {
  id: string;
  label: string;
  name: string;
  street: string;
  area: string;
  city: string;
  phone: string;
  primary?: boolean;
}

const EMPTY_FORM: Omit<UserAddress, 'id' | 'primary'> = {
  label: '',
  name: '',
  street: '',
  area: '',
  city: '',
  phone: '',
};

export function Addresses() {
  const { user } = useAuth();
  const storageKey = `user_addresses_${user?.email ?? 'guest'}`;

  const [addresses, setAddresses] = useState<UserAddress[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback a direcciones iniciales
    }
    const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : '';
    return ADDRESSES.map((a) => ({
      ...a,
      name: fullName || a.name,
    }));
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(addresses));
  }, [addresses, storageKey]);

  const openNew = () => {
    const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : '';
    setEditingId(null);
    setForm({ ...EMPTY_FORM, name: fullName });
    setError(null);
    setShowForm(true);
  };

  const openEdit = (address: UserAddress) => {
    setEditingId(address.id);
    setForm({
      label: address.label,
      name: address.name,
      street: address.street,
      area: address.area,
      city: address.city,
      phone: address.phone,
    });
    setError(null);
    setShowForm(true);
  };

  const handleSetPrimary = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, primary: a.id === id })));
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (next.length > 0 && !next.some((a) => a.primary)) {
        next[0] = { ...next[0], primary: true };
      }
      return next;
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.label.trim() || !form.name.trim() || !form.street.trim() || !form.city.trim()) {
      setError('Completa al menos etiqueta, nombre, calle y ciudad.');
      return;
    }

    const clean = {
      label: form.label.trim(),
      name: form.name.trim(),
      street: form.street.trim(),
      area: form.area.trim(),
      city: form.city.trim(),
      phone: form.phone.trim(),
    };

    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...clean } : a))
      );
    } else {
      const newAddress: UserAddress = {
        id: `dir-${Date.now().toString(36)}`,
        ...clean,
        primary: addresses.length === 0,
      };
      setAddresses((prev) => [...prev, newAddress]);
    }

    setShowForm(false);
    setEditingId(null);
    setError(null);
  };

  return (
    <>
      <h1 className={tituloSeccion}>Direcciones</h1>
      <p className="mt-2 text-lg text-tinta-suave">Elige a dónde mandamos tus pedidos.</p>

      {showForm && (
        <form className={`${paperPad} mt-6`} onSubmit={handleSubmit} noValidate>
          <h2 className={paperTitle}>{editingId ? 'Editar dirección' : 'Nueva dirección'}</h2>
          <div className={`${formGrid} mt-5`}>
            <div className={field}>
              <label className={fieldLabel} htmlFor="dir-label">
                Etiqueta
              </label>
              <input
                id="dir-label"
                className={fieldInput}
                placeholder="Casa, Estudio, Oficina..."
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              />
            </div>
            <div className={field}>
              <label className={fieldLabel} htmlFor="dir-name">
                Quien recibe
              </label>
              <input
                id="dir-name"
                className={fieldInput}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className={fieldWide}>
              <label className={fieldLabel} htmlFor="dir-street">
                Calle y número
              </label>
              <input
                id="dir-street"
                className={fieldInput}
                value={form.street}
                onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
              />
            </div>
            <div className={field}>
              <label className={fieldLabel} htmlFor="dir-area">
                Colonia y CP
              </label>
              <input
                id="dir-area"
                className={fieldInput}
                value={form.area}
                onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
              />
            </div>
            <div className={field}>
              <label className={fieldLabel} htmlFor="dir-city">
                Ciudad y estado
              </label>
              <input
                id="dir-city"
                className={fieldInput}
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              />
            </div>
            <div className={field}>
              <label className={fieldLabel} htmlFor="dir-phone">
                Teléfono
              </label>
              <input
                id="dir-phone"
                className={fieldInput}
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
          </div>

          {error && <p className="mt-4 text-sm font-semibold text-sunburst-rojo">{error}</p>}

          <div className="mt-6 flex flex-wrap gap-3">
            <button className={btn('oscuro')} type="submit">
              {editingId ? 'Guardar cambios' : 'Guardar dirección'}
            </button>
            <button
              className={btn('lineaOscura')}
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <ul className="mt-6 grid grid-cols-2 gap-6 max-md:grid-cols-1">
        {addresses.map((address) => (
          <li className={`${paperPad} flex flex-col`} key={address.id}>
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
              <h2 className={paperTitle}>{address.label}</h2>
              {address.primary && <span className={badgePrincipal}>Principal</span>}
            </div>
            <address className="mt-3 mb-4 block leading-[1.55] not-italic">
              {address.name}
              <br />
              {address.street}
              {address.area && (
                <>
                  <br />
                  {address.area}
                </>
              )}
              <br />
              {address.city}
              {address.phone && (
                <>
                  <br />
                  Tel. {address.phone}
                </>
              )}
            </address>
            <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-2">
              <button className={linkButton} type="button" onClick={() => openEdit(address)}>
                Editar
              </button>
              {!address.primary && (
                <button className={linkButton} type="button" onClick={() => handleSetPrimary(address.id)}>
                  Usar como principal
                </button>
              )}
              <button
                className={`${linkButton} text-sunburst-rojo`}
                type="button"
                onClick={() => handleDelete(address.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}

        <li>
          <button
            className="grid size-full min-h-48 place-content-center justify-items-center gap-2 rounded-[3px] border-2 border-dashed border-palorosa/50 bg-transparent font-semibold transition-colors duration-200 hover:border-palorosa hover:bg-palorosa/6"
            type="button"
            onClick={openNew}
          >
            <span className="grid size-10 place-items-center rounded-full bg-palorosa text-2xl leading-none text-hueso" aria-hidden="true">
              +
            </span>
            Agregar una dirección
          </button>
        </li>
      </ul>
    </>
  );
}