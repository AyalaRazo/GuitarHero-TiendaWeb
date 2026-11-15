import type { FormEvent } from 'react';
import { Field } from '../../components/Field';
import { useAuth } from '../../auth/AuthContext';
import { USER } from '../../data/sample';
import { btn, check, formGrid, paperPad, paperTitle, tituloSeccion } from '../../ui';

const CARD = `${paperPad} mt-6`;
const SUBMIT = `${btn('oscuro')} mt-6`;

const stop = (event: FormEvent) => event.preventDefault();

export function Profile() {
  const { user } = useAuth();

  return (
    <>
      <h1 className={tituloSeccion}>Mis datos</h1>

      <form className={CARD} onSubmit={stop} noValidate>
        <h2 className={paperTitle}>Datos personales</h2>
        <div className={`${formGrid} mt-5`}>
          <Field id="d-nombre" label="Nombre" defaultValue={user?.firstName} autoComplete="given-name" />
          <Field id="d-apellidos" label="Apellidos" defaultValue={user?.lastName} autoComplete="family-name" />
          <Field id="d-correo" label="Correo electrónico" type="email" defaultValue={user?.email} autoComplete="email" />
          <Field id="d-telefono" label="Teléfono" type="tel" defaultValue={USER.phone} autoComplete="tel" />
        </div>
        <button className={SUBMIT} type="submit">
          Guardar cambios
        </button>
      </form>

      <form className={CARD} onSubmit={stop} noValidate>
        <h2 className={paperTitle}>Contraseña</h2>
        <div className={`${formGrid} mt-5`}>
          <Field id="d-actual" label="Contraseña actual" type="password" autoComplete="current-password" wide />
          <Field id="d-nueva" label="Contraseña nueva" type="password" autoComplete="new-password" hint="Usa al menos 8 caracteres." />
          <Field id="d-repetir" label="Repite la contraseña nueva" type="password" autoComplete="new-password" />
        </div>
        <button className={SUBMIT} type="submit">
          Cambiar contraseña
        </button>
      </form>

      <form className={CARD} onSubmit={stop} noValidate>
        <h2 className={paperTitle}>Avisos</h2>
        <div className="mt-5 grid gap-[0.8rem]">
          <label className={check}>
            <input type="checkbox" defaultChecked />
            <span>Avísame por correo cuando llegue equipo nuevo.</span>
          </label>
          <label className={check}>
            <input type="checkbox" defaultChecked />
            <span>Avísame por mensaje cuando mi pedido cambie de estado.</span>
          </label>
          <label className={check}>
            <input type="checkbox" />
            <span>Mándame ofertas de la semana.</span>
          </label>
        </div>
        <button className={SUBMIT} type="submit">
          Guardar avisos
        </button>
      </form>
    </>
  );
}
