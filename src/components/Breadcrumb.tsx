import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ruta de navegación">
      <ol className="flex flex-wrap items-center text-sm text-tweed">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li className="not-first:before:mx-2 not-first:before:opacity-60 not-first:before:content-['/']" key={item.label}>
              {item.to && !isLast ? (
                <Link className="hover:text-hueso hover:underline hover:underline-offset-[0.2em]" to={item.to}>
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-hueso" aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
