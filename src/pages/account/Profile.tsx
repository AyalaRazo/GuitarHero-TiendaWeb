import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Field } from '../../components/Field';
import { focusFirstError } from '../../lib/forms';
import { hasErrors, passwordError } from '../../lib/validate';
import { savePreferences, usePreferences } from '../../store/preferences';
import { btn, check, formGrid, paperPad, paperTitle, tituloSeccion } from '../../ui';

const CARD = `${paperPad} mt-6`;
const SUBMIT = `${btn('oscuro')} mt-6`;

type Notice = { error: boolean; text: string } | null;

function Notice({ notice }: { notice: Notice }) {
  if (!notice) return null;
  return (
    <p className={`mt-4 font-semibold ${notice.error ? 'text-sunburst-rojo' : 'text-pared'}`} role={notice.error ? 'alert' : 'status'}>
      {notice.text}
    </p>
  );
}

export function Profile() {
  const { account: user, updateProfile, changePassword } = useAuth();
  const preferences = usePreferences(user?.id);

  const dataRef = useRef<HTMLFormElement>(null);
  const passRef = useRef<HTMLFormElement>(null);
  const [dataErrors, setDataErrors] = useState<Record<string, string>>({});
  const [dataNotice, setDataNotice] = useState<Notice>(null);
  const [passErrors, setPassErrors] = useState<Record<string, string>>({});
  const [passNotice, setPassNotice] = useState<Notice>(null);
  const [prefNotice, setPrefNotice] = useState<Notice>(null);

  if (!user) return null;

  const saveData = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = updateProfile({
      firstName: String(form.get('d-nombre') ?? ''),
      lastName: String(form.get('d-apellidos') ?? ''),
      phone: String(form.get('d-telefono') ?? ''),
    });
    setDataNotice(null);
    if (result.ok) {
      setDataErrors({});
      setDataNotice({ error: false, text: 'Guardamos tus datos.' });
      return;
    }
    const map: Record<string, string> = { firstName: 'd-nombre', lastName: 'd-apellidos', phone: 'd-telefono' };
    const key = result.field ? map[result.field] : undefined;
    if (key) {
      setDataErrors({ [key]: result.error });
      focusFirstError(dataRef.current);
    } else {
      setDataNotice({ error: true, text: result.error });
    }
  };

  const savePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const current = String(data.get('d-actual') ?? '');
    const next = String(data.get('d-nueva') ?? '');
    const repeat = String(data.get('d-repetir') ?? '');
    setPassNotice(null);

    const found: Record<string, string> = {
      'd-actual': current ? '' : 'Escribe tu contraseña actual.',
      'd-nueva': passwordError(next),
      'd-repetir': !next || next === repeat ? '' : 'Las contraseñas no coinciden.',
    };
    if (hasErrors(found)) {
      setPassErrors(found);
      focusFirstError(passRef.current);
      return;
    }
    const result = changePassword(current, next);
    if (result.ok) {
      setPassErrors({});
      form.reset();
      setPassNotice({ error: false, text: 'Cambiamos tu contraseña.' });
      return;
    }
    const map: Record<string, string> = { current: 'd-actual', next: 'd-nueva' };
    const key = result.field ? map[result.field] : undefined;
    if (key) {
      setPassErrors({ [key]: result.error });
      focusFirstError(passRef.current);
    } else {
      setPassNotice({ error: true, text: result.error });
    }
  };

  const savePrefs = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const saved = savePreferences(user.id, {
      newProducts: data.get('newProducts') === 'on',
      orderUpdates: data.get('orderUpdates') === 'on',
      weeklyOffers: data.get('weeklyOffers') === 'on',
    });
    setPrefNotice(saved ? { error: false, text: 'Guardamos tus avisos.' } : { error: true, text: 'No se pudieron guardar los avisos.' });
  };

  return (
    <>
      <h1 className={tituloSeccion}>Mis datos</h1>

      <form className={CARD} onSubmit={saveData} ref={dataRef} noValidate>
        <h2 className={paperTitle}>Datos personales</h2>
        <div className={`${formGrid} mt-5`}>
          <Field id="d-nombre" label="Nombre" defaultValue={user.firstName} autoComplete="given-name" error={dataErrors['d-nombre']} />
          <Field id="d-apellidos" label="Apellidos" defaultValue={user.lastName} autoComplete="family-name" error={dataErrors['d-apellidos']} />
          <Field
            id="d-correo"
            label="Correo electrónico"
            type="email"
            defaultValue={user.email}
            readOnly
            hint="Es con el que entras. No se puede cambiar."
          />
          <Field
            id="d-telefono"
            label="Teléfono"
            type="tel"
            inputMode="numeric"
            defaultValue={user.phone}
            placeholder="10 dígitos"
            autoComplete="tel"
            error={dataErrors['d-telefono']}
          />
        </div>
        <button className={SUBMIT} type="submit">
          Guardar cambios
        </button>
        <Notice notice={dataNotice} />
      </form>

      <form className={CARD} onSubmit={savePassword} ref={passRef} noValidate>
        <h2 className={paperTitle}>Contraseña</h2>
        <div className={`${formGrid} mt-5`}>
          <Field id="d-actual" label="Contraseña actual" type="password" autoComplete="current-password" error={passErrors['d-actual']} wide />
          <Field
            id="d-nueva"
            label="Contraseña nueva"
            type="password"
            autoComplete="new-password"
            hint="Al menos 8 caracteres, con letras y números."
            error={passErrors['d-nueva']}
          />
          <Field id="d-repetir" label="Repite la contraseña nueva" type="password" autoComplete="new-password" error={passErrors['d-repetir']} />
        </div>
        <button className={SUBMIT} type="submit">
          Cambiar contraseña
        </button>
        <Notice notice={passNotice} />
      </form>

      {/* key: si cambian las preferencias guardadas, el formulario se reinicia con los valores nuevos */}
      <form className={CARD} onSubmit={savePrefs} key={JSON.stringify(preferences)}>
        <h2 className={paperTitle}>Avisos</h2>
        <div className="mt-5 grid gap-[0.8rem]">
          <label className={check}>
            <input type="checkbox" name="newProducts" defaultChecked={preferences.newProducts} />
            <span>Avísame por correo cuando llegue equipo nuevo.</span>
          </label>
          <label className={check}>
            <input type="checkbox" name="orderUpdates" defaultChecked={preferences.orderUpdates} />
            <span>Avísame por mensaje cuando mi pedido cambie de estado.</span>
          </label>
          <label className={check}>
            <input type="checkbox" name="weeklyOffers" defaultChecked={preferences.weeklyOffers} />
            <span>Mándame ofertas de la semana.</span>
          </label>
        </div>
        <button className={SUBMIT} type="submit">
          Guardar avisos
        </button>
        <Notice notice={prefNotice} />
      </form>
    </>
  );
}
