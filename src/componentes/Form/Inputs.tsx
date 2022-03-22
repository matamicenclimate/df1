import { DetailedHTMLProps, SelectHTMLAttributes } from 'react';
import { InputProps } from 'react-select';

export interface InputRegistryOption {
  register: (name?: string) => Record<string, unknown>;
}

export function Input({ register, name, ...rest }: Partial<InputProps> & InputRegistryOption) {
  return <input className="border" {...register(name)} {...rest} />;
}

export function Select({
  register,
  options,
  name,
  ...rest
}: Pick<InputProps, 'options'> &
  DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> &
  InputRegistryOption) {
  return (
    <select {...register(name)} {...rest}>
      {options.map((value: any) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
}
