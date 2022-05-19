import { Nft } from '@/lib/api/nfts';
import { AuctionAppState } from '@common/src/lib/types';
import { option } from '@octantis/option';

export default interface CurrentNFTInfo {
  nft: Nft;
  state: option<AuctionAppState>;
}
