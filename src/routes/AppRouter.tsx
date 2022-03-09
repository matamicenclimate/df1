import { useRoutes } from 'react-router-dom';
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';
import { Landing } from '@/features/misc/routes/Landing';
import { Minter } from '@/features/misc/routes/Minter';
import { useAuth } from '@/lib/auth';

import { useContext } from 'react';
import { UserWalletContext } from '@/context/UserContext';
import { AlgoWalletConnector } from '@/componentes/Wallet/AlgoWalletConnector';
import { ConnectWallet } from '@/features/misc/routes/ConnectWallet';

export const AppRouter = () => {
  const auth = useAuth();
  const userWalletContext = useContext(UserWalletContext);

  console.log('this is user context from appRouter', userWalletContext);

  const commonRoutes = [
    { path: '/', element: <Landing /> },
    {
      path: '/mint',
      element:
        userWalletContext?.userWallet?.account === '' ? (
          <ConnectWallet />
        ) : (
          <Minter
            wallet={userWalletContext?.userWallet?.wallet}
            account={userWalletContext?.userWallet?.account}
          />
        ),
    },
  ];

  const routes = auth.user ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes, ...commonRoutes]);

  return <>{element}</>;
};
