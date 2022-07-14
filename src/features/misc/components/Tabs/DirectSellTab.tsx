import { Button } from '@/componentes/Elements/Button/Button';
import { AssetEntity, Nft } from '@common/src/lib/api/entities';
import { microalgosToAlgos } from '../../lib/minting';
import './mycssfile.css';
import Container from 'typedi';
import ProcessDialog from '@/service/ProcessDialog';
import NetworkClient from '@common/src/services/NetworkClient';
import { useNavigate } from 'react-router-dom';
import algosdk from 'algosdk';
import { useTranslation } from 'react-i18next';
import { WalletContext } from '@/context/WalletContext';
import { useContext } from 'react';

type FirstTabProps = {
  nft: Nft | AssetEntity;
  assetId: number;
  causePercentage: number;
  creatorWallet: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const net = Container.get(NetworkClient);
const dialog = Container.get(ProcessDialog);

/**
 * # Direct Sell
 *
 * Displays a **direct sell** action dialog.
 */
const DirectSellTab = ({
  nft,
  assetId,
  causePercentage,
  creatorWallet,
  setIsOpen,
}: FirstTabProps) => {
  const walletCtx = useContext(WalletContext);
  const goToPage = useNavigate();
  const { t } = useTranslation();

  async function handleListing() {
    setIsOpen(false);
    return await dialog.process(async function () {
      this.title = 'Processing NFT';
      this.message = 'Preparing NFT...';
      // console.log('working');
      // const optResult = await net.core.post('opt-in', { assetId });
      // console.info('Asset opted-in:', optResult);
      // this.message = 'Opting in...';
      // const transfer = await Container.get(AuctionLogic).makeTransferToAccount(
      //   optResult.data.targetAccount,
      //   assetId,
      //   new Uint8Array()
      // );
      // console.info('Asset transfer to app:', transfer);
      this.message = 'Listing NFT...';
      const {
        data: {
          appIndex,
          unsignedTxnGroup: { encodedTransferTxn, ...otherTxn },
        },
      } = await net.core.post('create-listing', {
        assetId,
        causePercentage,
        creatorWallet,
        type: 'direct-listing',
      });
      const tx = algosdk.decodeUnsignedTransaction(Buffer.from(encodedTransferTxn, 'base64'));
      const wallet = walletCtx?.userWallet?.wallet;
      if (wallet == null) {
        throw new Error('Invalid app state!');
      }
      tx.from = algosdk.decodeAddress(wallet.getDefaultAccount());
      console.log('Signing transaction of:', tx);
      const [stx] = await wallet.signTxn([tx]);
      const res = await net.core.post('finish-create-listing', {
        appIndex,
        type: 'direct-listing',
        signedTxn: {
          ...otherTxn,
          signedTransferTxn: Buffer.from(stx.blob).toString('base64'),
        },
      });
      if (res) {
        this.title = t('Minter.dialog.dialogNFTListedSuccess');
        this.message = '';

        goToPage(`/`);
        await new Promise((r) => setTimeout(r, 5000));
      }
      return res.data;
    });
  }

  return (
    <div className="relative">
      <p className="text-center h-52 pt-14 font-bold">
        Listing NFT for {microalgosToAlgos(nft.arc69.properties.price)} Algo?
      </p>
      <div className="absolute bottom-0 right-0 mt-6 text-right">
        <Button onClick={handleListing}>Confirm</Button>
      </div>
    </div>
  );
};
export default DirectSellTab;
