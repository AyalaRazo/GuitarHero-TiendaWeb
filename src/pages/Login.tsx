import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Breadcrumb } from '../components/Breadcrumb';
import { Field } from '../components/Field';
import { CardIcon, PickIcon, SwapIcon, TruckIcon } from '../components/Icons';
import { btn, check, container, formGrid, linkButton, paperPad, titulo } from '../ui';

const REASON_ICON = 'size-[1.9rem] flex-none text-laton';

type Mode = 'ingresar' | 'registro';

const REASONS = [
  { Icon: TruckIcon, title: 'Sigue tu pedido', text: 'Ves en qué paso va, desde el taller hasta tu puerta.' },
  { Icon: CardIcon, title: 'Paga más rápido', text: 'Guardamos tus direcciones para la próxima compra.' },
  { Icon: SwapIcon, title: 'Guarda lo que te gusta', text: 'Tus favoritos esperan hasta que te decidas.' },
];

export function Login() {
  const { user, signIn } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const [mode, setMode] = useState<Mode>('ingresar');

  // Si ya hay sesión, no tiene caso ver el login
  if (user) return <Navigate to={from ?? '/cuenta'} replace />;

  const registering = mode === 'registro';
  const buying = from === '/checkout';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get(registering ? 'r-correo' : 'l-correo') ?? '').trim() || 'cliente@ejemplo.com';

    if (registering) {
      signIn(email, {
        firstName: String(data.get('r-nombre') ?? '').trim(),
        lastName: String(data.get('r-apellidos') ?? '').trim(),
        role: 'cliente',
      });
    } else {
      signIn(email);
    }
  };

  return (
    <section className="bg-pared pt-7 pb-section text-hueso" aria-labelledby="login-title">
      <div className={container}>
        <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: registering ? 'Crear cuenta' : 'Iniciar sesión' }]} />

        <div className="mt-8 grid grid-cols-[minmax(0,6fr)_minmax(0,5fr)] items-center gap-[clamp(2rem,6vw,5rem)] max-lg:grid-cols-1 max-lg:items-start">
          <div className="grid max-w-136 gap-5 max-lg:max-w-none">
            {buying && (
              <p className="rounded-md bg-laton px-4 py-[0.85rem] font-semibold text-palorosa" role="status">
                Inicia sesión para terminar tu compra. Tu carrito se queda como está.
              </p>
            )}

            <form className={`${paperPad} relative`} onSubmit={handleSubmit} noValidate>
              <PickIcon className="mb-3 h-[2.4rem] w-[2.2rem] text-laton" />
              <h1 className={`${titulo} text-2xl`} id="login-title">
                {registering ? 'Crea tu cuenta' : 'Inicia sesión'}
              </h1>
              <p className="mt-2 text-tinta-suave">
                {registering
                  ? 'Con tu cuenta sigues tus pedidos y guardas tus direcciones.'
                  : 'Entra para ver tus pedidos, tus direcciones y tus favoritos.'}
              </p>

              {registering ? (
                <div className={`${formGrid} mt-6`}>
                  <Field id="r-nombre" label="Nombre" autoComplete="given-name" />
                  <Field id="r-apellidos" label="Apellidos" autoComplete="family-name" />
                  <Field id="r-correo" label="Correo electrónico" type="email" autoComplete="email" placeholder="tucorreo@ejemplo.com" wide />
                  <Field id="r-clave" label="Contraseña" type="password" autoComplete="new-password" hint="Usa al menos 8 caracteres." />
                  <Field id="r-repetir" label="Repite la contraseña" type="password" autoComplete="new-password" />
                </div>
              ) : (
                <div className={`${formGrid} mt-6`}>
                  <Field id="l-correo" label="Correo electrónico" type="email" autoComplete="email" placeholder="tucorreo@ejemplo.com" wide />
                  <Field id="l-clave" label="Contraseña" type="password" autoComplete="current-password" wide />
                </div>
              )}

              {!registering && (
                <div className="mt-[1.1rem] flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-sm">
                  <label className={check}>
                    <input type="checkbox" name="recordar" />
                    <span>Mantener la sesión iniciada</span>
                  </label>
                  <a className={linkButton} href="#">
                    Olvidé mi contraseña
                  </a>
                </div>
              )}

              <button className={`${btn('oscuro', { block: true })} mt-6`} type="submit">
                {registering ? 'Crear cuenta' : 'Entrar'}
              </button>

              <p className="mt-[1.1rem] text-center">
                {registering ? '¿Ya tienes cuenta? ' : '¿Primera vez en la tienda? '}
                <button
                  className={linkButton}
                  type="button"
                  onClick={() => setMode(registering ? 'ingresar' : 'registro')}
                >
                  {registering ? 'Inicia sesión' : 'Crea tu cuenta'}
                </button>
              </p>
            </form>

            <p className="rounded-md border-[1.5px] border-dashed border-tweed/55 px-4 py-[0.8rem] text-sm leading-[1.45] text-tweed">
              <strong className="text-hueso">Solo para revisar el diseño:</strong> entra con cualquier correo. Si empieza con «admin», verás el
              panel administrativo.
            </p>
          </div>

          <aside
            className="rounded-md border border-laton/45 bg-palorosa p-[clamp(1.5rem,4vw,2.5rem)] outline outline-laton/45 -outline-offset-[9px]"
            aria-label="Para qué sirve tu cuenta"
          >
            <h2 className={`${titulo} text-xl`}>Tu cuenta es tu lugar en la tienda</h2>
            <ul className="mt-6 grid gap-5">
              {REASONS.map(({ Icon, title, text }) => (
                <li className="flex items-start gap-[0.9rem]" key={title}>
                  <Icon className={REASON_ICON} />
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-tweed">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
