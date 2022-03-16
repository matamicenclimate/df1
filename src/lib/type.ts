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
    properties: {
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

export type NFTMetadataBackend = {
  title: string;
  description: string;
  author: string;
  file: string | File;
  price: number;
  properties: Record<string, any>;
};

export type MinterProps = {
  wallet: Wallet | undefined;
  account: string | undefined | null;
};
