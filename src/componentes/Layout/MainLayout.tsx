import * as React from 'react';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';
import { Button } from '@/componentes/Elements/Button/Button';
import { useWindowSize } from '@/hooks/useResize';
import NavbarMobile from '../NavbarMobile/NavbarMobile';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const Footer = () => {
  return (
    <footer className="bg-custom-blue md:bg-custom-white w-full fixed bottom-0">
      <div className="p-4 flex justify-around text-custom-white md:text-black md:border">
        <Link to="/">Terms and Conditions</Link>
        <Link to="/">Privacy Policy</Link>
      </div>
    </footer>
  );
};

export const Navbar = () => {
  const MenuLink = ({ text, action }: any) => {
    return <button onClick={action}>{text}</button>;
  };

  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
  };

  return (
    <div className="p-4 border flex gap-4 mb-4 justify-between items-center">
      <div>
        <Link to="/">
          <h1 className="text-4xl font-bold">Climate NFT Marketplace</h1>
        </Link>
      </div>
      <div>
        <Link to="/">
          <h2 className="hover:font-bold">Explore</h2>
        </Link>
      </div>
      <div>
        <Link to="/mint">
          <h2 className="hover:font-bold">Mint</h2>
        </Link>
      </div>
      <div>
        <Button>Connect Wallet</Button>
      </div>

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
    </div>
  );
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [width, height] = useWindowSize();

  return (
    <div className=" mx-auto min-h-screen flex flex-col">
      {width >= 768 ? <Navbar /> : <NavbarMobile />}
      <div className="mt-14 bg-custom-gray md:bg-custom-white md:mt-3 mb-11">{children}</div>
      <Footer />
    </div>
  );
};
