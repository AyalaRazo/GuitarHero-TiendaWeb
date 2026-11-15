import { btn, container, tituloSeccion } from '../ui';

const STEPS = [
  {
    title: 'Revisamos trastes, clavijas y electrónica',
    text: 'Si algo suena raro o está flojo, se corrige.',
  },
  {
    title: 'Ajustamos el mástil y la altura de las cuerdas',
    text: 'Para que toque cómoda desde la primera tarde.',
  },
  {
    title: 'Afinamos, probamos y empacamos',
    text: 'Sale con una hoja que dice qué se le hizo.',
  },
];

const SHEET_ROWS: [string, string][] = [
  ['Modelo', 'Sunburst 60'],
  ['Trastes', 'Nivelados y pulidos'],
  ['Alma del mástil', 'Ajustada'],
  ['Altura de cuerdas', '1.5 mm agudas, 1.9 mm graves'],
  ['Afinación', 'Estándar, A 440 Hz'],
  ['Estado', 'Lista para enviar'],
];

export function Taller() {
  return (
    <section className="bg-palorosa-claro py-section text-hueso" id="taller" aria-labelledby="taller-title">
      <div className={`${container} grid grid-cols-[minmax(0,6fr)_minmax(0,5fr)] items-center gap-[clamp(2.5rem,6vw,5rem)] max-lg:grid-cols-1`}>
        <div>
          <h2 className={tituloSeccion} id="taller-title">
            Cada guitarra pasa por el taller antes de salir
          </h2>
          <p className="mt-4 max-w-[34rem] text-lg leading-[1.5] text-pretty text-tweed">
            No mandamos nada que no hayamos tocado. Antes de empacar, revisamos tu instrumento como si se fuera a
            quedar en la tienda.
          </p>

          <ol className="mt-9 grid gap-6">
            {STEPS.map((step, i) => (
              <li className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-3" key={step.title}>
                <span className="font-display text-[2.25rem] leading-none text-laton" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <p className="text-lg leading-[1.3] font-semibold">{step.title}</p>
                  <p className="mt-1 text-tweed">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <a className={`${btn('line')} mt-9`} href="#">
            Conoce el servicio de taller
          </a>
        </div>

        {/* Hoja de revisión sujeta con un clip */}
        <figure
          className="relative rotate-2 rounded-[3px] bg-papel px-7 pt-10 pb-[5.5rem] text-palorosa shadow-[0_24px_40px_-14px_rgba(0,0,0,0.6)] max-lg:mt-4 max-lg:max-w-[30rem] max-lg:rotate-[1.5deg]"
          aria-label="Ejemplo de hoja de revisión"
        >
          <span
            className="absolute -top-[0.9rem] left-1/2 -ml-12 h-[1.8rem] w-24 rounded-[4px] bg-linear-to-b from-laton-claro to-laton shadow-[0_3px_5px_rgba(0,0,0,0.4)]"
            aria-hidden="true"
          />
          <h3 className="font-display text-xl leading-[1.1]">Hoja de revisión</h3>
          <dl className="mt-5">
            {SHEET_ROWS.map(([label, value]) => (
              <div
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-dashed border-palorosa/35 py-[0.7rem]"
                key={label}
              >
                <dt className="text-sm text-tinta-suave">{label}</dt>
                {/* Lo que escribe el taller a mano va en tinta verde */}
                <dd className="text-right font-semibold text-pared">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="absolute right-5 bottom-6 -rotate-[11deg] rounded-md border-[3px] border-sunburst-rojo bg-papel/82 px-[0.9rem] py-[0.35rem] font-display text-[1.1rem] leading-[1.2] text-sunburst-rojo outline-[1.5px] outline-offset-[3px] outline-sunburst-rojo">
            Revisada en taller
          </p>
        </figure>
      </div>
    </section>
  );
}
