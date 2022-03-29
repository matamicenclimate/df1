import { useRoutes } from 'react-router-dom';
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';
import { Landing } from '@/features/misc/routes/Landing';
import { Minter } from '@/features/misc/routes/Minter';
import { useAuth } from '@/lib/auth';
import { ConnectWallet } from '@/features/misc/routes/ConnectWallet';
import { Cause } from '@/features/misc/routes/Cause';
import { useContext } from 'react';
import { WalletContext } from '@/context/WalletContext';
import { NftDetail } from '@/features/misc/routes/NftDetail';

export const AppRouter = () => {
  // We're not using magiclink at the moment, but it may be needed soon.
  // Do not remove.
  const auth = { user: false } || useAuth();

  const walletContext = useContext(WalletContext);

  const commonRoutes = [
    { path: '/', element: <Landing /> },
    {
      path: '/mint',
      element:
        walletContext?.userWallet?.account === '' ? (
          <ConnectWallet />
        ) : (
          <Minter
            wallet={walletContext?.userWallet?.wallet}
            account={walletContext?.userWallet?.account}
          />
        ),
    },
    {
      path: '/cause',
      element: <Cause />,
    },
    {
      path: '/nft/:ipnft',
      element: <NftDetail />,
    },
  ];

  const routes = auth.user ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes, ...commonRoutes]);

  return <>{element}</>;
};
