import type { AddressInput } from '../store/addresses';
import { phoneError, required, zipError } from './validate';

export const EMPTY_ADDRESS: AddressInput = {
  label: '',
  name: '',
  street: '',
  colony: '',
  zip: '',
  city: '',
  state: '',
  phone: '',
};

export type AddressErrors = Partial<Record<keyof AddressInput, string>>;

/* El nombre de la dirección (Casa, Trabajo...) solo se pide cuando se va a guardar */
export function validateAddress(values: AddressInput, options: { needsLabel?: boolean } = {}): AddressErrors {
  const errors: AddressErrors = {
    name: required(values.name, 'Escribe el nombre de quien recibe.'),
    street: required(values.street, 'Escribe la calle y el número.'),
    colony: required(values.colony, 'Escribe la colonia.'),
    zip: zipError(values.zip),
    city: required(values.city, 'Escribe la ciudad o el municipio.'),
    state: required(values.state, 'Elige un estado.'),
    phone: phoneError(values.phone),
  };
  if (options.needsLabel) errors.label = required(values.label, 'Ponle un nombre, por ejemplo Casa.');
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message)) as AddressErrors;
}
