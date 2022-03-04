import { Nft } from '@/lib/api/nfts';
// import { Spinner } from '../Spinner/Spinner';

const defaultImage = 'https://www.newsbtc.com/wp-content/uploads/2021/10/nft.jpg';

type CardProps = {
  nft: Nft;
};

export const Card = ({ nft }: CardProps) => {
  return (
    <div className="border shadow-md rounded-xl overflow-hidden">
      <img
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = defaultImage;
        }}
        src={nft.image}
        className="w-80 rounded"
      />
      <div className="p-4 bg-black">
        <p className="text-xl font-bold text-white">{nft.title}</p>
        <p className="text-sm font-bold text-white">{nft.artist}</p>
      </div>
    </div>
  );
};
