import { NftType } from '../../../features/misc/routes/Landing';
import { Spinner } from '../Spinner/Spinner';

const defaultImage = 'https://www.newsbtc.com/wp-content/uploads/2021/10/nft.jpg';

type CardProps = {
  item: NftType;
};

export const Card = ({ item }: CardProps) => {
  const imageOnLoadHandler = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log(`The image with url of ${event.currentTarget.src} has been loaded`);
    if (event.currentTarget.className !== 'error') {
      event.currentTarget.className = 'success';
    }
  };

  return (
    <div className="border shadow-md rounded-xl overflow-hidden">
      <img
        onLoad={imageOnLoadHandler}
        onError={({ currentTarget }) => {
          console.log('currentTarget', currentTarget);

          currentTarget.onerror = null; // prevents looping
          currentTarget.src = defaultImage;
        }}
        src={item.image}
        className="w-80 rounded"
      />
      <div className="p-4 bg-black">
        <p className="text-xl font-bold text-white">{item.title}</p>
        <p className="text-sm font-bold text-white">{item.artist}</p>
      </div>
    </div>
  );
};
