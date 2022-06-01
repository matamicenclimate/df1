import NetworkClient from '@common/src/services/NetworkClient';
import { AuctionLogic } from '@common/src/services/AuctionLogic';

import clsx from 'clsx';
import { useState } from 'react';
import Container from 'typedi';
import { destroyAsset } from '../../../lib/nft';
import { useWalletContext } from '@/context/WalletContext';
import { client } from '@/lib/algorand';
import { Wallet } from 'algorand-session-wallet';
import { Dialog } from '@/componentes/Dialog/Dialog';
import { Button } from '@/componentes/Elements/Button/Button';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';

export interface NftStatusProps {
  status: 'selling' | 'bidding' | 'sold' | 'locked' | 'pending';
  onEdit?: () => void;
  onDuplicate?: () => void;
  onSend?: () => void;
  onDelete?: () => void;
  className?: string;
  assetId: number;
  causePercentage: number;
  creatorWallet: string;
}

const colors = {
  bidding: 'climate-informative-green',
  sold: 'climate-informative-yellow',
} as ByStatus;

const text = {
  bidding: 'Pending',
  sold: 'Sold',
} as ByStatus;

type ByStatus = { [D in NftStatusProps['status']]: string };

const net = Container.get(NetworkClient);

export default function NftStatus({
  status,
  className,
  assetId,
  causePercentage,
  creatorWallet,
}: NftStatusProps) {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openSpinner, setOpenSpinner] = useState<boolean>(false);
  const { wallet } = useWalletContext();
  const algodClient = client();
  const color = colors[status];

  async function handleListing() {
    setOpenDropdown(false);
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
    const res = await net.core.post('direct-listing', body);
    console.log('res.data', res.data);
    return res.data;
  }

  const refreshPage = () => {
    window.location.reload();
  };

  // async function confirmedDelete() {
  async function handleDelete() {
    setOpenDropdown(false);
    setOpenSpinner(true);
    await destroyAsset(algodClient, creatorWallet, assetId, wallet as Wallet);
    refreshPage();
  }

  return (
    <div className={clsx('flex justify-between items-center', className)}>
      <div
        className={clsx('p-1 pl-4 pr-4 rounded-md bg-opacity-10', `bg-${color}`, `text-${color}`)}
      >
        {/* {text[status] ?? status} */}
      </div>
      <div>
        <span
          onClick={() => setOpenDropdown(!openDropdown)}
          className="cursor-pointer text-2xl font-bold px-3 hover:text-climate-blue"
        >
          ...
        </span>
        {openDropdown && (
          <ul className="mt-3 absolute font-dinpro text-climate-black-title bg-climate-action-light rounded shadow-lg">
            <li
              className="cursor-pointer p-3 rounded border-b-2 hover:text-climate-blue hover:bg-climate-border "
              onClick={() => handleListing()}
            >
              Sell NFT
            </li>
            <li className="cursor-pointer p-3 rounded border-b-2 hover:text-climate-blue hover:bg-climate-border">
              Start Auction
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
      </div>
    </div>
  );
}
