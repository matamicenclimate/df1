import { Button } from '@/componentes/Elements/Button/Button';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { NFTListed } from '@/lib/api/nfts';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import algoLogo from '../../../assets/algoLogo.svg';
import algosdk from 'algosdk';
import { client } from '@/lib/algorand';
import { none, option, some } from '@octantis/option';
import * as WalletAccountProvider from '@common/src/services/WalletAccountProvider';
import Container from 'typedi';
import ProcessDialog from '@/service/ProcessDialog';
import '@common/src/lib/binary/extension';
import { WalletContext } from '@/context/WalletContext';
import { CauseDetail } from '@/componentes/CauseDetail/CauseDetail';
import { useQuery } from 'react-query';
import { fetchNfts } from '@/lib/NFTFetching';
import { isVideo } from '@/lib/media';
import { assertArray } from '@/lib/type';

type Entry = {
  key: string;
  value: { bytes: string; type: 1 | 2; uint: number };
};

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
  bid_amount?: number;
  num_bids?: number;
  min_bid_inc: number;
  reserve_amount: number;
  start: number;
  seller: Uint8Array;
}

type CurrentNFTInfo = {
  nft: NFTListed;
  state: SmartContractState;
};

export const NftDetail = () => {
  const { ipnft: assetId } = useParams();
  const { data: queryData } = useQuery('nfts', fetchNfts);
  const data: NFTListed[] | undefined = useMemo(() => {
    return queryData?.map((nft) => ({ ...nft, image_url: isVideo(nft.image_url) }));
  }, [queryData]);
  const [nft, setNft] = useState<option<CurrentNFTInfo>>(none());
  const [error, setError] = useState<option<unknown>>(none());
  const wallet = useContext(WalletContext);

  useEffect(() => {
    if (assetId != null && data != null) {
      setError(none());
      const found = data.find((i) => i.id === Number(assetId));
      if (found != null && found.arc69.properties.app_id != null) {
        getGlobalState(found.arc69.properties.app_id).then((info) => {
          setNft(
            some({
              nft: found,
              state: info as unknown as SmartContractState,
            })
          );
        });
      } else {
        setError(
          some(`Invalid asset ${assetId}, no application found for the provided asset identifier.`)
        );
      }
    }
  }, [assetId, data]);

  // useEffect(() => {
  //   fetchNfts();
  //   // const interval = setInterval(() => {
  //   //   fetchNfts();
  //   // }, 20000);
  //   // return () => clearInterval(interval);
  // }, [idParam]);

  // const fetchNfts = async () => {
  //   try {
  //     const nft = await httpClient.get('nfts').then((s) => s.data.find((s) => s.id === id));
  //     if (nft == null) {
  //       throw new Error(`Invalid NFT selected "${idParam}"!`);
  //     }
  //     const appId = nft.arc69.properties.app_id;
  //     if (appId == null) {
  //       throw new Error(`Invalid NFET metadata for ${idParam}!`);
  //     }
  //     const state = (await getGlobalState(appId)) as unknown as SmartContractState;
  //     setNft({ nft, state });
  //   } catch (err: any) {
  //     setError(err.message);
  //   }
  // };

  const nftDetailLogo = nft.fold(<Spinner />, (detail) =>
    detail.nft.image_url.endsWith('.mp4') ? (
      <div className="w-full object-cover rounded-lg min-h-[325px] max-h-[325px] mr-8">
        <video className="min-h-[325px] max-h-[325px]" autoPlay loop muted>
          <source src={isVideo(detail.nft.image_url)} type="video/mp4" />
        </video>
      </div>
    ) : (
      <img
        className="w-full h-full object-contain rounded-xl"
        src={detail.nft.image_url}
        alt={detail.nft.image_url}
      />
    )
  );

  type Entry = {
    key: string;
    value: { bytes: string; type: 1 | 2; uint: number };
  };

  const getDateObj = (mintingDate: any) => {
    const date = new Date(mintingDate);
    const day = date.getDate();
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `Minted on ${day} ${monthName} ${year}`;
  };

  async function getGlobalState(appId: number): Promise<Record<string, unknown>> {
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
    }, {});
  }

  /**
   * Returns true if the passed array is all-zero.
   */
  function isZeroAccount(account: Uint8Array) {
    return account.reduce((a, b) => a + b, 0) === 0;
  }

  // Test: Place a bid!
  async function doPlaceABid() {
    const dialog = Container.get(ProcessDialog);
    if (!nft.isDefined()) {
      return alert(`Can't place a bid! App index couldn't be setted.`);
    }
    const appId = nft.value.nft.arc69.properties.app_id;
    if (appId == null) {
      return alert(`Attempting to place a bid on an invalid asset.`);
    }
    const appAddr = algosdk.getApplicationAddress(appId);
    let previousBid: option<string> = none();
    const state = nft.value.state;
    if (state == null) return;
    if (!isZeroAccount(state.bid_account)) {
      previousBid = some(algosdk.encodeAddress(state.bid_account));
    }
    console.info('Previous bidder:', previousBid.getOrElse('<none>'));
    const minRequired = (state.bid_amount ?? state.reserve_amount) + (state.min_bid_inc ?? 10);
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
        `Using this smart contract: https://testnet.algoexplorer.io/application/${appId}`
      );
      const callTxn = await algosdk.makeApplicationCallTxnFromObject({
        from: account.addr,
        appIndex: appId,
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
        await fetchNfts();
      } catch {
        this.message = `FATAL! Could not send your transaction.`;
        await new Promise((r) => setTimeout(r, 1000));
      }
      await new Promise((r) => setTimeout(r, 1000));
    });
  }

  if (error)
    return (
      <MainLayout>
        <div className="flex justify-center">{error}</div>
      </MainLayout>
    );
  return (
    <MainLayout>
      {nft.fold(
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>,
        (detail) => (
          <div className="grid grid-cols-3 gap-4">
            <div className="left col-span-2 flex justify-center">
              <div className="w-[670px]">
                <div>
                  <div className="py-14">
                    <h4 className="font-dinpro font-normal text-2xl">Description</h4>
                  </div>
                  <div>
                    <p className="font-sanspro font-normal text-sm ">
                      {detail.nft.arc69.description}
                    </p>
                  </div>
                  <div>
                    <div className="py-14">
                      <h4 className="font-dinpro font-normal text-2xl">Causes</h4>
                    </div>
                    <div className="w-[650px]">
                      <CauseDetail nftDetailCause={detail.nft.arc69.properties.cause} />
                    </div>
                  </div>
                  <div className="image w-[650px] h-[580px]">
                    <div className="py-14 flex justify-between font-dinpro">
                      <h4 className="font-normal text-2xl">Resources</h4>
                      <p className="self-center font-normal text-climate-gray-light text-lg">
                        {getDateObj(detail.nft.arc69.properties.date)}
                      </p>
                    </div>
                    <div className="w-full min-h-[580px] max-h-[580px] object-cover mr-8 rounded-lg">
                      {nftDetailLogo}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="right col-span-1">
              <div className="rounded-xl p-5 h-[715px] w-[370px] bg-white shadow-[3px_-5px_40px_0px_rgba(205, 205, 212, 0.3)]">
                <div className="image w-[330px] h-[345px]">{nftDetailLogo}</div>
                <div className="p-3">
                  <div className="cardText">
                    <div className="bg-white">
                      <div className="font-sanspro font-semibold text-climate-green flex items-baseline">
                        <span className="h-2 w-2 bg-climate-green rounded-full inline-block mr-1 self-center"></span>
                        <p className="whitespace-nowrap overflow-hidden truncate text-ellipsis">
                          {detail.nft.arc69.properties.cause}
                        </p>
                      </div>
                      <h4 className="py-2 text-4xl font-dinpro font-normal uppercase truncate text-ellipsis ">
                        {detail.nft.title}
                      </h4>
                      <div className="font-sanspro text-climate-gray-artist text-sm truncate text-ellipsis">
                        @{detail.nft.arc69.properties.artist}
                      </div>
                    </div>
                  </div>
                  <div className="offerBid flex justify-between py-7">
                    <div className="flex flex-col">
                      <label
                        className="font-sanspro text-climate-gray-artist text-sm pb-4"
                        htmlFor="title"
                      >
                        Offer Bid
                      </label>
                      {/* <input
                className="shadow appearance-none border border-gray-500 rounded-xl w-36 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                id="title"
                type="text"
                placeholder={`${smartContractState.fold(
                  nftSelected?.arc69?.properties?.price,
                  (state) => state.bid_amount
                )}`}
              /> */}
                    </div>
                    <div className="flex self-end">
                      <p className="text-xl text-climate-blue self-center">
                        {detail.state.bid_amount ?? detail.nft.arc69.properties.price}
                      </p>
                      <img className="w-4 h-4 self-center ml-1" src={algoLogo} alt="algologo" />
                    </div>
                  </div>
                  <div className="buttons">
                    <Button
                      onClick={doPlaceABid}
                      className="w-full text-2xl text-climate-white mt-8 font-dinpro"
                    >
                      <span>Place Bid</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </MainLayout>
  );
};
