import { useState } from 'react';
import FirstTab from './FirstTab';
import './mycssfile.css';
import SecondTab from './SecondTab';
import clsx from 'clsx';
import { Nft } from '@common/src/lib/api/entities';

type TabsProps = {
  status: string;
  assetId: number;
  causePercentage: number;
  creatorWallet: string;
  nft: Nft;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Tabs = ({ assetId, causePercentage, creatorWallet, nft, setIsOpen }: TabsProps) => {
  const [activeTab, setActiveTab] = useState('tab1');
  const handleTab1 = () => {
    setActiveTab('tab1');
  };
  const handleTab2 = () => {
    setActiveTab('tab2');
  };

  return (
    <div className="min-h-[300px] mt-4">
      <ul className="nav">
        <li
          className={clsx(
            activeTab === 'tab1' ? 'active' : '',
            'w-1/2 cursor-pointer text-center rounded-bl-3xl rounded-tl-3xl p-3'
          )}
          onClick={handleTab1}
        >
          Fixed Price
        </li>
        <li
          className={clsx(
            activeTab === 'tab2' ? 'active' : '',
            'w-1/2 cursor-pointer text-center rounded-br-3xl rounded-tr-3xl p-3'
          )}
          onClick={handleTab2}
        >
          Timed Auction
        </li>
      </ul>
      <div className="text-center">
        {activeTab === 'tab1' ? (
          <FirstTab
            nft={nft}
            assetId={assetId}
            causePercentage={causePercentage}
            creatorWallet={creatorWallet}
            setIsOpen={setIsOpen}
          />
        ) : (
          <SecondTab
            nft={nft}
            assetId={assetId}
            causePercentage={causePercentage}
            creatorWallet={creatorWallet}
            setIsOpen={setIsOpen}
          />
        )}
      </div>
    </div>
  );
};
export default Tabs;
