/* Lleva el foco al primer campo con error, para que quien usa teclado o lector de pantalla lo encuentre */
export function focusFirstError(form: HTMLFormElement | null): void {
  if (!form) return;
  window.setTimeout(() => {
    form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, 0);
}
