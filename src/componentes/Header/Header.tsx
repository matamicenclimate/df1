import { useCauseContext } from '@/context/CauseContext';
import { getCause } from '@/features/misc/routes/NftDetail';
import CurrentNFTInfo from '@/features/misc/state/CurrentNFTInfo';
import { option } from '@octantis/option';
import { useLocation } from 'react-router-dom';

export type HeaderProps = {
  children?: JSX.Element | JSX.Element[];
  title?: string;
  cause?: string;
  nft?: option<CurrentNFTInfo>;
};

const Header = ({ children, title, nft }: HeaderProps) => {
  const { causes } = useCauseContext();
  const location = useLocation();

  const isNftDetail = location.pathname.includes('/nft/');

  const getNftAssetEntity = (nft: CurrentNFTInfo) => {
    return nft.nft.asset;
  };

  const getCauseTitle = () => {
    if (nft?.isDefined()) {
      return getCause(causes, getNftAssetEntity(nft.value));
    }
  };

  return (
    <div>
      {isNftDetail ? (
        <>
          <div className="text-white">
            <div className="flex">
              <span className="w-4 h-4 bg-climate-light-green rounded-full inline-block mr-1 border border-[rgba(255, 255, 255, 0.5)]"></span>
              <h1 className="font-medium text-[13px]">{getCauseTitle()?.title?.toUpperCase()}</h1>
            </div>
            <h1 className="font-black text-[40px]">
              {nft?.fold('', (value) => value.nft.asset.title)}
            </h1>
          </div>
        </>
      ) : (
        <>
          <h1 className="font-black text-white text-[40px]">{title}</h1>
          {children}
        </>
      )}
    </div>
  );
};

export default Header;
