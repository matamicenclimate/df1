import { NFTListed } from '@/lib/api/nfts';
import algoLogo from '../../../assets/algoLogo.svg';

const defaultImage = 'https://www.newsbtc.com/wp-content/uploads/2021/10/nft.jpg';

type CardProps = {
  nft: NFTListed;
};

export const Card = ({ nft }: CardProps) => {
  return (
    <div className="wrapper antialiased text-gray-900 max-w-[325px]">
      <div>
        <img
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = defaultImage;
          }}
          src={nft.image_url}
          alt={nft.image_url}
          className="w-full object-cover rounded-lg shadow-md min-h-[325px] max-h-[325px]"
        />
        <div className="relative px-4 -mt-16">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="font-sanspro font-semibold text-climate-green flex items-baseline">
              <span className="h-2 w-2 bg-climate-green rounded-full inline-block mr-1 self-center"></span>
              <p>{nft?.arc69?.properties?.cause}</p>
            </div>
            <h4 className="mt-1 text-lg font-dinpro font-normal uppercase leading-tight truncate">
              {nft?.title}
            </h4>
            <div className="mt-1 font-sanspro text-climate-gray-artist text-sm">
              {nft?.arc69?.properties?.artist}
            </div>
            <div className="flex">
              <p className="text-xl text-climate-blue ">{nft.arc69?.properties?.price}</p>
              <img className="w-4 h-4 self-center" src={algoLogo} alt="algologo" />
            </div>
            <div className="text-base text-climate-gray">
              {nft?.arc69?.properties?.causePercentage} %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
