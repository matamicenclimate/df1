import { useCauseContext } from '@/context/CauseContext';
import algoLogo from '../../../assets/algoLogo.svg';
import { Cause } from '@/lib/api/causes';
import { Nft, RekeyAccountRecord } from '@common/src/lib/api/entities';
import useOptionalState from '@/hooks/useOptionalState';
import { useEffect } from 'react';
import Container from 'typedi';
import NetworkClient from '@common/src/services/NetworkClient';
import { microalgosToAlgos } from '@/features/misc/lib/minting';

const defaultImage = 'https://www.newsbtc.com/wp-content/uploads/2021/10/nft.jpg';

type CardProps = {
  nft: RekeyAccountRecord;
};

export const Card = (props: CardProps) => {
  const { causes } = useCauseContext();
  const [state, setState] = useOptionalState<Nft>();
  useEffect(() => {
    Container.get(NetworkClient)
      .core.get('asset/:id', {
        params: {
          id: props.nft.assetId.toString(),
        },
      })
      .then(({ data }) => {
        setState(data.value);
      });
  }, []);
  return state.fold(
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
    </div>,
    (info) => {
      const { nft } = props;
      const getCauseTitle = (causes: Cause[] | undefined, nft: RekeyAccountRecord) => {
        const cause: Cause | undefined = causes?.find((cause: Cause) => cause.id === nft.cause);
        return cause?.title;
      };
      return (
        <div className="wrapper antialiased text-gray-900 max-w-[325px]">
          <div>
            {nft.assetUrl?.endsWith('.mp4') ? (
              <div className="w-full object-cover rounded-lg shadow-md min-h-[325px] max-h-[325px]">
                <video className=" min-h-[325px] max-h-[325px]" autoPlay loop muted>
                  <source src={nft.assetUrl} type="video/mp4" />
                </video>
              </div>
            ) : (
              <img
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = defaultImage;
                }}
                src={nft.assetUrl}
                alt={nft.assetUrl}
                className="w-full object-cover rounded-lg shadow-md min-h-[325px] max-h-[325px]"
              />
            )}
            <div className="relative px-4 -mt-16">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="font-sanspro font-semibold text-climate-green flex items-baseline">
                  <span className="h-2 w-2 bg-climate-green rounded-full inline-block mr-1 self-center"></span>
                  <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {getCauseTitle(causes, nft)}
                  </p>
                </div>
                <h4 className="mt-1 text-lg font-dinpro font-normal uppercase leading-tight truncate">
                  {info.title}
                </h4>
                <div className="mt-1 font-sanspro text-climate-gray-artist text-sm">
                  {info.arc69?.properties?.artist}
                </div>
                <div className="flex">
                  <p className="text-xl text-climate-blue ">
                    {microalgosToAlgos(info.arc69?.properties?.price)}
                  </p>
                  <img className="w-4 h-4 self-center ml-1" src={algoLogo} alt="algologo" />
                </div>
                <div className="text-base text-climate-gray">
                  {info.arc69?.properties?.causePercentage} %
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  );
};
