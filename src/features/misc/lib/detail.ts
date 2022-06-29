import ProcessDialog from '@/service/ProcessDialog';
import OptInService from '@common/src/services/OptInService';
import * as WalletAccountProvider from '@common/src/services/WalletAccountProvider';
import { Some, None, Option } from '@octantis/option';
import { Wallet } from 'algorand-session-wallet';
import { t } from 'i18next';
import Container from 'typedi';
import CurrentNFTInfo from '../state/CurrentNFTInfo';
import { client } from '@/lib/algorand';
import NetworkClient from '@common/src/services/NetworkClient';
import { useNavigate } from 'react-router-dom';
import directListingAbi from '@common/src/abi/direct-listing.abi';
import { microalgosToAlgos } from './minting';
import { BlockchainGatewayProvider } from '@common/src/blockchain';
import { SmartContractID } from '@common/src/blockchain/lib/SmartContract';
import { ChainAsset } from '@common/src/blockchain/lib/ChainAsset';
import { ChainWallet } from '@common/src/blockchain/lib/ChainWallet';
import { SmartContractMethod } from '@common/src/blockchain/lib/SmartContractMethod';

const chain = Container.get(BlockchainGatewayProvider).require();

/** The deposit fee value. */
export const depositTxCount = 7;
/** Base transactions that will be paid immediately. None atm. */
export const baseTxFees = 0;
/** The extra amount of money needed for future transactions. */
export const computedExtraFees = chain
  .getBaseGas({})
  .then((s) => s.value * (depositTxCount + baseTxFees));

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
  _asset: Option<ChainAsset>,
  _smartContract: Option<SmartContractID>,
  method: SmartContractMethod,
  _caller: Option<ChainWallet>,
  participants: ChainWallet[],
  _nft: Option<CurrentNFTInfo>,
  updateNFTInfo: () => Promise<void>
) {
  const goToPage = useNavigate();
  if (_caller.isEmpty()) {
    return voidResult(() => alert(t('NFTDetail.dialog.alertConnectWallet')));
  }
  if (_asset.isEmpty()) {
    return voidResult(() => {
      throw new Error(t('NFTDetail.dialog.assetWrongFormat'));
    });
  }
  if (_nft.isEmpty()) {
    return voidResult(() => alert('Nope.avi'));
  }
  if (_smartContract.isEmpty()) {
    return voidResult(() => alert(t('NFTDetail.dialog.attemptError')));
  }
  const caller = _caller.value;
  const asset = _asset.value;
  const nft = _nft.value;
  const smartContract = _smartContract.value;
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
          smartContract,
          asset,
        });
        const optInOp = await chain.optIn({ asset }).then((o) => o.operation);
        const state = nft.state.get();
        const sm = await chain.bindSmartContract(smartContract);
        const callOp = await sm.prepareInvoke({
          participants,
          assets: [asset],
          parameters: {},
          method,
          caller,
        });
        const contractWallet = await chain.getSmartContractWallet(smartContract);
        const amount = nft.nft.arc69.properties.price + (await computedExtraFees);
        const payOp = await chain.pay({ payer: caller, payee: contractWallet, amount });
        const cluster = await optInOp
          .cluster(payOp, callOp)
          .sign()
          .then((o) => o.commit())
          .then((o) => o.confirm());
        try {
          await net.core.delete('sell-asset/:appId', {
            params: {
              appId: smartContract.toString(),
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
      let previousBid: option<string> = None();
      if (!nft.value.state.isDefined()) {
        throw new Error('Attemptint to bid when the state is not set. Contact support.');
      }
      const state = nft.value.state.get();
      if (!isZeroAccount(state.bid_account)) {
        previousBid = Some(algosdk.encodeAddress(state.bid_account));
      }
      console.info('Previous bidder:', previousBid.getOrElse('<none>'));
      console.log('statestatestate', state);

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
