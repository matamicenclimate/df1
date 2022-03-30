import { IPFSResponse } from './ipfs';
import { NFTListed } from './nfts';
import { Cause, CausePostBody } from './causes';

export type Endpoints = Record<
  string,
  Record<string, { response: any; body?: any; headers?: Record<string, any> }>
>;

export interface CoreAPI extends Endpoints {
  get: {
    nfts: { response: NFTListed[] };
    healthz: { response: { status: 'ok' } };
  };
  post: {
    'opt-in': { response: { appIndex: number }; body: { assetId: number } };
    ipfs: { response: IPFSResponse; body: FormData };
    '/auth/register': { response: unknown; body: any }; // HEADS UP! Where is this being used?
  };
}

export interface CausesAPI extends Endpoints {
  get: {
    causes: { response: Cause[] };
  };
  post: {
    causes: {
      body: CausePostBody;
      response: Cause;
      headers: {
        authorization: string;
      };
    };
  };
}
