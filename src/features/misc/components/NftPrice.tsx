import clsx from 'clsx';

export interface NftPriceProps {
  price: number;
  type: 'auction' | 'direct';
  className?: string;
}

export default function NftPrice({ className, type, price }: NftPriceProps) {
  return (
    <div className={clsx('flex flex-col', className)}>
      <div className="flex justify-between">
        <div className="text-climate-gray-artist">
          {type === 'auction' ? 'Auction' : 'Direct buy'}
        </div>
        <div className="text-climate-blue font-bold">{price}$</div>
      </div>
      <hr />
    </div>
  );
}
