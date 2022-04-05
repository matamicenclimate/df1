// import { useAuth } from '@/lib/auth';
import { Link, useLocation } from 'react-router-dom';
import { useWindowSize } from '@/hooks/useResize';
import NavbarMobile from '../NavbarMobile/NavbarMobile';
import { Footer } from '@/componentes/Footer/Footer';
import { AlgoWalletConnector } from '../Wallet/AlgoWalletConnector';
import climateTradeLogo from '../../assets/cliamteTradeLogo.svg';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const Navbar = () => {
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split('/');

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
      <li className={splitLocation[1] === 'cause' ? 'active' : ''}>
        <Link to="/cause">
          <p className="hover:font-bold">Cause</p>
        </Link>
      </li>
      <li>
        <AlgoWalletConnector isNavbar />
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
  const [width] = useWindowSize();

  return (
    <div className="relative mx-auto min-h-screen flex flex-col">
      {width >= 768 ? <Navbar /> : <NavbarMobile />}
      <div className="pb-12 pt-12 bg-custom-white">{children}</div>
      <Footer />
    </div>
  );
};
