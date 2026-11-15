import { STATUS_STEPS } from '../../data/sample';
import type { OrderStatus } from '../../data/sample';
import type { StatusTone } from '../../ui';

const STEP_BASE =
  "relative pt-[1.7rem] text-sm before:absolute before:top-[0.4rem] before:right-0 before:left-0 before:h-[3px] before:content-[''] after:absolute after:top-0 after:left-0 after:size-[1.1rem] after:rounded-full after:border-[3px] after:content-['']";

const STEP_STATES = {
  done: 'text-tinta-suave before:bg-pared after:border-pared after:bg-pared',
  current: 'font-bold text-palorosa before:bg-palorosa/18 after:border-palorosa after:bg-laton',
  pending: 'text-tinta-suave before:bg-palorosa/18 after:border-palorosa/30 after:bg-[#f8f1dc]',
};

/* Línea de avance de un pedido: recibido, en taller, enviado y entregado */
export function OrderTracker({ status }: { status: OrderStatus }) {
  if (status === 'Cancelado') return null;

  const current = STATUS_STEPS.indexOf(status);

  return (
    <ol className="mt-6 grid grid-cols-4 max-[34rem]:grid-cols-2 max-[34rem]:gap-y-2" aria-label="Avance del pedido">
      {STATUS_STEPS.map((step, i) => {
        const state = i < current || status === 'Entregado' ? 'done' : i === current ? 'current' : 'pending';
        return (
          <li
            className={`${STEP_BASE} ${STEP_STATES[state]}`}
            key={step}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            {step}
          </li>
        );
      })}
    </ol>
  );
}

export function statusTone(status: OrderStatus): StatusTone {
  switch (status) {
    case 'Entregado':
      return 'entregado';
    case 'Enviado':
      return 'enviado';
    case 'Cancelado':
      return 'cancelado';
    default:
      return 'taller';
  }
}
