import { useContext } from 'react';
import { CauseContext, CauseContextType } from '@/context/CauseContext';
import { NFTListed } from '@/lib/api/nfts';
import algoLogo from '../../../assets/algoLogo.svg';
import { Cause } from '@/lib/api/causes';

const defaultImage = 'https://www.newsbtc.com/wp-content/uploads/2021/10/nft.jpg';

type CardProps =
  | {
      nft: NFTListed;
    }
  | {
      loading: true;
    };

function isLoading(props: CardProps): props is { loading: true } {
  return (props as { loading: true }).loading;
}

export const Card = (props: CardProps) => {
  const causeContext = useContext(CauseContext);
  const causes = causeContext?.data?.map((cause) => cause);

  if (isLoading(props)) {
    return (
      <div className="wrapper antialiased text-gray-900 max-w-[325px] animate-pulse">
        <div>
          <div className="w-full rounded-lg shadow-md min-w-[325px] max-w-[325px] min-h-[325px] max-h-[325px] bg-climate-border">
            &nbsp;
          </div>
          <div className="relative px-4 -mt-16">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="font-sanspro font-semibold text-climate-green flex items-baseline">
                <span className="h-2 w-2 bg-climate-green rounded-full inline-block mr-1 self-center"></span>
                <p className="whitespace-nowrap overflow-hidden text-ellipsis w-full bg-climate-border">
                  &nbsp;
                </p>
              </div>
              <h4 className="mt-1 bg-climate-border rounded w-full">&nbsp;</h4>
              <div className="mt-1 bg-climate-border rounded w-full">&nbsp;</div>
              <div className="flex">
                <p className="text-xl text-climate-blue bg-climate-border rounded w-full m-1">
                  &nbsp;
                </p>
                <img className="w-4 h-4 self-center ml-1" src={algoLogo} alt="algologo" />
              </div>
              <div className="text-base text-climate-gray bg-climate-border rounded w-full m-1">
                &nbsp;
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const { nft } = props;

  const getCauseTitle = (causes: Cause[] | undefined, nft: NFTListed) => {
    const cause: Cause | undefined = causes?.find(
      (cause: Cause) => cause.id === nft?.arc69?.properties?.cause
    );
    return cause?.title;
  };

  return (
    <div className="wrapper antialiased text-gray-900 max-w-[325px]">
      <div>
        {nft.image_url.endsWith('.mp4') ? (
          <div className="w-full object-cover rounded-lg shadow-md min-h-[325px] max-h-[325px]">
            <video className=" min-h-[325px] max-h-[325px]" autoPlay loop muted>
              <source src={nft.image_url} type="video/mp4" />
            </video>
          </div>
        ) : (
          <img
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = defaultImage;
            }}
            src={nft.image_url}
            alt={nft.image_url}
            className="w-full object-cover rounded-lg shadow-md min-h-[325px] max-h-[325px]"
          />
        )}
        <div className="relative px-4 -mt-16">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="font-sanspro font-semibold text-climate-green flex items-baseline">
              <span className="h-2 w-2 bg-climate-green rounded-full inline-block mr-1 self-center"></span>
              <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                {/* {nft?.arc69?.properties?.cause} */}
                {getCauseTitle(causes, nft)}
              </p>
            </div>
            <h4 className="mt-1 text-lg font-dinpro font-normal uppercase leading-tight truncate">
              {nft?.title}
            </h4>
            <div className="mt-1 font-sanspro text-climate-gray-artist text-sm">
              {nft?.arc69?.properties?.artist}
            </div>
            <div className="flex">
              <p className="text-xl text-climate-blue ">{nft.arc69?.properties?.price}</p>
              <img className="w-4 h-4 self-center ml-1" src={algoLogo} alt="algologo" />
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
