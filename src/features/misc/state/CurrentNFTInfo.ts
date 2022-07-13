import { Listing } from '@common/src/lib/api/entities';
import { AuctionAppState } from '@common/src/lib/types';
import { Option } from '@octantis/option';

export default interface CurrentNFTInfo {
  nft: Listing;
  state: Option<AuctionAppState>;
  info: Option<Listing>;
}
