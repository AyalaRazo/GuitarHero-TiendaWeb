import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { field, fieldHint, fieldInput, fieldLabel, fieldWide } from '../ui';

/* Mensaje de error de un campo. Se lee junto con el campo gracias a aria-describedby. */
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="text-sm font-semibold text-sunburst-rojo" id={id}>
      {message}
    </p>
  );
}

const describedBy = (id: string, hint?: string, error?: string): string | undefined => {
  const ids = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ');
  return ids || undefined;
};

const INVALID = 'border-sunburst-rojo!';

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className' | 'name'> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  wide?: boolean;
}

export function Field({ id, label, hint, error, wide, ...input }: FieldProps) {
  return (
    <div className={wide ? fieldWide : field}>
      <label className={fieldLabel} htmlFor={id}>
        {label}
      </label>
      <input
        {...input}
        id={id}
        name={id}
        className={`${fieldInput} ${error ? INVALID : ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
      />
      {hint && (
        <p className={fieldHint} id={`${id}-hint`}>
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'className' | 'name'> {
  id: string;
  label: string;
  options: string[];
  placeholder?: string;
  error?: string;
  wide?: boolean;
}

export function SelectField({ id, label, options, placeholder, error, wide, ...select }: SelectFieldProps) {
  return (
    <div className={wide ? fieldWide : field}>
      <label className={fieldLabel} htmlFor={id}>
        {label}
      </label>
      <select
        {...select}
        id={id}
        name={id}
        className={`${fieldInput} ${error ? INVALID : ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, undefined, error)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}
