import { IPFSResponse } from './ipfs';
import { Cause, CausePostBody } from './causes';

export type Endpoints = Record<
  string,
  Record<
    string,
    {
      response: Record<string, unknown> | unknown | string | number;
      body?: Record<string, unknown | string | number> | string | unknown;
      headers?: Record<string, Record<string, unknown> | string | number>;
    }
  >
>;

export interface CoreAPI extends Endpoints {
  get: {
    nfts: { response: unknown[] };
    healthz: { response: { status: 'ok' } };
  };
  post: {
    'opt-in': { response: { targetAccount: string }; body: { assetId: number } };
    'create-auction': {
      response: { appIndex: number };
      body: {
        assetId: number;
        creatorWallet: string;
        causePercentaje: number;
      };
    };
    'activate-auction': { body: { appId: number; assetId: number }; response: unknown };
    ipfs: { response: IPFSResponse; body: FormData };
    'direct-listing': { response: Record<string, unknown>; body: Record<string, unknown> };
    '/auth/register': { response: unknown; body: Record<string, unknown> }; // HEADS UP! Where is this being used?
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
