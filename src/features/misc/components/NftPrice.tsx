import clsx from 'clsx';
import algoLogo from '@/assets/algoLogo.svg';

export interface NftPriceProps {
  price: number;
  type: 'auction' | 'direct';
  className?: string;
}

export default function NftPrice({ className, type, price }: NftPriceProps) {
  return (
    <div className={clsx('flex flex-col', className)}>
      <div className="flex justify-between">
        <div className="text-climate-gray-artist mr-4">
          {type === 'auction' ? 'Auction' : 'Direct buy'}
        </div>
        <div className="text-climate-blue font-bold flex ml-4 align-middle items-center">
          {price} <img className="w-3 h-3 ml-1" src={algoLogo} alt="algoLogo" />
        </div>
      </div>
      <hr />
    </div>
  );
}
