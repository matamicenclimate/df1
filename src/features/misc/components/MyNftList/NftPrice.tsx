import clsx from 'clsx';
import algoLogo from '@/assets/algoLogo.svg';
import { microalgosToAlgos } from '../../lib/minting';

export interface NftPriceProps {
  price: number;
  type?: 'auction' | 'direct';
  className?: string;
}

export default function NftPrice({ className, type, price }: NftPriceProps) {
  return (
    <div className={clsx('flex flex-col', className)}>
      <div className="flex justify-between">
        <div className="text-climate-blue font-bold flex align-middle items-center">
          {microalgosToAlgos(price)} <img className="w-3 h-3 ml-1" src={algoLogo} alt="algoLogo" />
        </div>
        {/* <div className="text-climate-gray-artist ml-4">
          {type === 'auction' ? 'Auction' : 'Direct buy'}
        </div> */}
      </div>
      <hr />
    </div>
  );
}
