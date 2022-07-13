import { TFunction } from 'i18next';
import { Controller } from 'react-hook-form';
import ReactSelect from 'react-select';

type SelectProps = {
  name: string;
  options: { value: any; label: string | TFunction }[];
  isMulti?: boolean;
};

export const Select = ({ name, options, isMulti = false }: SelectProps) => {
  return (
    <Controller
      name={name}
      // this is inyected by the <Form /> component
      // control={control}
      render={({ field }) => <ReactSelect {...field} options={options} isMulti={isMulti} />}
    />
  );
};
