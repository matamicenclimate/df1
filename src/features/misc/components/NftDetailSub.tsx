import { Button } from '@/componentes/Elements/Button/Button';
import { useNFTPurchasingActions } from '../lib/detail';
import { microalgosToAlgos } from '../lib/minting';
import algoLogo from '../../../assets/algoLogo.svg';
import { AssetEntity } from '@common/src/lib/api/entities';
import CurrentNFTInfo from '../state/CurrentNFTInfo';

const NoNftApp = () => (
  <div>
    <h4>The asset is being processed</h4>
    <p>Wait some time before it gets ready.</p>
  </div>
);

export function ButtonsDiscriminator({
  state,
  nft,
  actions: { doBuyNFT, doPlaceABid },
}: {
  nft: AssetEntity;
  actions: ReturnType<typeof useNFTPurchasingActions>;
  state: CurrentNFTInfo;
}) {
  if (state.nft.type === 'direct-listing') {
    return (
      <Button onClick={doBuyNFT} className="w-full">
        Buy
      </Button>
    );
  } else if (state.nft.type === 'auction') {
    return (
      <>
        <div className="offerBid flex justify-between py-7">
          <div className="flex flex-col">
            <label className="font-sanspro text-climate-gray-artist text-sm pb-4" htmlFor="title">
              Offer Bid
            </label>
          </div>
          <div className="flex self-end">
            <p className="text-xl text-climate-blue self-center">
              {state.state.fold(undefined, (s) => microalgosToAlgos(s.bid_amount || 0)) ??
                microalgosToAlgos(nft.arc69.properties.price)}
            </p>
            <img className="w-4 h-4 self-center ml-1" src={algoLogo} alt="algologo" />
          </div>
        </div>
        <Button onClick={doPlaceABid} className="w-full">
          Place a bid
        </Button>
      </>
    );
  }
  return <NoNftApp />;
}

export function BuyAndBidButtons({
  state,
  nft,
  actions,
}: {
  nft: AssetEntity;
  actions: ReturnType<typeof useNFTPurchasingActions>;
  state: CurrentNFTInfo;
}) {
  return <ButtonsDiscriminator state={state} actions={actions} nft={nft} />;
}
