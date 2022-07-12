import clsx from 'clsx';
import React, { DetailedHTMLProps, Key, SelectHTMLAttributes } from 'react';
import { Path, UseFormRegister } from 'react-hook-form';
import { InputProps } from 'react-select';
import { IconMagnify } from '../Icons';

export interface InputRegistryOption<T> {
  // register: (name?: string) => Record<string, unknown>;
  register: UseFormRegister<T>;
}

type TypeRecord<A> = {
  [K in React.HTMLInputTypeAttribute]?: A;
};

const classListByType = {
  search: [],
} as TypeRecord<string[]>;

const extras = {
  search: <IconMagnify className="stroke-climate-gray-light mr-5" />,
} as TypeRecord<JSX.Element>;

const defaultClasses = [''];

export function Input<T, P>({
  register,
  name,
  className,
  ...rest
}: Omit<Partial<InputProps>, 'name'> & { name: P } & InputRegistryOption<T>) {
  return (
    <div className="flex items-center">
      {extras[rest.type ?? ''] ?? null}
      <input
        className={clsx(
          ...[className],
          ...defaultClasses,
          ...(classListByType[rest.type ?? ''] ?? [])
        )}
        {...register(name as Path<unknown>)}
        {...rest}
      />
    </div>
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
      {options.map((value) => (
        <option key={value as Key} value={value as string | number | readonly string[] | undefined}>
          {value as string | null}
        </option>
      ))}
    </select>
  );
}
