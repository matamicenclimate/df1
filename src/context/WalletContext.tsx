import { useState, createContext, useEffect } from 'react';
import { Wallet } from 'algorand-session-wallet';

export type UserWallet = {
  wallet: Wallet | undefined;
  account: string | undefined;
};

export type WalletContextType = {
  userWallet: UserWallet | null;
  setUserWallet: React.Dispatch<React.SetStateAction<UserWallet | null>>;
};

type WalletContextProviderProps = {
  children: React.ReactNode;
};

export const WalletContext = createContext<WalletContextType | null>(null);

export const UserContextProvider = ({ children }: WalletContextProviderProps) => {
  const [userWallet, setUserWallet] = useState<UserWallet | null>(null);

  return (
    <WalletContext.Provider value={{ userWallet, setUserWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
