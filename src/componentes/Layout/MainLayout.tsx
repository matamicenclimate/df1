// import { useAuth } from '@/lib/auth';
import { Link, useLocation } from 'react-router-dom';
import { Footer } from '@/componentes/Footer/Footer';
import { AlgoWalletConnector } from '../Wallet/AlgoWalletConnector';
import climateTradeLogo from '../../assets/cliamteTradeLogo.svg';
import { WalletFundsContext } from '@/context/WalletFundsContext';
import { useContext } from 'react';
import algoLogo from '../../assets/algoLogo.svg';
import { WalletContext } from '@/context/WalletContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const Navbar = () => {
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split('/');

  const walletFundsContext = useContext(WalletFundsContext);
  const walletContext = useContext(WalletContext);

  const userWallet = walletContext?.userWallet?.account;

  // const auth = useAuth();
  // const handleLogout = () => {
  //   auth.logout();
  // };

  return (
    <nav className="p-4 border flex gap-4 justify-between items-center font-dinpro text-sm">
      <li>
        <Link to="/">
          <img src={climateTradeLogo} alt="climateTradeLogo" />
        </Link>
      </li>
      <li className={splitLocation[1] === '' ? 'active' : ''}>
        <Link to="/">
          <p className="hover:font-bold">Explore</p>
        </Link>
      </li>
      <li className={splitLocation[1] === 'mint' ? 'active' : ''}>
        <Link to="/mint">
          <p className="hover:font-bold">Mint</p>
        </Link>
      </li>
      <li className="flex flex-col">
        <AlgoWalletConnector isNavbar />
        {userWallet && walletFundsContext?.balanceAlgo && walletFundsContext?.balanceAlgoUSD && (
          <div className="mr-7">
            <div className="flex ">
              <h6 className="font-normal text-climate-blue font-dinpro text-base mr-2">
                {walletFundsContext?.balanceAlgo}
              </h6>
              <img className="w-4 h-4" src={algoLogo} alt="algoLogo" />
            </div>
            <div className="flex">
              <h6 className="font-normal text-climate-blue font-dinpro text-base mr-2 self-center">
                {walletFundsContext?.balanceAlgoUSD}
              </h6>
              <span className="text-xl text-climate-blue">$</span>
            </div>
          </div>
        )}
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
