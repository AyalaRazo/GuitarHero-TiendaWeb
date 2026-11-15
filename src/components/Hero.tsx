import { Link } from 'react-router-dom';
import { btn, container } from '../ui';
import { Fretboard } from './Fretboard';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-pared text-hueso" aria-labelledby="hero-title">
      <div
        className={`${container} relative flex min-h-[40rem] items-center py-12 max-lg:min-h-0 max-lg:flex-col max-lg:items-start max-lg:pb-32`}
      >
        <div className="relative z-2 max-w-[31rem]">
          <h1 className="font-display text-hero leading-[1.02] font-normal tracking-[-0.01em] text-balance" id="hero-title">
            Descuelga una guitarra y empieza a tocar
          </h1>
          <p className="mt-5 max-w-[28rem] text-lg leading-normal text-pretty text-tweed">
            Guitarras, amplificadores y accesorios elegidos por gente que toca. Cada instrumento sale revisado de
            nuestro taller.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className={btn('laton')} to="/productos/guitarras">
              Ver guitarras
            </Link>
            <a className={btn('line')} href="#destacados">
              Ofertas de la semana
            </a>
          </div>
        </div>

        {/* El mástil cuelga en diagonal y se sale por la derecha de la pared */}
        <div
          className="absolute top-1/2 left-[48%] z-1 aspect-[2400/480] w-[clamp(109rem,150vw,160rem)] origin-left -translate-y-1/2 -rotate-5 drop-shadow-[0_26px_22px_rgba(0,0,0,0.42)] max-lg:relative max-lg:top-auto max-lg:left-auto max-lg:mt-10 max-lg:-ml-[6vw] max-lg:w-[200vw] max-lg:translate-y-0 max-lg:-rotate-4"
        >
          <Fretboard className="size-full max-w-none" />
          <Link
            className="absolute top-[94%] left-[7.9%] z-2 flex origin-[50%_0] -translate-x-1/2 rotate-9 flex-col items-center hover:animate-swing"
            to="/productos/guitarras"
            aria-label="Guitarra eléctrica Sunburst 60, $12,490"
          >
            <span className="relative z-1 -mb-[1.2rem] h-9 w-0.5 bg-tweed" aria-hidden="true" />
            <span className="relative grid min-w-30 gap-[0.1rem] bg-tweed px-[1.1rem] pt-6 pb-[0.85rem] text-center text-palorosa [clip-path:polygon(16%_0,84%_0,100%_14%,100%_100%,0_100%,0_14%)] before:absolute before:top-2 before:left-1/2 before:-ml-[0.7rem] before:size-[1.4rem] before:rounded-full before:border-[0.3rem] before:border-hueso before:bg-pared before:content-['']">
              <span className="text-sm font-semibold">Sunburst 60</span>
              <span className="font-display text-2xl leading-[1.1]">$12,490</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
