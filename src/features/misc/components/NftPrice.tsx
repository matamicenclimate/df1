export interface NftPriceProps {
  price: number;
  type: 'auction' | 'direct';
}

export default function NftPrice({ type, price }: NftPriceProps) {
  return (
    <div className="flex flex-col">
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
