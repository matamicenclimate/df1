import { Listing } from '@common/src/lib/api/entities';
import { retrying } from '@common/src/lib/net';
import NetworkClient from '@common/src/services/NetworkClient';
import { createContext, useContext } from 'react';
import { useQuery } from 'react-query';
import Container from 'typedi';

type NftsContextProviderType = {
  children: React.ReactNode;
};

type NftsContextType = {
  data: Listing[] | undefined;
  isLoading: boolean;
  error: unknown;
};

const net = Container.get(NetworkClient);

export const NftsContext = createContext<NftsContextType | null>(null);

const fetchAssets = async () => {
  const res = await retrying(net.core.get('assets'));
  console.log('Current assets manifest:', res.data.assets);
  // setList(res.data.assets);
  return res.data.assets;
};

export const NftsContextProvider = ({ children }: NftsContextProviderType) => {
  const { data, isLoading, error } = useQuery<Listing[]>('nfts', fetchAssets);

  return <NftsContext.Provider value={{ data, isLoading, error }}>{children}</NftsContext.Provider>;
};

export const useNftsContext = () => {
  const nftsContext = useContext(NftsContext);
  const data = nftsContext?.data;

  return {
    nfts: data,
  };
};
