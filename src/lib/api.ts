export interface Nft {
  title?: string;
  description?: string;
  image?: string;
  artist?: string;
}

export default interface Endpoints {
  nfts: Nft[];
  healthz: { status: 'ok' };
}
