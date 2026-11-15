import type { HTMLInputTypeAttribute } from 'react';
import { field, fieldHint, fieldInput, fieldLabel, fieldWide } from '../ui';

interface FieldProps {
  id: string;
  label: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  defaultValue?: string;
  hint?: string;
  wide?: boolean;
  inputMode?: 'numeric' | 'tel' | 'email' | 'text';
}

export function Field({ id, label, type = 'text', placeholder, autoComplete, defaultValue, hint, wide, inputMode }: FieldProps) {
  return (
    <div className={wide ? fieldWide : field}>
      <label className={fieldLabel} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        className={fieldInput}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        inputMode={inputMode}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
      {hint && (
        <p className={fieldHint} id={`${id}-hint`}>
          {hint}
        </p>
      )}
    </div>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  options: string[];
  placeholder?: string;
  wide?: boolean;
}

export function SelectField({ id, label, options, placeholder, wide }: SelectFieldProps) {
  return (
    <div className={wide ? fieldWide : field}>
      <label className={fieldLabel} htmlFor={id}>
        {label}
      </label>
      <select id={id} name={id} className={fieldInput} defaultValue="">
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
    </div>
  );
}
