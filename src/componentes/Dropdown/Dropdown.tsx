import React, { useState } from 'react';

type Dropdown3Props = {
  defaultValue?: string;
  accts: string[];
  setOptionSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const Dropdown = ({ defaultValue, accts, setOptionSelected }: Dropdown3Props) => {
  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setOptionSelected(value);
  };

  return (
    <>
      <span className="h-3 w-3 bg-green-500 rounded-full inline-block"></span>
      <select className="mr-2 font-bold" onChange={selectChange}>
        {accts.map((addr, idx) => {
          return (
            <option value={addr} key={idx}>
              {addr.substr(0, 8)}...{' '}
            </option>
          );
        })}
      </select>
    </>
  );
};
