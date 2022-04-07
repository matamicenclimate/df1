import { Wallet } from 'algorand-session-wallet';

export type assetInfoType = {
  transactionId: string | undefined;
  assetID: number | undefined;
};

export type metadataNFTType = {
  arc69: {
    description: string;
    external_url: string;
    mime_type: string;
    properties: Record<string, unknown> & {
      cause: string;
      causePercentage: number;
      date: Date;
      price: number;
      artist: string;
      file: {
        name: string;
        type: string;
        size: number;
      };
    };
  };
  image_url: string;
  ipnft: string;
  url: string;
};

export type CauseInfo = {
  cause: string;
  causePercentage: number;
  price: number;
};

type Properties = Record<string, any> & CauseInfo;

export type NFTMetadataBackend = {
  title: string;
  description: string;
  author: string;
  file: FileList;
  properties: Properties;
  image_url: string;
  ipnft: string;
  url: string;
};

export type MinterProps = {
  wallet: Wallet | undefined;
  account: string | undefined | null;
};

/**
 * Type guard for inferred arrays.
 */
export function isArray<U>(value: unknown): value is U[] {
  return value instanceof Array;
}

/**
 * Utility function that throws if the provided type is not an array type.
 */
export function assertArray<T>(value: T): T extends unknown[] ? T : never {
  if (isArray(value)) return value as T extends unknown[] ? T : never;
  throw new Error('Not an array!');
}
