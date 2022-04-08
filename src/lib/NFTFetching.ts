import { TransactionOperation } from '@common/src/services/TransactionOperation';
import { NFTListed } from './api/nfts';
import { httpClient } from './httpClient';

export async function asAppDataIfPossible(element: NFTListed) {
  const id = element.arc69.properties.app_id;
  if (id == null) {
    return null;
  }
  if (id != null) {
    try {
      const state = await TransactionOperation.do.getApplicationState(id);
      if (state.bid_amount != null) {
        element.arc69.properties.price = state.bid_amount as number;
      }
    } catch (err) {
      console.warn('Warning! No app id was valid, ', id, err);
      return null;
    }
  }
  return element;
}

/**
 * Attempts to fetch all NFTs from remote.
 * Also tries to populate state metadata, based on the application
 * that was associated to it on-chain.
 */
export async function fetchNfts() {
  const list: NFTListed[] = [];
  const ofList = await httpClient.get('nfts').then(({ data }) => data);
  for (const data of ofList) {
    const out = await asAppDataIfPossible(data);
    if (out == null) continue;
    list.push(out);
  }
  return list;
}
