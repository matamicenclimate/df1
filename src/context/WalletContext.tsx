import { useState, createContext, useEffect, useContext } from 'react';
import { Wallet } from 'algorand-session-wallet';
import * as WalletAccountProvider from '@common/src/services/WalletAccountProvider';
import SessionWalletAccountProvider from '../service/impl/SessionWalletAccountProvider';
import * as TransactionSigner from '@common/src/services/TransactionSigner';
import SimpleTransactionSigner from '@/service/impl/SimpleTransactionSigner';
import { some } from '@octantis/option';

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

  useEffect(() => {
    if (userWallet == null || userWallet.account == null || userWallet.wallet == null) return;
    (TransactionSigner.get() as SimpleTransactionSigner).wallet = some(userWallet.wallet);
    (WalletAccountProvider.get() as SessionWalletAccountProvider).account = {
      addr: userWallet.account,
      sk: Uint8Array.from([]),
    };
  }, [userWallet]);

  return (
    <WalletContext.Provider value={{ userWallet, setUserWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const walletContext = useContext(WalletContext);
  const userWallet = walletContext?.userWallet;
  const walletAccount = userWallet?.account;
  const wallet = userWallet?.wallet;
  const setUserWallet = walletContext?.setUserWallet;

  return {
    userWallet,
    setUserWallet,
    walletAccount,
    wallet,
  };
};
