/* Validaciones pequeñas y reutilizables. Cada una devuelve el mensaje de error, o '' si el valor es correcto. */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const required = (value: string, message: string): string => (value.trim() ? '' : message);

export const emailError = (value: string): string => {
  if (!value.trim()) return 'Escribe tu correo.';
  return EMAIL.test(value.trim()) ? '' : 'Revisa el correo: falta algo, por ejemplo nombre@dominio.com.';
};

export const passwordError = (value: string): string => {
  if (!value) return 'Escribe una contraseña.';
  if (value.length < 8) return 'Usa al menos 8 caracteres.';
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return 'Combina letras y números.';
  return '';
};

export const phoneError = (value: string, optional = false): string => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return optional ? '' : 'Escribe un teléfono de 10 dígitos.';
  return digits.length === 10 ? '' : 'El teléfono debe tener 10 dígitos.';
};

export const zipError = (value: string): string => (/^\d{5}$/.test(value.trim()) ? '' : 'El código postal tiene 5 dígitos.');

/* Algoritmo de Luhn: detecta números de tarjeta mal escritos */
export function cardNumberError(value: string): string {
  const digits = value.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(digits)) return 'Escribe los 16 dígitos de tu tarjeta.';
  let sum = 0;
  for (let i = 0; i < digits.length; i += 1) {
    let digit = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0 ? '' : 'Ese número de tarjeta no es válido.';
}

export function expiryError(value: string, now = new Date()): string {
  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(value.trim());
  if (!match) return 'Escribe el vencimiento como MM/AA.';
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return 'El mes debe estar entre 01 y 12.';
  const lastDay = new Date(year, month, 0, 23, 59, 59);
  return lastDay < now ? 'La tarjeta está vencida.' : '';
}

export const cvvError = (value: string): string => (/^\d{3,4}$/.test(value.trim()) ? '' : 'El código tiene 3 o 4 dígitos.');

export const hasErrors = (errors: Record<string, string>): boolean => Object.values(errors).some(Boolean);
