import { useRoutes } from 'react-router-dom';
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';
import { Landing } from '@/features/misc/routes/Landing';
import { Minter } from '@/features/misc/routes/Minter';
// import { useAuth } from '@/lib/auth';
import { NftDetail } from '@/features/misc/routes/NftDetail';
import MyNftList from '@/features/misc/routes/MyNftList';
import { RequiresWallet } from '@/componentes/Wallet/RequiresWallet';

export const AppRouter = () => {
  // We're not using magiclink at the moment, but it may be needed soon.
  // Do not remove.
  const auth = { user: false }; //|| useAuth();

  const commonRoutes = [
    { path: '/', element: <Landing /> },
    {
      path: '/mint',
      element: <RequiresWallet element={Minter} />,
    },
    {
      path: '/nft/:ipnft',
      element: <NftDetail />,
    },
    {
      path: '/my-nfts',
      element: <RequiresWallet element={MyNftList} />,
    },
  ];

  const routes = auth.user ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes, ...commonRoutes]);

  return <>{element}</>;
};
