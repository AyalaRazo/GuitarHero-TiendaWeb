import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { EMPTY_ADDRESS, validateAddress } from '../lib/address';
import type { AddressErrors } from '../lib/address';
import { focusFirstError } from '../lib/forms';
import { STATES } from '../data/states';
import type { AddressInput } from '../store/addresses';
import { btn, formGrid } from '../ui';
import { Field, SelectField } from './Field';

interface AddressFormProps {
  initial?: AddressInput;
  submitLabel: string;
  onSubmit: (values: AddressInput) => void;
  onCancel: () => void;
}

/* Formulario de dirección con validación; lo usa Mis direcciones tanto para crear como para editar */
export function AddressForm({ initial = EMPTY_ADDRESS, submitLabel, onSubmit, onCancel }: AddressFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<AddressInput>(initial);
  const [errors, setErrors] = useState<AddressErrors>({});

  const bind = (key: keyof AddressInput) => ({
    value: values[key],
    error: errors[key],
    onChange: (event: { target: { value: string } }) => {
      setValues((current) => ({ ...current, [key]: event.target.value }));
      if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const found = validateAddress(values, { needsLabel: true });
    if (Object.keys(found).length > 0) {
      setErrors(found);
      focusFirstError(formRef.current);
      return;
    }
    onSubmit({ ...values, label: values.label.trim(), name: values.name.trim(), phone: values.phone.trim() });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className={formGrid}>
        <Field id="a-nombre-dir" label="Nombre de la dirección" placeholder="Casa, Trabajo..." {...bind('label')} wide />
        <Field id="a-nombre" label="Nombre de quien recibe" autoComplete="name" {...bind('name')} wide />
        <Field id="a-calle" label="Calle y número" autoComplete="address-line1" {...bind('street')} wide />
        <Field id="a-colonia" label="Colonia" autoComplete="address-level3" {...bind('colony')} />
        <Field id="a-cp" label="Código postal" inputMode="numeric" maxLength={5} autoComplete="postal-code" {...bind('zip')} />
        <Field id="a-ciudad" label="Ciudad o municipio" autoComplete="address-level2" {...bind('city')} />
        <SelectField id="a-estado" label="Estado" options={STATES} placeholder="Elige un estado" {...bind('state')} />
        <Field id="a-tel" label="Teléfono" type="tel" inputMode="numeric" placeholder="10 dígitos" autoComplete="tel" {...bind('phone')} wide />
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-[0.6rem]">
        <button className={btn('lineaOscura')} type="button" onClick={onCancel}>
          Cancelar
        </button>
        <button className={btn('oscuro')} type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
