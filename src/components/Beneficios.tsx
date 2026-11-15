import { CardIcon, SwapIcon, TruckIcon } from './Icons';
import { container } from '../ui';

const BENEFICIOS = [
  { Icon: TruckIcon, title: 'Envío gratis desde $2,500', text: 'A todo el país, con guía de rastreo.' },
  { Icon: CardIcon, title: 'Hasta 12 meses sin intereses', text: 'Con tarjetas participantes.' },
  { Icon: SwapIcon, title: '30 días para cambios', text: 'Si no es lo que esperabas, lo cambiamos.' },
];

export function Beneficios() {
  return (
    <section className="bg-pared-hondo" aria-label="Condiciones de compra">
      <ul className={`${container} grid grid-cols-3 gap-6 py-6 max-[48rem]:grid-cols-1 max-[48rem]:gap-4`}>
        {BENEFICIOS.map(({ Icon, title, text }) => (
          <li className="flex items-center gap-[0.9rem]" key={title}>
            <Icon className="size-8 flex-none text-laton" />
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-tweed">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
