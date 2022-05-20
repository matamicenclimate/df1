// import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';
import { Footer } from '@/componentes/Footer/Footer';
import { AlgoWalletConnector } from '../Wallet/AlgoWalletConnector';
import climateTradeLogo from '../../assets/climateTradeLogo.svg';
import { useWalletFundsContext } from '@/context/WalletFundsContext';
import { useWalletContext } from '@/context/WalletContext';
import { Tab } from './Tab';
import BalanceDisplay from './BalanceDisplay';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const Navbar = () => {
  const { balanceAlgo, balanceAlgoUSD } = useWalletFundsContext();
  const { walletAccount } = useWalletContext();

  return (
    <nav className="p-4 border flex gap-4 justify-evenly items-center font-dinpro text-sm">
      <li>
        <Link to="/">
          <img src={climateTradeLogo} alt="climateTradeLogo" />
        </Link>
      </li>
      <Tab to="/">Explore</Tab>
      <Tab to="/mint">Mint</Tab>
      <Tab to="/my-nfts">My NFTs</Tab>
      <li className="flex flex-col">
        <AlgoWalletConnector isNavbar />
        <BalanceDisplay
          wallet={walletAccount}
          balanceAlgo={balanceAlgo}
          balanceAlgoUSD={balanceAlgoUSD}
        />
      </li>
      {/* <div className="flex gap-4">
        {auth.user && (
          <>
            <Link to="profile">profile</Link>
            <MenuLink text="logout" action={handleLogout} />
          </>
        )}
        {!auth.user && (
          <>
            <Link to="/auth/login">login</Link>
            <Link to="/auth/register">register</Link>
          </>
        )}
      </div> */}
    </nav>
  );
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="mx-auto flex flex-col">
      <Navbar />
      <div className="pt-12 bg-climate-action-light flex-1 pb-80">{children}</div>
      <Footer />
    </div>
  );
};
