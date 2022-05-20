import { Nft } from '@common/src/lib/api/entities';
import { AuctionAppState } from '@common/src/lib/types';
import NetworkClient from '@common/src/services/NetworkClient';
import { TransactionOperation } from '@common/src/services/TransactionOperation';
import Container from 'typedi';

export async function asAppDataIfPossible(element: Nft) {
  const id = element.arc69.properties.app_id;
  if (id == null) {
    return null;
  }
  if (id != null) {
    try {
      const state = await TransactionOperation.do.getApplicationState<AuctionAppState>(id);
      if (state.bid_amount != null) {
        element.arc69.properties.price = state.bid_amount;
      }
    } catch (err) {
      console.warn('Warning! No app id was valid, ', id, err);
      return null;
    }
  }
  return element;
}

const client = Container.get(NetworkClient);

/**
 * Attempts to fetch all NFTs from remote.
 * Also tries to populate state metadata, based on the application
 * that was associated to it on-chain.
 */
export async function fetchNfts() {
  const list: Nft[] = [];
  const ofList = await client.core.get('nfts').then((_) => _.data);
  for (const data of ofList) {
    const out = await asAppDataIfPossible(data);
    if (out == null) continue;
    list.push(out);
  }
  return list;
}
