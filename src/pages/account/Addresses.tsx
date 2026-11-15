import { ADDRESSES } from '../../data/sample';
import { badgePrincipal, linkButton, paperPad, paperTitle, tituloSeccion } from '../../ui';

export function Addresses() {
  return (
    <>
      <h1 className={tituloSeccion}>Direcciones</h1>
      <p className="mt-2 text-lg text-tinta-suave">Elige a dónde mandamos tus pedidos.</p>

      <ul className="mt-6 grid grid-cols-2 gap-6 max-md:grid-cols-1">
        {ADDRESSES.map((address) => (
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
              {address.area}
              <br />
              {address.city}
              <br />
              Tel. {address.phone}
            </address>
            <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-2">
              <button className={linkButton} type="button">
                Editar
              </button>
              {!address.primary && (
                <button className={linkButton} type="button">
                  Usar como principal
                </button>
              )}
              <button className={`${linkButton} text-sunburst-rojo`} type="button">
                Eliminar
              </button>
            </div>
          </li>
        ))}

        <li>
          <button
            className="grid size-full min-h-48 place-content-center justify-items-center gap-2 rounded-[3px] border-2 border-dashed border-palorosa/50 bg-transparent font-semibold transition-colors duration-200 hover:border-palorosa hover:bg-palorosa/6"
            type="button"
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
