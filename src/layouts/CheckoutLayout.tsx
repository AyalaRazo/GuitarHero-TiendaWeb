import { Link, Outlet } from 'react-router-dom';
import { LockIcon, PickIcon } from '../components/Icons';
import { container, skipLink } from '../ui';

/* Durante el pago quitamos distracciones: solo logo, pago seguro y volver al carrito */
export function CheckoutLayout() {
  return (
    <>
      <a className={skipLink} href="#contenido">
        Saltar al contenido
      </a>
      <header className="border-b border-hueso/14 bg-pared">
        <div className={`${container} grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-4 max-[40rem]:grid-cols-[1fr_auto]`}>
          <Link className="inline-flex items-center gap-[0.6rem] justify-self-start" to="/" aria-label="Guitar Hero, ir al inicio">
            <PickIcon className="h-8 w-[1.9rem] text-laton" />
            <span className="font-display text-[1.75rem] leading-none text-hueso">Guitar Hero</span>
          </Link>
          <p className="inline-flex items-center gap-[0.4rem] font-medium text-tweed max-[40rem]:hidden">
            <LockIcon className="size-[1.2rem] text-laton" />
            Pago seguro
          </p>
          <Link className="justify-self-end font-semibold underline decoration-laton decoration-2 underline-offset-[0.25em] hover:text-laton-claro" to="/carrito">
            Volver al carrito
          </Link>
        </div>
      </header>
      <main id="contenido">
        <Outlet />
      </main>
      <footer className="bg-palorosa text-sm text-tweed">
        <div className={`${container} flex flex-wrap justify-between gap-x-8 gap-y-2 py-5`}>
          <p>© 2026 Guitar Hero. Todos los derechos reservados.</p>
          <a className="hover:text-hueso hover:underline" href="#">Ayuda con tu compra</a>
        </div>
      </footer>
    </>
  );
}
