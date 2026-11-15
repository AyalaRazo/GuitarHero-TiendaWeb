import { Link } from 'react-router-dom';
import { btn, container, tituloSeccion } from '../ui';

export function NotFound() {
  return (
    <section className="bg-pared py-[clamp(4rem,12vw,8rem)] text-hueso">
      <div className={container}>
        <div className="max-w-160">
          <h1 className={tituloSeccion}>No encontramos esa página</h1>
          <p className="mt-4 text-lg text-tweed">Puede que el enlace esté roto o que la hayamos movido de pasillo.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className={btn('laton')} to="/">
              Ir al inicio
            </Link>
            <Link className={btn('line')} to="/productos">
              Ver el catálogo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
