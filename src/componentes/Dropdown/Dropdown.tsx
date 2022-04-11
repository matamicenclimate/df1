import React from 'react';

type DropdownProps = {
  defaultValue?: string;
  options?: string[];
  setOptionSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const Dropdown = ({ options, setOptionSelected }: DropdownProps) => {
  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setOptionSelected(value);
  };

  return (
    <>
      <select
        className="font-normal font-dinpro text-climate-gray-artist text-sm"
        onChange={selectChange}
      >
        {options?.map((addr, idx) => {
          return (
            <option value={addr} key={idx}>
              {addr}
            </option>
          );
        })}
      </select>
    </>
  );
};
