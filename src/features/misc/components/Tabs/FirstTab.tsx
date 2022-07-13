import { Button } from '@/componentes/Elements/Button/Button';
import { AssetEntity, Nft } from '@common/src/lib/api/entities';
import { microalgosToAlgos } from '../../lib/minting';
import './mycssfile.css';
import Container from 'typedi';
import ProcessDialog from '@/service/ProcessDialog';
import NetworkClient from '@common/src/services/NetworkClient';
import { useNavigate } from 'react-router-dom';
import { AuctionLogic } from '@common/src/services/AuctionLogic';
import { useTranslation } from 'react-i18next';

type FirstTabProps = {
  nft: Nft | AssetEntity;
  assetId: number;
  causePercentage: number;
  creatorWallet: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const net = Container.get(NetworkClient);
const dialog = Container.get(ProcessDialog);

const FirstTab = ({ nft, assetId, causePercentage, creatorWallet, setIsOpen }: FirstTabProps) => {
  const goToPage = useNavigate();
  const { t } = useTranslation();

  async function handleListing() {
    setIsOpen(false);
    return await dialog.process(async function () {
      this.title = 'Processing NFT';
      this.message = 'Preparing NFT to be listed...';
      console.log('working');
      const optResult = await net.core.post('opt-in', { assetId });
      console.info('Asset opted-in:', optResult);
      const transfer = await Container.get(AuctionLogic).makeTransferToAccount(
        optResult.data.targetAccount,
        assetId,
        new Uint8Array()
      );
      console.info('Asset transfer to app:', transfer);
      const body = {
        assetId,
        causePercentage,
        creatorWallet,
      };
      console.log('body', body);
      this.message = 'Listing NFT...';
      const res = await net.core.post('direct-listing', body);
      console.log('res.data', res.data);
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
export default FirstTab;
