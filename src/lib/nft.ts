import * as DigestProvider from '@common/src/services/DigestProvider';
import { metadataNFTType } from './type';
import { None, Option, Some } from '@octantis/option';
import Container from 'typedi';
import ProcessDialog from '@/service/ProcessDialog';
import { BlockchainGatewayProvider } from '@common/src/blockchain';
import { Data } from '@common/src/blockchain/Operation';

const mdhash = DigestProvider.get();
const dialog = Container.get(ProcessDialog);
const chain = Container.get(BlockchainGatewayProvider).require();

export interface AssetInfo {
  transactionId: number;
  assetID: number;
}

async function createAsset<A extends Record<string, any> = any>(account: string, meta: A) {
  dialog.message = 'Checking blockchain connection...';
  //Check algorand node status
  const { available } = await chain.nodeIsAvailable({});
  if (!available) {
    throw new Error(`Can't connect to the blockchain node.`);
  }
  //Check account balance
  dialog.message = 'Retrieving account information...';
  const accountInfo = await chain.getAccountInformation({ address: account });
  const startingAmount = accountInfo.balance ?? -1;
  console.log('User account balance: microAlgos', startingAmount);
  // Construct the transaction
  // Friendly name of the asset
  const assetName = meta.title;
  // Optional string pointing to a URL relating to the asset
  const url = meta.url;
  const metadataHash = mdhash.digest(meta);
  dialog.message = 'Sending NFT data...';
  const {
    operations: [result],
  } = await chain
    .createAsset({
      owner: account,
      amount: 1,
      name: assetName,
      url,
      metadata: {
        payload: meta,
        checksum: metadataHash,
      },
    })
    .then((ops) => ops.sign())
    .then((ops) => ops.commit())
    .then((ops) => ops.confirm());
  console.log('Operation confirmed:', result);
  // console.log('Transaction ' + opConfirmed.operation.id + ' confirmed in round ' + confirmedTxn['confirmed-round']);
  const assetID = Number(result.data?.['asset-index'] ?? -1);
  console.log('AssetID = ' + assetID);
  await printCreatedAsset(account, assetID);
  await printAssetHolding(account, assetID);
  const assetInfo: AssetInfo = {
    transactionId: Number(result.id),
    assetID: assetID,
  };
  return assetInfo;
}

export async function destroyAsset(account: string, assetId: number) {
  // All of the created assets should now be back in the creators
  // Account so we can delete the asset.
  // If this is not the case the asset deletion will fail
  dialog.subtitle = 'Waiting for user confirmation';
  dialog.highlight = true;
  const {
    operations: [op],
  } = await chain
    .destroyAsset({ asset: assetId, owner: account })
    .then((ops) => ops.sign())
    .then((ops) => ops.commit())
    .then((ops) => ops.confirm());
  console.log('txn', op);
  dialog.subtitle = '';
  dialog.highlight = false;
  // The account3 and account1 should no longer contain the asset as it has been destroyed
  console.log('Asset ID: ' + assetId);
  console.log('AccountAddr = ' + account);
  await printCreatedAsset(account, assetId);
  await printAssetHolding(account, assetId);

  // return;
}

// Function used to print created asset for account and assetid
const printCreatedAsset = async function (account: any, assetid: any) {
  // note: if you have an indexer instance available it is easier to just use this
  //     const accountInfo = await indexerClient.searchAccounts()
  //    .assetID(assetIndex).do();
  // and in the loop below use this to extract the asset for a particular account
  // accountInfo['accounts'][idx][account]);
  const accountInfo = await chain.getAccountInformation({ address: account });
  const assets = (accountInfo.data?.['created-assets'] as { index: number; params: Data }[]) ?? [];
  for (const asset of assets) {
    if (asset.index == assetid) {
      console.log('AssetID = ' + asset.index);
      const myparms = JSON.stringify(asset.params, undefined, 2);
      console.log('parms = ' + myparms);
      break;
    }
  }
};
// Function used to print asset holding for account and assetid
const printAssetHolding = async function (account: any, assetid: any) {
  // note: if you have an indexer instance available it is easier to just use this
  //     const accountInfo = await indexerClient.searchAccounts()
  //    .assetID(assetIndex).do();
  // and in the loop below use this to extract the asset for a particular account
  // accountInfo['accounts'][idx][account]);
  const accountInfo = await chain.getAccountInformation({ address: account });
  const assets = (accountInfo.data?.['created-assets'] as { index: number; params: Data }[]) ?? [];
  for (const asset of assets) {
    if (asset.index == assetid) {
      console.log('AssetID = ' + asset.index);
      const myparms = JSON.stringify(asset.params, undefined, 2);
      console.log('parms = ' + myparms);
      break;
    }
  }
};

/**
 * Starts the creation of an asset.
 */
export async function createNFT(
  account: string,
  metadata: metadataNFTType
): Promise<Option<AssetInfo>> {
  try {
    const info = await createAsset(account, metadata);
    return Some(info);
  } catch (err: any) {
    console.log('Failed to process NFT creation!', err);

    if (err) {
      dialog.start();
      dialog.title = 'An error occured, please restart the minting process.';
      dialog.message = '';
      await dialog.interaction();
    }

    return None();
  }
}
