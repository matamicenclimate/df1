import { Button } from '@/componentes/Elements/Button/Button';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { NFTListed } from '@/lib/api/nfts';
import { httpClient } from '@/lib/httpClient';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import algoLogoWhite from '../../../assets/algorandWhite.svg';
import algosdk from 'algosdk';
import { client } from '@/lib/algorand';
import { none, option, some } from '@octantis/option';
import * as WalletAccountProvider from '@common/src/services/WalletAccountProvider';
import Container from 'typedi';
import ProcessDialog from '@/service/ProcessDialog';
import { TransactionOperation } from '@common/src/services/TransactionOperation';
import '@common/src/lib/binary/extension';
import { WalletContext } from '@/context/WalletContext';

type Entry = {
  key: string;
  value: { bytes: string; type: 1 | 2; uint: number };
};

function assertArray<T>(value: T): unknown[] {
  if (value instanceof Array) return value as unknown as unknown[];
  throw new Error('Not an array!');
}

export async function getGlobalState(appId: number): Promise<SmartContractState> {
  const result = await client().getApplicationByID(appId).do();
  const state = assertArray(result.params['global-state']) as Entry[];
  return state.reduce<Record<string, unknown>>((prev, curr: Entry) => {
    const key = Buffer.from(curr.key, 'base64').toString();
    if (curr.value.type === 1) {
      prev[key] = Buffer.from(curr.value.bytes, 'base64');
    } else if (curr.value.type === 2) {
      prev[key] = curr.value.uint;
    }
    return prev;
  }, {}) as unknown as SmartContractState;
}

interface SmartContractState {
  end: number;
  nft_id: number;
  bid_account: Uint8Array;
  bid_amount: number;
  num_bids: number;
  min_bid_inc: number;
  reserve_amount: number;
  start: number;
  seller: Uint8Array;
}

export const NftDetail = () => {
  const { ipnft } = useParams();
  const [error, setError] = useState<Error>();
  const [data, setData] = useState<NFTListed>();
  const [smartContractState, setSmartContractState] = useState<option<SmartContractState>>(none());
  const [appIndex, setAppIndex] = useState(0);
  const wallet = useContext(WalletContext);

  useEffect(() => {
    fetchNfts();
  }, [ipnft]);

  useEffect(() => {
    updateSmartContractData();
    const interval = setInterval(() => {
      updateSmartContractData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Debugging effect.
  // useEffect(() => {
  //   for (const state of smartContractState) {
  //     console.info('Current smart contract state:', state);
  //   }
  // }, [smartContractState]);

  const fetchNfts = async () => {
    try {
      const res = await httpClient.get('nfts');
      setData(res.data?.find((nft) => nft.ipnft === ipnft));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const checkIfVideo = (imageUrl: string) => {
    if (imageUrl.endsWith('.mp4')) {
      const spitString = imageUrl.split('/');
      spitString[2] = 'ipfs.io';

      return spitString.join('/');
    }
    return imageUrl;
  };

  /**
   * Returns true if the passed array is all-zero.
   */
  function isZeroAccount(account: Uint8Array) {
    return account.reduce((a, b) => a + b, 0) === 0;
  }

  async function updateSmartContractData() {
    const nftSelected = await httpClient.get('nfts').then((s) => s.data[0]);
    setData(nftSelected);
    const appId = nftSelected?.arc69?.properties?.app_id;
    console.log('Selected NFT meta:', nftSelected, '>>Data', data);
    if (appId == null) return null;
    setAppIndex(appId);
    const state = (await getGlobalState(appId)) as unknown as SmartContractState;
    setSmartContractState(some(state));
    return state;
  }

  // Test: Place a bid!
  async function doPlaceABid() {
    const dialog = Container.get(ProcessDialog);
    const op = Container.get(TransactionOperation);
    const appAddr = algosdk.getApplicationAddress(appIndex);
    let previousBid: option<string> = none();
    const state = await updateSmartContractData();
    if (state == null) return;
    if (!isZeroAccount(state.bid_account)) {
      previousBid = some(algosdk.encodeAddress(state.bid_account));
    }
    console.info('Previous bidder:', previousBid.getOrElse('<none>'));
    const minRequired = state.bid_amount + 10;
    let bidAmount = 0;
    while (bidAmount < minRequired || Number.isNaN(bidAmount) || !Number.isFinite(bidAmount)) {
      const result = prompt(
        `Enter a bid amount (At least ${minRequired}!):`,
        minRequired.toString()
      );
      if (result === null) {
        return alert('Aborting the bidding process');
      }
      bidAmount = Number(result);
      if (bidAmount < minRequired || Number.isNaN(bidAmount) || !Number.isFinite(bidAmount)) {
        alert('Please enter a valid amount and try again!');
      }
    }
    const account = WalletAccountProvider.get().account;
    await dialog.process(async function () {
      if (wallet?.userWallet?.wallet == null) {
        return alert('First connect your wallet!');
      }
      this.title = `Placing a bid (${bidAmount} μAlgo)`;
      this.message = 'Making the payment....';
      const payTxn = await algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: account.addr,
        to: appAddr,
        amount: bidAmount,
        suggestedParams: await client().getTransactionParams().do(),
      });
      this.message = `Making application call...`;
      console.log(`Smart contract wallet: ${appAddr}`);
      console.log(
        `Using this smart contract: https://testnet.algoexplorer.io/application/${appIndex}`
      );
      const callTxn = await algosdk.makeApplicationCallTxnFromObject({
        from: account.addr,
        appIndex,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: ['bid'.toBytes()],
        foreignAssets: [state.nft_id],
        accounts: previousBid.fold([], (s) => [s]),
        suggestedParams: await client().getTransactionParams().do(),
      });
      const txns = algosdk.assignGroupID([payTxn, callTxn]);
      const signedTxn = await wallet.userWallet.wallet.signTxn(txns);
      const { txId } = await client()
        .sendRawTransaction(signedTxn.map((tx) => tx.blob))
        .do();
      this.message = `Waiting for confirmation...`;
      try {
        await algosdk.waitForConfirmation(client(), txId, 10);
        this.message = `Done!`;
        await updateSmartContractData();
      } catch {
        this.message = `FATAL! Could not send your transaction.`;
        await new Promise((r) => setTimeout(r, 1000));
      }
      await new Promise((r) => setTimeout(r, 1000));
    });
  }

  return (
    <MainLayout>
      <div className="w-[45rem] m-auto">
        <div className="flex justify-around">
          {data?.image_url.endsWith('.mp4') ? (
            <div className="w-full object-cover rounded-lg min-h-[325px] max-h-[325px] mr-8">
              <video className=" min-h-[325px] max-h-[325px]" autoPlay loop muted>
                <source src={checkIfVideo(data?.image_url)} type="video/mp4" />
              </video>
            </div>
          ) : (
            <div className="w-full object-cover mr-8 rounded-lg">
              <img
                className="w-full object-contain min-h-[325px] max-h-[325px] "
                src={data?.image_url}
                alt={data?.image_url}
              />
            </div>
          )}

          <div className="flex flex-col justify-around">
            <h2 className="text-2xl">
              <strong>{data?.title}</strong>
            </h2>
            <p>
              Description: <strong>{data?.arc69?.description}</strong>
            </p>
            <p>
              Creator: <strong>{data?.arc69?.properties?.artist}</strong>{' '}
            </p>
            <p>
              Cause: <strong>{data?.arc69?.properties?.cause}</strong>{' '}
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            className="text-2xl flex text-climate-white mt-8 font-dinpro"
            onClick={doPlaceABid}
          >
            <span>
              Place a new bid{' '}
              <strong>
                {smartContractState.fold(
                  data?.arc69?.properties?.price,
                  (state) => state.bid_amount
                )}
              </strong>{' '}
            </span>
            <img className="w-4 h-4 self-center ml-1" src={algoLogoWhite} alt="algologowhite" />
          </Button>
        </div>
      </div>
      {error && <div>{error}</div>}
    </MainLayout>
  );
};
