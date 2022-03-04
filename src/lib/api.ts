export interface Nft {
  title?: string;
  description?: string;
  image?: string;
  artist?: string;
}

export default interface Endpoints
  extends Record<string, Record<string, { response: any; body?: any }>> {
  get: {
    nfts: { response: Nft[] };
    healthz: { response: { status: 'ok' } };
  };
  post: {
    ipfs: { response: unknown; body: null };
    '/auth/register': { response: unknown; body: any }; // HEADS UP! Where is this being used?
  };
}
