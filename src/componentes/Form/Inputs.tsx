import clsx from 'clsx';
import { DetailedHTMLProps, SelectHTMLAttributes } from 'react';
import { Path, UseFormRegister } from 'react-hook-form';
import { InputProps } from 'react-select';

export interface InputRegistryOption<T> {
  // register: (name?: string) => Record<string, unknown>;
  register: UseFormRegister<T>;
}

const classListByType = {
  search: [],
} as Record<string, string[]>;

const defaultClasses = [''];

export function Input<T, P>({
  register,
  name,
  className,
  ...rest
}: Omit<Partial<InputProps>, 'name'> & { name: P } & InputRegistryOption<T>) {
  return (
    <input
      className={clsx(
        ...[className],
        ...defaultClasses,
        ...(classListByType[rest.type ?? ''] ?? [])
      )}
      {...register(name as Path<unknown>)}
      {...rest}
    />
  );
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
