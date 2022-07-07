import { useCauseContext } from '@/context/CauseContext';
import algoLogo from '../../../assets/algoLogo.svg';
import { Cause } from '@/lib/api/causes';
import { Nft, AssetEntity } from '@common/src/lib/api/entities';
import useOptionalState from '@/hooks/useOptionalState';
import { useEffect } from 'react';
import Container from 'typedi';
import NetworkClient from '@common/src/services/NetworkClient';
import { microalgosToAlgos } from '@/features/misc/lib/minting';

const defaultImage = 'https://www.newsbtc.com/wp-content/uploads/2021/10/nft.jpg';

type CardProps = {
  nft: AssetEntity;
};

export const Card = (props: CardProps) => {
  const { causes } = useCauseContext();
  const [state, setState] = useOptionalState<Nft>();

  useEffect(() => {
    Container.get(NetworkClient)
      .core.get('asset/:id', {
        params: {
          id: props.nft.assetIdBlockchain.toString(),
        },
      })
      .then(({ data }) => {
        setState(data.value);
      });
  }, []);

  return state.fold(
    <div className="relative wrapper antialiased text-gray-900 max-w-[325px] animate-pulse">
      <div>
        <div className="w-full rounded-lg shadow-md min-w-[325px] max-w-[325px] min-h-[325px] max-h-[325px] bg-climate-border">
          &nbsp;
        </div>
        <div className="absolute text-white font-inter bottom-[100px] left-8">
          <div className="rounded-lg shadow-lg">
            <div className=" flex items-baseline">
              <span className="w-4 h-4 bg-climate-light-green rounded-full inline-block mr-1 border border-[rgba(255, 255, 255, 0.5)]"></span>
              <p className="text-[13px] whitespace-nowrap overflow-hidden text-ellipsis self-center">
                &nbsp;
              </p>
            </div>
            <h4 className="mt-1 text-lg font-semibold leading-tight truncate">&nbsp;</h4>
            <div className="text-[13px] uppercase font-semibold">@ &nbsp;</div>
            <div className="flex">
              <p className="text-xl">&nbsp;</p>
              <img className="w-4 h-4 self-center ml-1" src={algoLogo} alt="algologo" />
            </div>
          </div>
        </div>
      </div>
    </div>,
    (info) => {
      const { nft } = props;
      const getCauseTitle = (causes: Cause[] | undefined, nft: AssetEntity) => {
        const cause: Cause | undefined = causes?.find(
          (cause: Cause) => cause.id === nft.arc69.properties.cause
        );
        return cause?.title;
      };
      return (
        <div className="relative wrapper antialiased text-gray-900 max-w-[325px]">
          <div>
            {nft?.imageUrl?.endsWith('.mp4') ? (
              <div className="w-full object-cover rounded-lg shadow-md min-h-[325px] max-h-[325px]">
                <video className=" min-h-[325px] max-h-[325px]" autoPlay loop muted>
                  <source src={nft.imageUrl} type="video/mp4" />
                </video>
              </div>
            ) : (
              <div
                className="object-cover rounded-lg shadow-md min-h-[320px] max-h-[320px] w-[320px]"
                style={{
                  backgroundImage: `linear-gradient(to bottom, transparent 0%, black 100%), url(${nft.imageUrl})`,
                  backgroundPosition: 'center center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            )}
            <div className="absolute text-white font-inter bottom-4 left-8">
              <div className="rounded-lg shadow-lg">
                <div className=" flex items-baseline">
                  <span className="w-4 h-4 bg-climate-light-green rounded-full inline-block mr-1 border border-[rgba(255, 255, 255, 0.5)]"></span>
                  <p className="text-[13px] whitespace-nowrap overflow-hidden text-ellipsis self-center">
                    {getCauseTitle(causes, nft)?.toUpperCase()}
                  </p>
                </div>
                <h4 className="my-4 text-lg font-semibold leading-tight truncate">{info?.title}</h4>
                <div className="text-[13px] uppercase font-semibold">
                  @ {info?.arc69?.properties?.artist}
                </div>
                <div className="mt-10 flex">
                  <p className="text-xl">{microalgosToAlgos(info?.arc69?.properties?.price)}</p>
                  <img className="w-4 h-4 self-center ml-1" src={algoLogo} alt="algologo" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  );
};
