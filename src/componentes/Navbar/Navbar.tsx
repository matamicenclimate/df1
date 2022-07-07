// import { useAuth } from '@/lib/auth';
import { useWalletContext } from '@/context/WalletContext';
import { useWalletFundsContext } from '@/context/WalletFundsContext';
import { Link, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import { Tab } from '../Layout/Tab';
import climateTradeLogo from '../../assets/climateTradeLogo.svg';
import heroImg from '../../assets/heroImg.jpg';
import { AlgoWalletConnector } from '../Wallet/AlgoWalletConnector';
import BalanceDisplay from '../Layout/BalanceDisplay';
import CurrentNFTInfo from '@/features/misc/state/CurrentNFTInfo';
import { option } from '@octantis/option';

type NavbarPropsType = {
  nft?: option<CurrentNFTInfo>;
};

export const Navbar = ({ nft }: NavbarPropsType) => {
  const { balanceAlgo, balanceAlgoUSD } = useWalletFundsContext();
  const { walletAccount } = useWalletContext();
  const location = useLocation();
  const isNftDetail = location.pathname.includes('/nft/');
  const nftDetailImg = nft?.isDefined() && nft?.value?.nft?.asset?.imageUrl;
  const headerImg = isNftDetail ? nftDetailImg : heroImg;

  return (
    <div className="relative">
      <nav
        className="px-16 py-2 border h-[380px] flex gap-4 justify-evenly font-inter text-base text-white"
        style={{
          backgroundImage: `linear-gradient(to left top, rgba(255,255,255,0.2) 20%,rgba(0,58,108,0.7) 50%), url(${headerImg})`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <ul className="w-full flex justify-evenly items-start">
          <li className="">
            <Link to="/">
              <img src={climateTradeLogo} alt="climateTradeLogo" />
            </Link>
          </li>
          <div className="flex-1" />
          <div className="flex gap-4">
            <Tab to="/">NFTs market</Tab>
            <Tab to="/mint">Mint</Tab>
            <Tab to="/causes">Causes</Tab>
            <li className={`flex items-center`}>
              <Link to="/my-nfts">
                <p className="flex items-center rounded-3xl border border-white p-3 hover:font-bold">
                  My NFTs
                </p>
              </Link>
            </li>
            <li className="flex flex-col">
              <AlgoWalletConnector isNavbar />
              <BalanceDisplay
                wallet={walletAccount}
                balanceAlgo={balanceAlgo}
                balanceAlgoUSD={balanceAlgoUSD}
              />
            </li>
          </div>
        </ul>
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
      <div className="absolute max-w-[544px] max-h-[96px] bottom-[150px] left-16">
        {isNftDetail ? (
          <>
            <Header nft={nft} />
          </>
        ) : (
          <>
            <Header title="Your own collection of NFTs for climate change.">
              <div className="mt-4">
                <Link
                  to=""
                  className="mr-3 text-black rounded-3xl border border-white bg-white p-3 hover:font-bold"
                >
                  Create my NFT
                </Link>
                <Link
                  to=""
                  className="rounded-3xl text-white border border-white p-3 hover:font-bold"
                >
                  More info
                </Link>
              </div>
            </Header>
          </>
        )}
      </div>
    </div>
  );
};
