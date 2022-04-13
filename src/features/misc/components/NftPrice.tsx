export interface NftPriceProps {
  price: number;
  type: 'auction' | 'direct';
}

export default function NftPrice({ type, price }: NftPriceProps) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <div>{type}</div>
        <div>{price}$</div>
      </div>
      <hr />
    </div>
  );
}
