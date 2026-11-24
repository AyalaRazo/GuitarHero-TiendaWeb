import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { paper, paperTitle } from '../ui';

interface DialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

/* Ventana modal con <dialog> nativo: atrapa el foco, se cierra con Escape y devuelve el foco al abrirla */
export function Dialog({ open, title, onClose, children, wide }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      className={`${paper} m-auto max-h-[calc(100vh-2rem)] w-[min(${wide ? '38rem' : '28rem'},calc(100vw-2rem))] overflow-y-auto border-0 p-7 backdrop:bg-pared-hondo/70`}
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        // Un clic en el fondo oscuro (fuera de la hoja) también cierra
        if (event.target === ref.current) onClose();
      }}
    >
      {open && (
        <>
          <h2 className={`${paperTitle} mb-4`} id={titleId}>
            {title}
          </h2>
          {children}
        </>
      )}
    </dialog>
  );
}
