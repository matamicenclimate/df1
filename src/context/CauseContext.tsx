import { createContext } from 'react';
import { httpClientCauses } from '@/lib/httpClient';
import { useQuery } from 'react-query';
import { Cause } from '@/lib/api/causes';

export type CauseContextType = {
  data: Cause[] | undefined;
  isLoading: boolean;
  error: unknown;
};

type CauseContextProviderProps = {
  children: React.ReactNode;
};

export const CauseContext = createContext<CauseContextType | null>(null);

const fetchCauses = async () => {
  const res = await httpClientCauses.get('causes');
  return res.data;
};

export const CauseContextProvider = ({ children }: CauseContextProviderProps) => {
  const { data, isLoading, error } = useQuery<Cause[]>('causes', fetchCauses);

  return (
    <CauseContext.Provider value={{ data, isLoading, error }}>{children}</CauseContext.Provider>
  );
};
