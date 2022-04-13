import { DetailedHTMLProps, SelectHTMLAttributes } from 'react';
import { Path, UseFormRegister } from 'react-hook-form';
import { InputProps } from 'react-select';

export interface InputRegistryOption<T> {
  // register: (name?: string) => Record<string, unknown>;
  register: UseFormRegister<T>;
}

export function Input<T, P>({
  register,
  name,
  ...rest
}: Omit<Partial<InputProps>, 'name'> & { name: P } & InputRegistryOption<T>) {
  return <input className="border" {...register(name as Path<unknown>)} {...rest} />;
}

export function Select<T, P extends string>({
  register,
  options,
  name,
  ...rest
}: Omit<Pick<InputProps, 'options'>, 'name'> & { name: P } & DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > &
  InputRegistryOption<T>) {
  return (
    <select {...register(name as Path<unknown>)} {...rest}>
      {options.map((value: any) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
}
