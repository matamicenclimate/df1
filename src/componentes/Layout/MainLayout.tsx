import { useAuth } from '@/lib/auth';
import { Link, useLocation } from 'react-router-dom';
import { useWindowSize } from '@/hooks/useResize';
import NavbarMobile from '../NavbarMobile/NavbarMobile';
import { AlgoWalletConnector } from '../Wallet/AlgoWalletConnector';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const Footer = () => {
  return (
    <footer className="absolute bottom-0 h-12 bg-custom-blue md:bg-custom-white w-full ">
      <div className="p-3 flex justify-around text-custom-white md:text-black md:border">
        <Link to="/">Terms and Conditions</Link>
        <Link to="/">Privacy Policy</Link>
      </div>
    </footer>
  );
};

export const Navbar = () => {
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split('/');

  // const auth = useAuth();
  // const handleLogout = () => {
  //   auth.logout();
  // };

  return (
    <nav className="p-4 border flex gap-4 mb-4 justify-between items-center">
      <li>
        <Link to="/">
          <h1 className="text-2xl font-bold">Climate NFT Marketplace</h1>
        </Link>
      </li>
      <li className={splitLocation[1] === '' ? 'active' : ''}>
        <Link to="/">
          <h2 className="hover:font-bold">Explore</h2>
        </Link>
      </li>
      <li className={splitLocation[1] === 'mint' ? 'active' : ''}>
        <Link to="/mint">
          <h2 className="hover:font-bold">Mint</h2>
        </Link>
      </li>
      <li className={splitLocation[1] === 'cause' ? 'active' : ''}>
        <Link to="/cause">
          <h2 className="hover:font-bold">Cause</h2>
        </Link>
      </li>
      <li className={splitLocation[1] === 'admin' ? 'active' : ''}>
        <Link to="/admin">
          <h2 className="hover:font-bold">Admin</h2>
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
  const [width, height] = useWindowSize();

  return (
    <div className="relative mx-auto min-h-screen flex flex-col bg-custom-gray md:bg-custom-white">
      {width >= 768 ? <Navbar /> : <NavbarMobile />}
      <div className="mt-14 bg-custom-gray text-white md:text-black md:bg-custom-white  md:mt-3 pb-12 mb-12">
        {children}
      </div>
      <Footer />
    </div>
  );
};
