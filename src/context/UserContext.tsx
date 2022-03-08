import { useState, createContext } from 'react';
import { Wallet } from 'algorand-session-wallet';

export type AuthUserWallet = {
  wallet: Wallet;
  account: string | undefined;
};

type UserWalletContextType = {
  userWallet: AuthUserWallet | null;
  setUserWallet: React.Dispatch<React.SetStateAction<AuthUserWallet | null>>;
};

type AuthWalletContextProviderProps = {
  children: React.ReactNode;
};

export const UserWalletContext = createContext<UserWalletContextType | null>(null);

export const UserContextProvider = ({ children }: AuthWalletContextProviderProps) => {
  const [userWallet, setUserWallet] = useState<AuthUserWallet | null>(null);

  return (
    <UserWalletContext.Provider value={{ userWallet, setUserWallet }}>
      {children}
    </UserWalletContext.Provider>
  );
};
