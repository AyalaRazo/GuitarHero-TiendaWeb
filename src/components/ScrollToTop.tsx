import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/* Al cambiar de página sube al inicio; si la dirección trae #ancla, baja hasta ella */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
