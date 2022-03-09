import algosdk, { Transaction } from 'algosdk';
import { sha256 } from 'js-sha256';

export function mdhash(md) {
  const hash = sha256.create();
  hash.update(JSON.stringify(md));
  console.log('md', md);
  console.log('	hash.update(JSON.stringify(md));', hash.update(JSON.stringify(md)));

  return new Uint8Array(hash.digest());
}

async function createAsset(algodClient, account, metadat, wallet) {
  console.log('algodClient', algodClient);
  console.log('metadatFromMinter', metadat);
  console.log('walletwalletwalletwalletwalletwalletwalletwalletv', wallet);
  console.log('==> CREATE ASSET');
  //Check account balance
  const accountInfo = await algodClient.accountInformation(account).do();
  console.log('accountInfo', accountInfo);

  const startingAmount = accountInfo.amount;
  console.log('User account balance: %d microAlgos', startingAmount);

  // Construct the transaction
  const params = await algodClient.getTransactionParams().do();
  console.log('params', params);
  // comment out the next two lines to use suggested fee
  // params.fee = 1000;
  // params.flatFee = false;
  // const closeout = receiver; //closeRemainderTo
  // WARNING! all remaining funds in the sender account above will be sent to the closeRemainderTo Account
  // In order to keep all remaining funds in the sender account after tx, set closeout parameter to undefined.
  // For more info see:
  // https://developer.algorand.org/docs/reference/transactions/#payment-transaction
  // Asset creation specific parameters
  // The following parameters are asset specific
  // Throughout the example these will be re-used.

  const defaultFrozen = false;
  // Used to display asset units to user
  const unitName = metadat.title;
  // Friendly name of the asset
  const assetName = metadat.title;
  // Optional string pointing to a URL relating to the asset
  const url = metadat.url;
  const managerAddr = account; // OPTIONAL: FOR DEMO ONLY, USED TO DESTROY ASSET WITHIN
  const reserveAddr = account;
  const freezeAddr = account;
  const clawbackAddr = account;

  // Use actual total  > 1 to create a Fungible Token
  // example 1:(fungible Tokens)
  // totalIssuance = 10, decimals = 0, result is 10 total actual
  // example 2: (fractional NFT, each is 0.1)
  // totalIssuance = 10, decimals = 1, result is 1.0 total actual
  // example 3: (NFT)
  // totalIssuance = 1, decimals = 0, result is 1 total actual
  // integer number of decimals for asset unit calculation
  const decimals = 0;
  const total = 1; // how many of this asset there will be

  const metadataHash = mdhash(metadat);
  console.log('metadataHash', metadataHash);

  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: account,
    total: total,
    decimals: decimals,
    assetName: assetName,
    unitName: unitName,
    assetURL: url,
    assetMetadataHash: metadataHash,
    defaultFrozen,
    freeze: freezeAddr,
    manager: managerAddr,
    clawback: clawbackAddr,
    reserve: reserveAddr,
    suggestedParams: params,
  });
  console.log('txn', txn);

  const [s_create_txn] = await wallet.signTxn([txn]);
  console.log('[s_create_txn]', [s_create_txn]);

  const { txId } = await algodClient
    .sendRawTransaction(
      [s_create_txn].map((t) => {
        return t.blob;
      })
    )
    .do();
  let assetID = null;
  const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 10);
  console.log('Transaction ' + txId + ' confirmed in round ' + confirmedTxn['confirmed-round']);
  assetID = confirmedTxn['asset-index'];
  console.log('AssetID = ' + assetID);

  await printCreatedAsset(algodClient, account, assetID);
  await printAssetHolding(algodClient, account, assetID);

  const assetInfo = {
    transactionId: txId,
    assetID: assetID,
  };

  return assetInfo;
}

async function destroyAsset(algodClient, account, assetID) {
  console.log('');
  console.log('==> DESTROY ASSET');
  // All of the created assets should now be back in the creators
  // Account so we can delete the asset.
  // If this is not the case the asset deletion will fail
  const params = await algodClient.getTransactionParams().do();
  // Comment out the next two lines to use suggested fee
  // params.fee = 1000;
  // params.flatFee = true;
  // The address for the from field must be the manager account
  const addr = account;
  // if all assets are held by the asset creator,
  // the asset creator can sign and issue "txn" to remove the asset from the ledger.
  const txn = algosdk.makeAssetDestroyTxnWithSuggestedParamsFromObject({
    from: addr,
    note: undefined,
    assetIndex: assetID,
    suggestedParams: params,
  });
  // The transaction must be signed by the manager which
  // is currently set to account
  // const rawSignedTxn = txn.signTxn(alice.sk);
  const rawSignedTxn = txn.signTxn(account.sk);
  const tx = await algodClient.sendRawTransaction(rawSignedTxn).do();
  // Wait for confirmation
  const confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);
  //Get the completed Transaction
  console.log('Transaction ' + tx.txId + ' confirmed in round ' + confirmedTxn['confirmed-round']);
  // The account3 and account1 should no longer contain the asset as it has been destroyed
  console.log('Asset ID: ' + assetID);
  console.log('AccountAddr = ' + account);
  await printCreatedAsset(algodClient, account, assetID);
  await printAssetHolding(algodClient, account, assetID);

  return;
}

// Function used to print created asset for account and assetid
const printCreatedAsset = async function (algodClient, account, assetid) {
  // note: if you have an indexer instance available it is easier to just use this
  //     let accountInfo = await indexerClient.searchAccounts()
  //    .assetID(assetIndex).do();
  // and in the loop below use this to extract the asset for a particular account
  // accountInfo['accounts'][idx][account]);
  let accountInfo = await algodClient.accountInformation(account).do();
  for (let idx = 0; idx < accountInfo['created-assets'].length; idx++) {
    let scrutinizedAsset = accountInfo['created-assets'][idx];
    if (scrutinizedAsset['index'] == assetid) {
      console.log('AssetID = ' + scrutinizedAsset['index']);
      let myparms = JSON.stringify(scrutinizedAsset['params'], undefined, 2);
      console.log('parms = ' + myparms);
      break;
    }
  }
};
// Function used to print asset holding for account and assetid
const printAssetHolding = async function (algodClient, account, assetid) {
  // note: if you have an indexer instance available it is easier to just use this
  //     let accountInfo = await indexerClient.searchAccounts()
  //    .assetID(assetIndex).do();
  // and in the loop below use this to extract the asset for a particular account
  // accountInfo['accounts'][idx][account]);
  let accountInfo = await algodClient.accountInformation(account).do();
  for (let idx = 0; idx < accountInfo['assets'].length; idx++) {
    let scrutinizedAsset = accountInfo['assets'][idx];
    if (scrutinizedAsset['asset-id'] == assetid) {
      let myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
      console.log('assetholdinginfo = ' + myassetholding);
      break;
    }
  }
};

export async function createNFT(algodClient, account, metadat, wallet) {
  try {
    // Connect your client
    // const algodClient = new algosdk.Algodv2(token, server, port);
    // CREATE ASSET
    const assetID = await createAsset(algodClient, account, metadat, wallet);
    console.log('assetId line 220', assetID);
    // DESTROY ASSET
    // await destroyAsset(algodClient, account, assetID);
    return assetID;
  } catch (err) {
    console.log('err', err);
  }
  // process.exit();
}
