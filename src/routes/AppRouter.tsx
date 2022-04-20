import { useRoutes } from 'react-router-dom';
import { Landing } from '@/features/misc/routes/Landing';
import { Minter } from '@/features/misc/routes/Minter';
// import { useAuth } from '@/lib/auth';
import { NftDetail } from '@/features/misc/routes/NftDetail';
import MyNftList from '@/features/misc/routes/MyNftList';
import { RequiresWallet } from '@/componentes/Wallet/RequiresWallet';

export const AppRouter = () => {
  const element = useRoutes([
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
    {
      path: '*',
      element: <Landing />,
    },
  ]);
  return <>{element}</>;
};
