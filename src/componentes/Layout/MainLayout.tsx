// import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';
import { Footer } from '@/componentes/Footer/Footer';
import { AlgoWalletConnector } from '../Wallet/AlgoWalletConnector';
import climateTradeLogo from '../../assets/cliamteTradeLogo.svg';
import { WalletFundsContext } from '@/context/WalletFundsContext';
import { useContext } from 'react';
import { WalletContext } from '@/context/WalletContext';
import { Tab } from './Tab';
import BalanceDisplay from './BalanceDisplay';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const Navbar = () => {
  const walletFundsContext = useContext(WalletFundsContext);
  const walletContext = useContext(WalletContext);
  const userWallet = walletContext?.userWallet?.account;
  return (
    <nav className="p-4 border flex gap-4 justify-between items-center font-dinpro text-sm">
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
        <BalanceDisplay wallet={userWallet} funds={walletFundsContext} />
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
    <div className="relative mx-auto min-h-screen flex flex-col">
      <Navbar />
      <div className="pb-12 pt-12 bg-custom-white">{children}</div>
      <Footer />
    </div>
  );
};
