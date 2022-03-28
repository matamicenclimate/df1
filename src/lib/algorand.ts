import AlgodClientProvider from '@common/src/services/AlgodClientProvider';
import algosdk from 'algosdk';
import Container from 'typedi';

let client: null | algosdk.Algodv2 = null;

const service = Container.get(AlgodClientProvider);

export function setupClient() {
  if (client == null) {
    client = service.client;
  }
  return client;
}
