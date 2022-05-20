import algosdk from 'algosdk';
import * as DigestProvider from '@common/src/services/DigestProvider';
import { metadataNFTType } from './type';
import { Wallet } from 'algorand-session-wallet';
import Container from 'typedi';
import ProcessDialog from '@/service/ProcessDialog';
import { Failure, Result, Success } from '@/features/misc/lib/MintingState';

const mdhash = DigestProvider.get();
const dialog = Container.get(ProcessDialog);

export interface AssetInfo {
  transactionId: number;
  assetID: number;
}

async function createAsset<A extends Record<string, any> = any>(
  algodClient: algosdk.Algodv2,
  account: string,
  meta: A,
  wallet: Wallet
) {
  dialog.message = 'Checking blockchain connection...';
  //Check algorand node status
  const status = await algodClient.status().do();
  //Check account balance
  dialog.message = 'Retrieving account information...';
  const accountInfo = await algodClient.accountInformation(account).do();
  const startingAmount = accountInfo.amount;
  console.log('User account balance: microAlgos', startingAmount);
  // Construct the transaction
  const params = await algodClient.getTransactionParams().do();
  const defaultFrozen = false;
  // Friendly name of the asset
  const assetName = meta.title;
  // Optional string pointing to a URL relating to the asset
  const url = meta.url;
  const managerAddr = account;
  const reserveAddr = account;
  const freezeAddr = account;
  const clawbackAddr = account;
  // integer number of decimals for asset unit calculation
  const decimals = 0;
  const total = 1; // how many of this asset there will be
  const metadataHash = mdhash.digest(meta);
  dialog.message = 'Sending NFT data...';
  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: account,
    total: total,
    decimals: decimals,
    assetName: assetName,
    assetURL: url,
    assetMetadataHash: metadataHash,
    note: algosdk.encodeObj(meta),
    defaultFrozen,
    freeze: freezeAddr,
    manager: managerAddr,
    clawback: clawbackAddr,
    reserve: reserveAddr,
    suggestedParams: params,
  });
  const [s_create_txn] = await wallet.signTxn([txn]);
  dialog.message = 'Sending NFT data...';
  const { txId } = await algodClient
    .sendRawTransaction(
      [s_create_txn].map((t) => {
        return t.blob;
      })
    )
    .do();
  dialog.message = 'Waiting for confirmation...';
  const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 10);
  console.log('Transaction ' + txId + ' confirmed in round ' + confirmedTxn['confirmed-round']);
  const assetID = confirmedTxn['asset-index'];
  console.log('AssetID = ' + assetID);
  await printCreatedAsset(algodClient, account, assetID);
  await printAssetHolding(algodClient, account, assetID);
  const assetInfo: AssetInfo = {
    transactionId: txId,
    assetID: assetID,
  };
  return assetInfo;
}

export async function destroyAsset(
  algodClient: algosdk.Algodv2,
  account: string,
  assetId: number,
  wallet: Wallet
) {
  const assetNumber = Number(assetId);
  // All of the created assets should now be back in the creators
  // Account so we can delete the asset.
  // If this is not the case the asset deletion will fail
  const params = await algodClient.getTransactionParams().do();
  const addr = account;
  const txn = algosdk.makeAssetDestroyTxnWithSuggestedParamsFromObject({
    from: addr,
    note: undefined,
    assetIndex: assetNumber,
    suggestedParams: params,
  });
  console.log('txn', txn);

  dialog.subtitle = 'Waiting for user confirmation';
  dialog.highlight = true;
  const [s_create_txn] = await wallet.signTxn([txn]);
  console.log('[s_create_txn]', [s_create_txn]);

  dialog.subtitle = '';
  dialog.highlight = false;
  const { txId } = await algodClient
    .sendRawTransaction(
      [s_create_txn].map((t) => {
        return t.blob;
      })
    )
    .do();
  const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 10);
  console.log('Transaction ' + txId + ' confirmed in round ' + confirmedTxn['confirmed-round']);
  // The account3 and account1 should no longer contain the asset as it has been destroyed
  console.log('Asset ID: ' + assetId);
  console.log('AccountAddr = ' + account);
  await printCreatedAsset(algodClient, account, assetId);
  await printAssetHolding(algodClient, account, assetId);

  // return;
}

// Function used to print created asset for account and assetid
const printCreatedAsset = async function (algodClient: any, account: any, assetid: any) {
  // note: if you have an indexer instance available it is easier to just use this
  //     const accountInfo = await indexerClient.searchAccounts()
  //    .assetID(assetIndex).do();
  // and in the loop below use this to extract the asset for a particular account
  // accountInfo['accounts'][idx][account]);
  const accountInfo = await algodClient.accountInformation(account).do();
  for (let idx = 0; idx < accountInfo['created-assets'].length; idx++) {
    const scrutinizedAsset = accountInfo['created-assets'][idx];
    if (scrutinizedAsset['index'] == assetid) {
      console.log('AssetID = ' + scrutinizedAsset['index']);
      const myparms = JSON.stringify(scrutinizedAsset['params'], undefined, 2);
      console.log('parms = ' + myparms);
      break;
    }
  }
};
// Function used to print asset holding for account and assetid
const printAssetHolding = async function (algodClient: any, account: any, assetid: any) {
  // note: if you have an indexer instance available it is easier to just use this
  //     const accountInfo = await indexerClient.searchAccounts()
  //    .assetID(assetIndex).do();
  // and in the loop below use this to extract the asset for a particular account
  // accountInfo['accounts'][idx][account]);
  const accountInfo = await algodClient.accountInformation(account).do();
  for (let idx = 0; idx < accountInfo['assets'].length; idx++) {
    const scrutinizedAsset = accountInfo['assets'][idx];
    if (scrutinizedAsset['asset-id'] == assetid) {
      const myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
      console.log('assetholdinginfo = ' + myassetholding);
      break;
    }
  }
};

/**
 * Starts the creation of an asset.
 */
export async function createNFT(
  algodClient: algosdk.Algodv2,
  account: string,
  metadat: metadataNFTType,
  wallet: Wallet
): Promise<Result<AssetInfo>> {
  try {
    const info = await createAsset(algodClient, account, metadat, wallet);
    return new Success(info);
  } catch (err: any) {
    console.log('Failed to process NFT creation!', err);

    if (err) {
      dialog.start();
      dialog.title = 'An error occured, please restart the minting process.';
      dialog.message = '';
      await dialog.interaction();
    }

    return new Failure(err);
  }
}
