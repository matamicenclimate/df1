import { NFTListed } from '@/lib/api/nfts';
import { AuctionAppState } from '@common/src/lib/types';

export default interface CurrentNFTInfo {
  nft: NFTListed;
  state: AuctionAppState;
}
