import { NFTListed } from '@/lib/api/nfts';
import algoLogo from '../../../assets/algoLogo.svg';

const defaultImage = 'https://www.newsbtc.com/wp-content/uploads/2021/10/nft.jpg';

type CardProps = {
  nft: NFTListed;
};

export const Card = ({ nft }: CardProps) => {
  return (
    <div className="border shadow-md rounded-xl overflow-hidden relative">
      <div>
        <img
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = defaultImage;
          }}
          src={nft.image_url}
          className="w-80 rounded hover:scale-125 hover:transition hover:ease-out"
        />
      </div>
      <div className="p-4 bg-black">
        <p className="text-xl font-bold text-white">{nft?.title}</p>
        <p className="text-sm font-bold text-white">{nft?.arc69?.properties?.artist}</p>
      </div>
      <div className="absolute bottom-4 right-3 bg-white flex rounded-md p-2">
        <p className="text-lg font-bold mr-1">{nft.arc69?.properties?.price}</p>
        <img className="w-4 h-4 self-center" src={algoLogo} alt="algologo" />
      </div>
    </div>
  );
};
