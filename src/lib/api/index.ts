import { Cause, IPFSResponse } from './ipfs';
import { Nft, NFTListed } from './nfts';

export default interface Endpoints
  extends Record<string, Record<string, { response: any; body?: any }>> {
  get: {
    nfts: { response: NFTListed[] };
    healthz: { response: { status: 'ok' } };
    causes: { response: Cause[] };
    '/api/v1/nfts.json': { response: NFTListed[] };
  };
  post: {
    'opt-in/': { response: Record<string, any>; body: '' };
    ipfs: { response: IPFSResponse; body: FormData };
    '/auth/register': { response: unknown; body: any }; // HEADS UP! Where is this being used?
  };
}
