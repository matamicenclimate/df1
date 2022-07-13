import ProcessDialog from '@/service/ProcessDialog';
import OptInService from '@common/src/services/OptInService';
import * as WalletAccountProvider from '@common/src/services/WalletAccountProvider';
import { None, Option, Some } from '@octantis/option';
import { Wallet } from 'algorand-session-wallet';
import { t } from 'i18next';
import Container from 'typedi';
import CurrentNFTInfo from '../state/CurrentNFTInfo';
import algosdk from 'algosdk';
import { client } from '@/lib/algorand';
import NetworkClient from '@common/src/services/NetworkClient';
import { useNavigate } from 'react-router-dom';
import directListingAbi from '@common/src/abi/direct-listing.abi';
import { algosToMicroalgos, microalgosToAlgos } from './minting';
import { useWalletFundsContext } from '@/context/WalletFundsContext';

/** The deposit fee value. */
export const depositTxCount = 7;
/** Base transactions that will be paid immediately. None atm. */
export const baseTxFees = 0;
/** The extra amount of money needed for future transactions. */
export const computedExtraFees = algosdk.ALGORAND_MIN_TX_FEE * (depositTxCount + baseTxFees);

/**
 * Returns true if the passed array is all-zero.
 */
function isZeroAccount(account: Uint8Array) {
  return account.reduce((a, b) => a + b, 0) === 0;
}

function voidResult(of: () => void) {
  return {
    doPlaceABid: of,
    doBuyNFT: of,
  };
}

/**
 * Builds buy NFT and place-a-bid for NFT function actions.
 * @param aId
 * @param wallet
 * @param nft
 * @param updateNFTInfo
 * @returns
 */
export function useNFTPurchasingActions(
  assetId: string,
  wallet: Wallet | undefined,
  nft: Option<CurrentNFTInfo>,
  updateNFTInfo: () => Promise<void>
) {
  const { balanceAlgo } = useWalletFundsContext();
  const goToPage = useNavigate();

  const aId = Number(assetId);
  if (Number.isNaN(aId)) {
    return voidResult(() => {
      throw new Error(t('NFTDetail.dialog.assetWrongFormat'));
    });
  }
  if (!nft.isDefined()) {
    return voidResult(() => alert('Nope.avi'));
  }
  const appId = nft.value.nft.applicationIdBlockchain;
  const priceNft = nft.value.nft?.asset?.arc69.properties.price;

  if (appId == null) {
    return voidResult(() => alert(t('NFTDetail.dialog.attemptError')));
  }
  const dialog = Container.get(ProcessDialog);
  const net = Container.get(NetworkClient);
  // The buy action.
  return {
    async doBuyNFT() {
      if (balanceAlgo != null && balanceAlgo < microalgosToAlgos(priceNft + computedExtraFees)) {
        return await dialog.process(async function () {
          this.title = 'No sufficient funds to purchase';
          this.message = `Account balance has to be greater than ${microalgosToAlgos(
            priceNft
          )} Algos`;

          return await new Promise((r) => setTimeout(r, 4000));
        });
      }
      return await dialog.process(async function () {
        this.title = 'Processing NFT purchase';
        this.message = 'Preparing NFT...';
        /** @TODO Logic check amounts before app call. */
        const account = WalletAccountProvider.get().account;
        const optTxn = await Container.get(OptInService).createOptInRequest(aId, account.addr);
        const state = nft.get().state.get();
        const callTxn = await algosdk.makeApplicationCallTxnFromObject({
          from: account.addr,
          appIndex: appId,
          onComplete: algosdk.OnApplicationComplete.NoOpOC,
          appArgs: [directListingAbi.getMethodByName('on_bid').getSelector()],
          accounts: [
            algosdk.encodeAddress(state.cause),
            algosdk.encodeAddress(state.creator),
            algosdk.encodeAddress(state.seller),
          ],
          foreignAssets: [aId],
          suggestedParams: await client().getTransactionParams().do(),
        });
        const appAddr = algosdk.getApplicationAddress(appId);

        const payTxn = await algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: account.addr,
          to: appAddr,
          amount: nft.value.nft.asset.arc69.properties.price + computedExtraFees,
          suggestedParams: await client().getTransactionParams().do(),
        });
        console.log('sending nft data for pay txn', {
          address: account.addr,
          appAddr,
          amount: nft.value.nft.asset.arc69.properties.price + computedExtraFees,
          aId,
        });

        const txns = algosdk.assignGroupID([optTxn, payTxn, callTxn]);
        if (wallet == null) return;
        const signedTxn = await wallet.signTxn(txns);
        const { txId } = await client()
          .sendRawTransaction(signedTxn.map((tx) => tx.blob))
          .do();
        try {
          await algosdk.waitForConfirmation(client(), txId, 10);
          await net.core.delete('sell-asset/:appId', {
            params: {
              appId: appId.toString(),
            },
          });
          await updateNFTInfo();
          this.title = t('Minter.dialog.dialogNFTBuySuccess');
          this.message = '';

          goToPage(`/my-nfts`);
        } catch {
          this.message = t('NFTDetail.dialog.bidFinishedFail');
          await new Promise((r) => setTimeout(r, 1000));
        }
        await new Promise((r) => setTimeout(r, 1000));
      });
    },
    async doPlaceABid() {
      console.log('computedExtraFees', computedExtraFees);
      if (balanceAlgo != null && balanceAlgo < microalgosToAlgos(priceNft + computedExtraFees)) {
        return await dialog.process(async function () {
          this.title = 'No sufficient funds to place a bid';
          this.message = `Account balance has to be greater than ${microalgosToAlgos(
            priceNft
          )} Algos`;

          return await new Promise((r) => setTimeout(r, 4000));
        });
      }
      const appAddr = algosdk.getApplicationAddress(appId);
      let previousBid: Option<string> = None();
      if (!nft.value.state.isDefined()) {
        throw new Error('Attemptint to bid when the state is not set. Contact support.');
      }
      // const state = await this.transactionOperation.getApplicationState(appId) as AuctionAppState

      const state = nft.value.state.get();
      console.log('state', state);

      if (state.bid_account != null && !isZeroAccount(state.bid_account)) {
        previousBid = Some(algosdk.encodeAddress(state.bid_account));
      }
      console.info('Previous bidder:', previousBid.getOrElse('<none>'));
      const minRequired = microalgosToAlgos(
        (state.bid_amount ?? state.reserve_amount) + (state.min_bid_inc ?? 1000000)
      );

      let bidAmount = 0;
      while (
        bidAmount < microalgosToAlgos(minRequired) ||
        Number.isNaN(bidAmount) ||
        !Number.isFinite(bidAmount)
      ) {
        const result = prompt(
          `Enter a bid amount (At least ${minRequired}!):`,
          minRequired.toString()
        );
        if (result === null) {
          return alert('Aborting the bidding process');
        }
        bidAmount = Number(result);
        console.log('bid Amount', bidAmount);
        console.log('minRequired', minRequired);

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
        if (wallet == null) {
          return alert(t('NFTDetail.dialog.alertConnectWallet'));
        }
        // this.title = `Placing a bid (${bidAmount} μAlgo)`;
        this.title = t('NFTDetail.dialog.placingBid');
        this.message = t('NFTDetail.dialog.makingPayment');
        const payTxn = await algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: account.addr,
          to: appAddr,
          amount: algosToMicroalgos(bidAmount) + computedExtraFees,
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
          appArgs: [directListingAbi.getMethodByName('on_bid').getSelector()],
          foreignAssets: [state.nft_id],
          accounts: previousBid.fold([], (s) => [s]),
          suggestedParams: await client().getTransactionParams().do(),
        });
        const optTxn = await Container.get(OptInService).createOptInRequest(aId);
        const txns = algosdk.assignGroupID([payTxn, callTxn, optTxn]);
        const signedTxn = await wallet.signTxn(txns);
        const { txId } = await client()
          .sendRawTransaction(signedTxn.map((tx) => tx.blob))
          .do();
        this.message = t('NFTDetail.dialog.waintingConf');
        try {
          await algosdk.waitForConfirmation(client(), txId, 10);
          this.message = t('NFTDetail.dialog.bidFinishedSuccess');
          await updateNFTInfo();
        } catch {
          this.message = t('NFTDetail.dialog.bidFinishedFail');
          await new Promise((r) => setTimeout(r, 1000));
        }
        await new Promise((r) => setTimeout(r, 1000));
      });
    },
  };
}
