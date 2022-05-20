import { Nft } from '@common/src/lib/api/entities';
import { AuctionAppState } from '@common/src/lib/types';
import { option } from '@octantis/option';

export default interface CurrentNFTInfo {
  nft: Nft;
  state: option<AuctionAppState>;
}
