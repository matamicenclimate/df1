import { Button } from '@/componentes/Elements/Button/Button';
import { CauseContext, CauseContextType } from '@/context/CauseContext';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { useContext, useEffect } from 'react';
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
import { fetchNfts } from '@/lib/NFTFetching';
import Fold from '@/componentes/Generic/Fold';
import OptInService from '@common/src/services/OptInService';
import { TransactionOperation } from '@common/src/services/TransactionOperation';
import { Case, Match } from '@/componentes/Generic/Match';
import { AuctionAppState } from '@common/src/lib/types';
import useOptionalState from '@/hooks/useOptionalState';
import CurrentNFTInfo from '../state/CurrentNFTInfo';
import NftDetailPreview from '../components/NftDetailPreview';
import { useTranslation } from 'react-i18next';
import NetworkClient from '@common/src/services/NetworkClient';
import { retrying } from '@common/src/lib/net';
import { Cause } from '@/lib/api/causes';
import { NFTListed } from '@/lib/api/nfts';

const getDateObj = (mintingDate: any) => {
  const date = new Date(mintingDate);
  const day = date.getDate();
  const monthName = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `Minted on ${day} ${monthName} ${year}`;
};

/**
 * Returns true if the passed array is all-zero.
 */
function isZeroAccount(account: Uint8Array) {
  return account.reduce((a, b) => a + b, 0) === 0;
}

const net = Container.get(NetworkClient);

async function tryGetNFTData(
  id: string,
  nft: option<CurrentNFTInfo>,
  setNft: (nft: CurrentNFTInfo) => void,
  setError: (err: unknown) => void
) {
  try {
    const {
      data: { value: nft },
    } = await retrying(net.core.get('asset/:id', { params: { id } }), 10);
    const appId = nft.arc69.properties.app_id;
    if (appId == null) {
      return setNft({ state: none(), nft });
    }
    const state = await TransactionOperation.do.getApplicationState<AuctionAppState>(appId);
    setNft({ state: some(state), nft });
  } catch (err) {
    setError(err);
  }
}

let sideTimer: NodeJS.Timeout | null = null;
export const NftDetail = () => {
  const { t } = useTranslation();
  const causeContext = useContext(CauseContext);
  const causes = causeContext?.data?.map((cause) => cause);
  const { ipnft: assetId } = useParams() as { ipnft: string };
  const [nft, setNft] = useOptionalState<CurrentNFTInfo>();
  const [error, setError, resetError] = useOptionalState<unknown>();
  const wallet = useContext(WalletContext);
  const now = Date.now() / 1000;

  function updateNFTInfo() {
    return tryGetNFTData(assetId, nft, setNft, setError);
  }
  useEffect(() => {
    updateNFTInfo();
  }, []);
  useEffect(() => {
    for (const data of nft) {
      if (!data.state.isDefined()) {
        if (sideTimer != null) {
          clearTimeout(sideTimer);
        }
        sideTimer = setTimeout(() => {
          updateNFTInfo();
        }, 1 * 60 * 1000);
      }
    }
  }, [nft]);

  /** The deposit fee value. */
  const depositTxCount = 7;
  /** Base transactions that will be paid immediately. None atm. */
  const baseTxFees = 0;
  /** The extra amount of money needed for future transactions. */
  const computedExtraFees = algosdk.ALGORAND_MIN_TX_FEE * (depositTxCount + baseTxFees);

  // Test: Place a bid!
  async function doPlaceABid() {
    const dialog = Container.get(ProcessDialog);
    if (!nft.isDefined()) {
      return alert(t('NFTDetail.dialog.bidError'));
    }
    const appId = nft.value.nft.arc69.properties.app_id;
    if (appId == null) {
      return alert(t('NFTDetail.dialog.attemptError'));
    }
    const appAddr = algosdk.getApplicationAddress(appId);
    let previousBid: option<string> = none();
    if (!nft.value.state.isDefined()) {
      throw new Error('Attemptint to bid when the state is not set. Contact support.');
    }
    const state = nft.value.state.get();
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
        alert(t('NFTDetail.dialog.bidErrorAmount'));
      }
    }
    const account = WalletAccountProvider.get().account;
    await dialog.process(async function () {
      const aId = Number(assetId);
      if (Number.isNaN(aId)) {
        throw new Error(t('NFTDetail.dialog.assetWrongFormat'));
      }
      if (wallet?.userWallet?.wallet == null) {
        return alert(t('NFTDetail.dialog.alertConnectWallet'));
      }
      // this.title = `Placing a bid (${bidAmount} μAlgo)`;
      this.title = t('NFTDetail.dialog.placingBid');
      this.message = t('NFTDetail.dialog.makingPayment');
      const payTxn = await algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: account.addr,
        to: appAddr,
        amount: bidAmount + computedExtraFees,
        suggestedParams: await client().getTransactionParams().do(),
      });
      this.message = t('NFTDetail.dialog.makingAppCall');
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
      const optTxn = await Container.get(OptInService).createOptInRequest(aId);
      const txns = algosdk.assignGroupID([payTxn, callTxn, optTxn]);
      const signedTxn = await wallet.userWallet.wallet.signTxn(txns);
      const { txId } = await client()
        .sendRawTransaction(signedTxn.map((tx) => tx.blob))
        .do();
      this.message = t('NFTDetail.dialog.waintingConf');
      try {
        await algosdk.waitForConfirmation(client(), txId, 10);
        this.message = t('NFTDetail.dialog.bidFinishedSuccess');
        await fetchNfts();
        await updateNFTInfo();
      } catch {
        this.message = t('NFTDetail.dialog.bidFinishedFail');
        await new Promise((r) => setTimeout(r, 1000));
      }
      await new Promise((r) => setTimeout(r, 1000));
    });
  }

  const getCauseTitle = (causes: Cause[] | undefined, nft: NFTListed) => {
    const cause: Cause | undefined = causes?.find(
      (cause: Cause) => cause.id === nft?.arc69?.properties?.cause
    );
    return cause?.title;
  };

  return (
    <MainLayout>
      <Fold
        option={error}
        as={(e) => <div className="text-red-600 flex justify-center">Error: {`${e}`}</div>}
      />
      <Fold
        option={nft}
        as={(detail) => (
          <div className="grid grid-cols-3 gap-4">
            <div className="left col-span-2 flex justify-center">
              <div className="w-[670px]">
                <div>
                  <div className="py-14">
                    <h4 className="font-dinpro font-normal text-2xl">
                      {t('NFTDetail.Overview.nftDescription')}
                    </h4>
                  </div>
                  <div>
                    <p className="font-sanspro font-normal text-sm ">
                      {detail.nft.arc69.description}
                    </p>
                  </div>
                  <div>
                    <div className="py-14">
                      <h4 className="font-dinpro font-normal text-2xl">
                        {t('NFTDetail.Overview.nftCause')}
                      </h4>
                    </div>
                    <div className="w-[650px]">
                      <CauseDetail nftDetailCause={detail.nft.arc69.properties.cause} />
                    </div>
                  </div>
                  <div className="image w-[650px] h-[580px]">
                    <div className="py-14 flex justify-between font-dinpro">
                      <h4 className="font-normal text-2xl">
                        {t('NFTDetail.Overview.nftResources')}
                      </h4>
                      <p className="self-center font-normal text-climate-gray-light text-lg">
                        {getDateObj(detail.nft.arc69.properties.date)}
                      </p>
                    </div>
                    <div className="w-full min-h-[580px] max-h-[580px] object-cover mr-8 rounded-lg">
                      <NftDetailPreview nft={nft} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="right-40 col-span-1">
              <div className="rounded-xl p-5 h-[715px] w-[370px] bg-white shadow-[3px_-5px_40px_0px_rgba(205, 205, 212, 0.3)]">
                <div className="image w-[330px] h-[345px]">
                  <NftDetailPreview nft={nft} />
                </div>
                <div className="p-3">
                  <div className="cardText">
                    <div className="bg-white">
                      <div className="font-sanspro font-semibold text-climate-green flex items-baseline">
                        <span className="h-2 w-2 bg-climate-green rounded-full inline-block mr-1 self-center"></span>
                        <p className="whitespace-nowrap overflow-hidden truncate text-ellipsis">
                          {getCauseTitle(causes, detail.nft)}
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
                    </div>
                    <div className="flex self-end">
                      <p className="text-xl text-climate-blue self-center">
                        {detail.state.fold(detail.nft.arc69.properties.price, (_) => _.bid_amount)}
                      </p>
                      <img className="w-4 h-4 self-center ml-1" src={algoLogo} alt="algologo" />
                    </div>
                  </div>
                  {detail.state.fold(
                    <div>
                      <h4>The asset is being processed</h4>
                      <p>Wait some time before it gets ready.</p>
                    </div>,
                    () => null
                  )}
                  <Fold
                    option={detail.state}
                    as={(state) => (
                      <div className="buttons">
                        <Button
                          disabled={
                            wallet?.userWallet?.account == null ||
                            wallet?.userWallet?.account == '' ||
                            detail.nft.creator === wallet?.userWallet?.account ||
                            state.end < now
                          }
                          onClick={doPlaceABid}
                          className="w-full text-2xl text-climate-white mt-8 font-dinpro"
                        >
                          <span>
                            <Match>
                              <Case of={detail.nft.creator === wallet?.userWallet?.account}>
                                This is your own NFT
                              </Case>
                              <Case
                                of={
                                  wallet?.userWallet?.account == null ||
                                  wallet?.userWallet?.account == ''
                                }
                              >
                                Connect your wallet
                              </Case>
                              <Case of={state.end < now}>The auction has ended</Case>
                              <Case of="default">Place Bid</Case>
                            </Match>
                          </span>
                        </Button>
                        <Match>
                          <Case of={state.end < now}>
                            <span className="text-gray-500 text-sm">
                              Ended {new Date(state.end * 1000).toLocaleString()}
                            </span>
                          </Case>
                        </Match>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      >
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      </Fold>
    </MainLayout>
  );
};
