import { btn, container, tituloSeccion } from '../ui';

export function Newsletter() {
  return (
    <section className="bg-laton py-[clamp(3rem,6vw,4.5rem)] text-palorosa" aria-labelledby="newsletter-title">
      <div
        className={`${container} grid grid-cols-2 items-center gap-x-[clamp(2rem,6vw,5rem)] gap-y-8 max-[52rem]:grid-cols-1`}
      >
        <div>
          <h2 className={tituloSeccion} id="newsletter-title">
            Avísame cuando llegue equipo nuevo
          </h2>
          <p className="mt-3 max-w-[30rem] text-lg leading-[1.45]">Un correo por semana, con lo que entró al taller y lo que bajó de precio.</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <label className="sr-only" htmlFor="correo">
            Correo electrónico
          </label>
          <div className="flex gap-2 max-[30rem]:flex-col">
            <input
              id="correo"
              className="min-w-0 flex-1 rounded-md border-2 border-palorosa bg-hueso px-4 py-[0.85rem] text-palorosa placeholder:text-tinta-suave"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              autoComplete="email"
              required
            />
            <button className={btn('oscuro')} type="submit">
              Suscribirme
            </button>
          </div>
          <p className="mt-[0.6rem] text-sm">Puedes darte de baja cuando quieras.</p>
        </form>
      </div>
    </section>
  );
}
