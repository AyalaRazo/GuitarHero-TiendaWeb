import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Field } from '../../components/Field';
import { USER } from '../../data/sample';
import { btn, check, formGrid, paperPad, paperTitle, tituloSeccion } from '../../ui';

const CARD = `${paperPad} mt-6`;
const SUBMIT = `${btn('oscuro')} mt-6`;

interface NotificationPrefs {
  newGear: boolean;
  orderStatus: boolean;
  weeklyDeals: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  newGear: true,
  orderStatus: true,
  weeklyDeals: false,
};

export function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const storageSuffix = user?.email ?? 'guest';

  const [phone, setPhone] = useState(() => {
    return localStorage.getItem(`profile_phone_${storageSuffix}`) ?? USER.phone;
  });

  const [prefs, setPrefs] = useState<NotificationPrefs>(() => {
    try {
      const saved = localStorage.getItem(`profile_prefs_${storageSuffix}`);
      if (saved) return { ...DEFAULT_PREFS, ...JSON.parse(saved) };
    } catch {
      // Usa valores por defecto si hay datos inválidos
    }
    return DEFAULT_PREFS;
  });

  const [profileMsg, setProfileMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [passMsg, setPassMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [prefsMsg, setPrefsMsg] = useState<string | null>(null);

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const getVal = (id: string) =>
      (form.elements.namedItem(id) as HTMLInputElement | null)?.value?.trim() ?? '';

    const firstName = getVal('d-nombre');
    const lastName = getVal('d-apellidos');
    const nextPhone = getVal('d-telefono');

    if (firstName.length < 2) {
      setProfileMsg({ type: 'err', text: 'El nombre debe tener al menos 2 caracteres.' });
      return;
    }

    const digits = nextPhone.replace(/\D/g, '');
    if (nextPhone && digits.length < 10) {
      setProfileMsg({ type: 'err', text: 'Ingresa un teléfono válido de al menos 10 dígitos.' });
      return;
    }

    updateProfile({ firstName, lastName });
    setPhone(nextPhone);
    localStorage.setItem(`profile_phone_${storageSuffix}`, nextPhone);
    setProfileMsg({ type: 'ok', text: 'Datos personales actualizados correctamente.' });
  };

const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const form = event.currentTarget;
  const getVal = (id: string) =>
    (form.elements.namedItem(id) as HTMLInputElement | null)?.value ?? '';

  const current = getVal('d-actual');
  const next = getVal('d-nueva');
  const repeat = getVal('d-repetir');

  if (!current) {
    setPassMsg({ type: 'err', text: 'Ingresa tu contraseña actual.' });
    return;
  }
  if (next.length < 8) {
    setPassMsg({ type: 'err', text: 'La contraseña nueva debe tener al menos 8 caracteres.' });
    return;
  }
  if (next !== repeat) {
    setPassMsg({ type: 'err', text: 'Las contraseñas nuevas no coinciden.' });
    return;
  }

  const result = changePassword(current, next);
  if (!result.ok) {
    setPassMsg({ type: 'err', text: result.message });
    return;
  }

  form.reset();
  setPassMsg({ type: 'ok', text: result.message });
};

  const handlePrefsSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem(`profile_prefs_${storageSuffix}`, JSON.stringify(prefs));
    setPrefsMsg('Preferencias de avisos guardadas.');
  };

  return (
    <>
      <h1 className={tituloSeccion}>Mis datos</h1>

      <form className={CARD} onSubmit={handleProfileSubmit} noValidate>
        <h2 className={paperTitle}>Datos personales</h2>
        <div className={`${formGrid} mt-5`}>
          <Field id="d-nombre" label="Nombre" defaultValue={user?.firstName} autoComplete="given-name" />
          <Field id="d-apellidos" label="Apellidos" defaultValue={user?.lastName} autoComplete="family-name" />
          <Field id="d-correo" label="Correo electrónico" type="email" defaultValue={user?.email} autoComplete="email" />
          <Field id="d-telefono" label="Teléfono" type="tel" defaultValue={phone} autoComplete="tel" />
        </div>
        {profileMsg && (
          <p className={`mt-4 text-sm font-semibold ${profileMsg.type === 'err' ? 'text-sunburst-rojo' : 'text-pared'}`}>
            {profileMsg.text}
          </p>
        )}
        <button className={SUBMIT} type="submit">
          Guardar cambios
        </button>
      </form>

      <form className={CARD} onSubmit={handlePasswordSubmit} noValidate>
        <h2 className={paperTitle}>Contraseña</h2>
        <div className={`${formGrid} mt-5`}>
          <Field id="d-actual" label="Contraseña actual" type="password" autoComplete="current-password" wide />
          <Field id="d-nueva" label="Contraseña nueva" type="password" autoComplete="new-password" hint="Usa al menos 8 caracteres." />
          <Field id="d-repetir" label="Repite la contraseña nueva" type="password" autoComplete="new-password" />
        </div>
        {passMsg && (
          <p className={`mt-4 text-sm font-semibold ${passMsg.type === 'err' ? 'text-sunburst-rojo' : 'text-pared'}`}>
            {passMsg.text}
          </p>
        )}
        <button className={SUBMIT} type="submit">
          Cambiar contraseña
        </button>
      </form>

      <form className={CARD} onSubmit={handlePrefsSubmit} noValidate>
        <h2 className={paperTitle}>Avisos</h2>
        <div className="mt-5 grid gap-[0.8rem]">
          <label className={check}>
            <input
              type="checkbox"
              checked={prefs.newGear}
              onChange={(e) => setPrefs((p) => ({ ...p, newGear: e.target.checked }))}
            />
            <span>Avísame por correo cuando llegue equipo nuevo.</span>
          </label>
          <label className={check}>
            <input
              type="checkbox"
              checked={prefs.orderStatus}
              onChange={(e) => setPrefs((p) => ({ ...p, orderStatus: e.target.checked }))}
            />
            <span>Avísame por mensaje cuando mi pedido cambie de estado.</span>
          </label>
          <label className={check}>
            <input
              type="checkbox"
              checked={prefs.weeklyDeals}
              onChange={(e) => setPrefs((p) => ({ ...p, weeklyDeals: e.target.checked }))}
            />
            <span>Mándame ofertas de la semana.</span>
          </label>
        </div>
        {prefsMsg && <p className="mt-4 text-sm font-semibold text-pared">{prefsMsg}</p>}
        <button className={SUBMIT} type="submit">
          Guardar avisos
        </button>
      </form>
    </>
  );
}