import { Button } from '@/componentes/Elements/Button/Button';
import NetworkClient from '@common/src/services/NetworkClient';
import axios from 'axios';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import Container from 'typedi';

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
  const color = colors[status];

  async function handleListing() {
    const body = {
      assetId,
      causePercentage,
      creatorWallet,
    };
    console.log('body', body);
    // const res = await net.core.post('direct-listing', body);
    // console.log('res.data', res.data);
    // return res.data;
  }
  return (
    <div className={clsx('flex justify-between items-center', className)}>
      <div
        className={clsx('p-1 pl-4 pr-4 rounded-md bg-opacity-10', `bg-${color}`, `text-${color}`)}
      >
        {text[status] ?? status}
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
            <li className="cursor-pointer p-3 rounded text-red-400 hover:text-climate-blue hover:bg-climate-border">
              Delete NFT
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
