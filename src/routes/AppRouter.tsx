import { useRoutes } from 'react-router-dom';
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';
import { Landing } from '@/features/misc/routes/Landing';
import { Minter } from '@/features/misc/routes/Minter';
import { useAuth } from '@/lib/auth';
import useWallet from '@/hooks/useWallet';
import { ConnectWallet } from '@/features/misc/routes/ConnectWallet';
import { Cause } from '@/features/misc/routes/Cause';

export const AppRouter = () => {
  // We're not using magiclink at the moment, but it may be needed soon.
  // Do not remove.
  const auth = { user: false } || useAuth();
  const [wallet] = useWallet();
  const commonRoutes = [
    { path: '/', element: <Landing /> },
    {
      path: '/mint',
      element: wallet
        .map(() => <Minter key="mint-or-connect" />)
        .getOrElse(<ConnectWallet key="mint-or-connect" />),
    },
    {
      path: '/cause',
      element: <Cause />,
    },
  ];

  const routes = auth.user ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes, ...commonRoutes]);

  return <>{element}</>;
};
