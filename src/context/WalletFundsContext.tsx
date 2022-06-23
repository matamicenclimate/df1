import { createContext, useState, useEffect, useContext } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { client } from '@/lib/algorand';
import { useWalletContext } from './WalletContext';

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
  const { walletAccount } = useWalletContext();

  const [balanceAlgo, setBalanceAlgo] = useState<number>();
  const [balanceAlgoUSD, setBalanceAlgoUSD] = useState<number>();

  useEffect(() => {
    getBalanceAccount(walletAccount);
  }, [walletAccount, data]);

  const getBalanceAccount = async (account?: string) => {
    if (account != null) {
      const algodClient = client();
      const accountInfo = await algodClient.accountInformation(account).do();
      const startingAmount = accountInfo.amount;
      const balanceAlgo = Number((startingAmount / 1000000).toFixed(2));
      setBalanceAlgo(balanceAlgo);
      console.log('balanceAlgobalanceAlgobalanceAlgobalanceAlgo', balanceAlgo);
      console.log('datadatadatadata', data);

      if (data !== undefined && balanceAlgo !== undefined) {
        const balanceUSD = Number((balanceAlgo * data?.algorand?.usd).toFixed(2));
        console.log('balanceUSDbalanceUSDbalanceUSD', balanceUSD);

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

export const useWalletFundsContext = () => {
  const walletFundsContext = useContext(WalletFundsContext);

  console.log(
    'walletFundsContextwalletFundsContextwalletFundsContextwalletFundsContext',
    walletFundsContext
  );

  return {
    balanceAlgo: walletFundsContext?.balanceAlgo,
    balanceAlgoUSD: walletFundsContext?.balanceAlgoUSD,
  };
};
