import ProcessDialog from '@/service/ProcessDialog';
import OptInService from '@common/src/services/OptInService';
import * as WalletAccountProvider from '@common/src/services/WalletAccountProvider';
import { none, option, some } from '@octantis/option';
import { Wallet } from 'algorand-session-wallet';
import { t } from 'i18next';
import Container from 'typedi';
import CurrentNFTInfo from '../state/CurrentNFTInfo';
import algosdk from 'algosdk';
import { client } from '@/lib/algorand';
import NetworkClient from '@common/src/services/NetworkClient';
import { useNavigate } from 'react-router-dom';
import directListingAbi from '@common/src/abi/direct-listing.abi';

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
  nft: option<CurrentNFTInfo>,
  updateNFTInfo: () => Promise<void>
) {
  const goToPage = useNavigate();
  if (wallet == null) {
    return voidResult(() => alert(t('NFTDetail.dialog.alertConnectWallet')));
  }
  const aId = Number(assetId);
  if (Number.isNaN(aId)) {
    return voidResult(() => {
      throw new Error(t('NFTDetail.dialog.assetWrongFormat'));
    });
  }
  if (!nft.isDefined()) {
    return voidResult(() => alert('Nope.avi'));
  }
  const appId = nft.value.nft.arc69.properties.app_id;
  if (appId == null) {
    return voidResult(() => alert(t('NFTDetail.dialog.attemptError')));
  }
  const dialog = Container.get(ProcessDialog);
  const net = Container.get(NetworkClient);
  // The buy action.
  return {
    async doBuyNFT() {
      return await dialog.process(async function () {
        this.title = 'Processing NFT purchase';
        this.message = 'Preparing NFT...';
        /** @TODO Logic check amounts before app call. */
        const account = WalletAccountProvider.get().account;
        console.log('sending nft data for call', {
          address: account.addr,
          appId,
          aId,
        });
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
          amount: nft.value.nft.arc69.properties.price + computedExtraFees,
          suggestedParams: await client().getTransactionParams().do(),
        });
        console.log('sending nft data for pay txn', {
          address: account.addr,
          appAddr,
          amount: nft.value.nft.arc69.properties.price + computedExtraFees,
          aId,
        });

        const txns = algosdk.assignGroupID([optTxn, payTxn, callTxn]);
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
        if (wallet == null) {
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
