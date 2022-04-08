export interface Nft {
  id?: number;
  title?: string;
  description?: string;
  image?: string;
  artist?: string;
  price?: number;
}

export interface NFTListed {
  arc69: {
    description: string;
    external_url: string;
    mime_type: string;
    properties: {
      app_id?: number;
      artist: string;
      cause: string;
      causePercentage: number;
      file: {
        name: string;
        type: string;
        size: number;
      };
      date: Date;
      price: number;
    };
  };
  id: number;
  image_url: string;
  ipnft: string;
  url: string;
  title: string;
  creator: string;
}
