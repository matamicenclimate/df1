import { createContext, useEffect, useState } from 'react';

export type LanguageContextType = {
  languageSelected: string | undefined;
  setLanguageSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
};

type LanguageContextProviderProps = {
  children: React.ReactNode;
};

export const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageContextProvider = ({ children }: LanguageContextProviderProps) => {
  const [languageSelected, setLanguageSelected] = useState<string | undefined>();

  useEffect(() => {
    const localData = localStorage.getItem('language');
    console.log('localData', localData);
    if (localData) setLanguageSelected(localData);
  }, [languageSelected]);

  console.log('languageSelected from context', languageSelected);

  return (
    <LanguageContext.Provider value={{ languageSelected, setLanguageSelected }}>
      {children}
    </LanguageContext.Provider>
  );
};
