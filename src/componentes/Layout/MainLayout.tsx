import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';
import { Button } from '@/componentes/Elements/Button/Button';
import { useWindowSize } from '@/hooks/useResize';
import NavbarMobile from '../NavbarMobile/NavbarMobile';
import { AlgoWalletConnector } from '../Wallet/AlgoWalletConnector';
import { SessionWallet } from 'algorand-session-wallet';

interface MainLayoutProps {
  children: React.ReactNode;
}

const ps = {
  algod: {
    server: 'https://testnet.algoexplorerapi.io',
    port: 0,
    token: '',
    network: 'TestNet',
  },
};

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
        <AlgoWalletConnector isNavbar />
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
    <div className="relative mx-auto min-h-screen flex flex-col bg-custom-gray md:bg-custom-white">
      {width >= 768 ? <Navbar /> : <NavbarMobile />}
      {/* <div className="mt-14 bg-custom-gray md:bg-custom-white md:mt-3 mb-11 ">{children}</div> */}
      <div className="mt-14 bg-custom-gray text-white md:text-black md:bg-custom-white  md:mt-3 pb-12 ">
        {children}
      </div>
      <Footer />
    </div>
  );
};
