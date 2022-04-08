import { createContext, useState, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { client } from '@/lib/algorand';
import { WalletContext } from './WalletContext';

export type WalletFunds = {
  balanceAlgo: number | undefined;
  balanceAlgoUSD: number | undefined;
};

export type AlgorandUsdType = {
  algorand: { usd: number };
};

export type WalletFundsContextType = {
  data: AlgorandUsdType | undefined;
  algorand: AlgorandUsdType['algorand'];
  isLoading: boolean;
  error: unknown;
};

type WalletFundsContextProviderProps = {
  children: React.ReactNode;
};

export const WalletFundsContext = createContext<WalletFunds | null>(null);

const fetchAlgoUsd = async () => {
  const res = await axios.get(
    'https://api.coingecko.com/api/v3/simple/price?ids=algorand&vs_currencies=usd'
  );
  const data = await res.data;

  return data;
};

export const WalletFundsContextProvider = ({ children }: WalletFundsContextProviderProps) => {
  const { data, isLoading, error } = useQuery<WalletFundsContextType>('algoBalance', fetchAlgoUsd);
  const walletContext = useContext(WalletContext);
  const account = walletContext?.userWallet?.account;

  const [balanceAlgo, setBalanceAlgo] = useState<number>();
  const [balanceAlgoUSD, setBalanceAlgoUSD] = useState<number>();

  useEffect(() => {
    getBalanceAccount(account);
  }, [account, data]);

  const getBalanceAccount = async (account?: string) => {
    if (account != null) {
      const algodClient = client();
      const accountInfo = await algodClient.accountInformation(account).do();
      const startingAmount = accountInfo.amount;
      const balanceAlgo = Number((startingAmount / 1000000).toFixed(2));
      setBalanceAlgo(balanceAlgo);
      if (data && balanceAlgo) {
        const balanceUSD = Number((balanceAlgo * data.algorand.usd).toFixed(2));
        setBalanceAlgoUSD(balanceUSD);
      }
    }
  };

  const walletFunds: WalletFunds = {
    balanceAlgo: balanceAlgo,
    balanceAlgoUSD: balanceAlgoUSD,
  };

  return <WalletFundsContext.Provider value={walletFunds}>{children}</WalletFundsContext.Provider>;
};
