import { useState, createContext, useEffect, useContext } from 'react';
import { Wallet } from 'algorand-session-wallet';
import * as WalletAccountProvider from '@common/src/services/WalletAccountProvider';
import SessionWalletAccountProvider from '../service/impl/SessionWalletAccountProvider';
import * as TransactionSigner from '@common/src/services/TransactionSigner';
import SimpleTransactionSigner from '@/service/impl/SimpleTransactionSigner';
import { some } from '@octantis/option';
import { Listing } from '@common/src/lib/api/entities';

export type CheckoutContextType = {
  nftPurchased: Listing | null;
  setNftPurchased: React.Dispatch<React.SetStateAction<Listing | null>>;
};

type CheckoutContextProviderProps = {
  children: React.ReactNode;
};

export const CheckoutContext = createContext<CheckoutContextType | null>(null);

export const CheckoutContextProvider = ({ children }: CheckoutContextProviderProps) => {
  const [nftPurchased, setNftPurchased] = useState<Listing | null>(null);

  console.log('nftPurchased', nftPurchased);

  return (
    <CheckoutContext.Provider value={{ nftPurchased, setNftPurchased }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckoutContext = () => {
  const checkoutContext = useContext(CheckoutContext);
  const nftPurchased = checkoutContext?.nftPurchased;
  const setNftPurchased = checkoutContext?.setNftPurchased;

  return {
    nftPurchased,
    setNftPurchased,
  };
};
