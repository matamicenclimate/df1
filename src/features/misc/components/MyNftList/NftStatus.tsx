import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { destroyAsset } from '../../../../lib/nft';
import { useWalletContext } from '@/context/WalletContext';
import { client } from '@/lib/algorand';
import { Wallet } from 'algorand-session-wallet';
import { Dialog } from '@/componentes/Dialog/Dialog';
import { Button } from '@/componentes/Elements/Button/Button';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import Tabs from '../Tabs/Tabs';
import { AssetEntity, Nft, NftAssetInfo } from '@common/src/lib/api/entities';
import NetworkClient from '@common/src/services/NetworkClient';
import Container from 'typedi';

export interface NftStatusProps {
  onEdit?: () => void;
  onDuplicate?: () => void;
  onSend?: () => void;
  onDelete?: () => void;
  className?: string;
  assetId: number;
  causePercentage: number;
  creatorWallet: string;
  nft: Nft | AssetEntity;
}

export default function NftStatus({
  className,
  assetId,
  causePercentage,
  creatorWallet,
  nft,
}: NftStatusProps) {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showSellingOptions, setShowSellingOptions] = useState<boolean>(false);
  const [openSpinner, setOpenSpinner] = useState<boolean>(false);
  const [assetInfo, setAssetInfo] = useState<NftAssetInfo>();
  const [disabled, setDisabled] = useState<boolean>(false);
  const { wallet } = useWalletContext();
  const algodClient = client();

  const refreshPage = () => {
    window.location.reload();
  };

  async function handleDelete() {
    setOpenDropdown(false);
    setOpenSpinner(true);
    await destroyAsset(algodClient, creatorWallet, assetId, wallet as Wallet);
    refreshPage();
  }

  function handleTabs() {
    setOpenDropdown(!openDropdown);
    setShowSellingOptions(true);
  }

  async function getAssetInfo(id: string) {
    const res = await Container.get(NetworkClient).core.get('asset-info/:id', { params: { id } });
    setAssetInfo({ ...nft, assetInfo: { ...res.data } });
  }

  useEffect(() => {
    getAssetInfo(assetId.toString());
  }, []);

  const disableButton = () => {
    // TODO El estado debe ser correcto y no mirar el isClosed
    if (
      (assetInfo?.assetInfo.type === 'direct-listing' || assetInfo?.assetInfo.type === 'auction') &&
      !assetInfo?.assetInfo.isClosed
    ) {
      return setDisabled(true);
    }
    return disabled as boolean;
  };

  const handleDropdown = () => {
    disableButton();
    setOpenDropdown(!openDropdown);
  };

  return (
    <div className={clsx('flex justify-between items-center', className)}>
      <div>
        {assetInfo?.assetInfo.type === 'direct-listing' ? (
          <p>Direct Buy</p>
        ) : assetInfo?.assetInfo.type === 'auction' ? (
          <p>Auction</p>
        ) : (
          'Not Listed'
        )}
      </div>
      <div>
        <span
          onClick={handleDropdown}
          className="cursor-pointer text-2xl font-bold px-3 hover:text-climate-blue"
        >
          ...
        </span>
        {openDropdown && (
          <ul className="mt-3 absolute font-dinpro text-climate-black-title bg-climate-action-light rounded shadow-lg">
            <li>
              <Button
                onClick={() => handleTabs()}
                className="w-full cursor-pointer p-3 rounded border-b-2 hover:text-climate-blue hover:bg-climate-border"
                disabled={disabled}
              >
                List NFT
              </Button>
            </li>
            <li className="cursor-pointer text-climate-informative-yellow p-3 rounded border-b-2 hover:text-climate-blue hover:bg-climate-border">
              Delist NFT
            </li>
            <li
              className="cursor-pointer p-3 rounded text-red-400 hover:text-climate-blue hover:bg-climate-border"
              onClick={() => setIsOpen(true)}
            >
              Delete NFT
            </li>
          </ul>
        )}
        {isOpen && (
          <Dialog
            closeButton
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Delete Asset"
            subtitle=""
            claim="Are you sure you want to delete this asset?"
          >
            {openSpinner ? (
              <div className="flex justify-center mt-3">
                <Spinner size="lg" />
              </div>
            ) : (
              <>
                <Button className="mr-4" onClick={handleDelete}>
                  Confirm
                </Button>
                <Button onClick={() => setIsOpen(false)}>Cancel</Button>
              </>
            )}
          </Dialog>
        )}
        {showSellingOptions && (
          <Dialog
            closeButton
            isOpen={showSellingOptions}
            setIsOpen={setShowSellingOptions}
            title="List NFT for sale"
            subtitle=""
            claim=""
          >
            <Tabs
              status={status}
              assetId={assetId}
              causePercentage={causePercentage}
              creatorWallet={creatorWallet}
              nft={nft}
              setIsOpen={setShowSellingOptions}
            />
          </Dialog>
        )}
      </div>
    </div>
  );
}
