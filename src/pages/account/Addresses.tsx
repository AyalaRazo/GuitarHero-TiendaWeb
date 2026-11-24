import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { AddressForm } from '../../components/AddressForm';
import { Dialog } from '../../components/Dialog';
import { deleteAddress, saveAddress, setPrimaryAddress, useAddresses } from '../../store/addresses';
import type { Address, AddressInput } from '../../store/addresses';
import { badgePrincipal, btn, btnPeligro, linkButton, paperMuted, paperPad, paperTitle, tituloSeccion } from '../../ui';

export function Addresses() {
  const { account: user } = useAuth();
  const addresses = useAddresses(user?.id);
  // null = cerrado, 'nueva' = formulario vacío, Address = editando
  const [editing, setEditing] = useState<Address | 'nueva' | null>(null);
  const [toDelete, setToDelete] = useState<Address | null>(null);
  const [error, setError] = useState('');

  if (!user) return null;

  const handleSave = (values: AddressInput) => {
    const saved = saveAddress(user.id, values, editing && editing !== 'nueva' ? editing.id : undefined);
    if (saved) {
      setEditing(null);
      setError('');
    } else {
      setError('No se pudo guardar la dirección en este navegador.');
    }
  };

  const initial: AddressInput | undefined =
    editing && editing !== 'nueva'
      ? {
          label: editing.label,
          name: editing.name,
          street: editing.street,
          colony: editing.colony,
          zip: editing.zip,
          city: editing.city,
          state: editing.state,
          phone: editing.phone,
        }
      : undefined;

  return (
    <>
      <h1 className={tituloSeccion}>Direcciones</h1>
      <p className="mt-2 text-lg text-tinta-suave">Elige a dónde mandamos tus pedidos.</p>
      {error && (
        <p className="mt-4 font-semibold text-sunburst-rojo" role="alert">
          {error}
        </p>
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
              <br />
              Col. {address.colony}, C. P. {address.zip}
              <br />
              {address.city}, {address.state}
              <br />
              Tel. {address.phone}
            </address>
            <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-2">
              <button className={linkButton} type="button" onClick={() => setEditing(address)}>
                Editar<span className="sr-only"> {address.label}</span>
              </button>
              {!address.primary && (
                <button className={linkButton} type="button" onClick={() => setPrimaryAddress(user.id, address.id)}>
                  Usar como principal<span className="sr-only">: {address.label}</span>
                </button>
              )}
              <button className={`${linkButton} text-sunburst-rojo`} type="button" onClick={() => setToDelete(address)}>
                Eliminar<span className="sr-only"> {address.label}</span>
              </button>
            </div>
          </li>
        ))}

        <li>
          <button
            className="grid size-full min-h-48 place-content-center justify-items-center gap-2 rounded-[3px] border-2 border-dashed border-palorosa/50 bg-transparent font-semibold transition-colors duration-200 hover:border-palorosa hover:bg-palorosa/6"
            type="button"
            onClick={() => setEditing('nueva')}
          >
            <span className="grid size-10 place-items-center rounded-full bg-palorosa text-2xl leading-none text-hueso" aria-hidden="true">
              +
            </span>
            Agregar una dirección
          </button>
        </li>
      </ul>

      <Dialog
        open={editing !== null}
        title={editing === 'nueva' ? 'Nueva dirección' : 'Editar dirección'}
        onClose={() => setEditing(null)}
        wide
      >
        <AddressForm
          initial={initial}
          submitLabel={editing === 'nueva' ? 'Guardar dirección' : 'Guardar cambios'}
          onSubmit={handleSave}
          onCancel={() => setEditing(null)}
        />
      </Dialog>

      <Dialog open={toDelete !== null} title="¿Eliminar esta dirección?" onClose={() => setToDelete(null)}>
        <p className="font-semibold">{toDelete?.label}</p>
        <p className={paperMuted}>{toDelete?.street}</p>
        <div className="mt-6 flex flex-wrap justify-end gap-[0.6rem]">
          <button className={btn('lineaOscura')} type="button" onClick={() => setToDelete(null)}>
            Cancelar
          </button>
          <button
            className={btnPeligro}
            type="button"
            onClick={() => {
              if (toDelete) deleteAddress(user.id, toDelete.id);
              setToDelete(null);
            }}
          >
            Eliminar dirección
          </button>
        </div>
      </Dialog>
    </>
  );
}
