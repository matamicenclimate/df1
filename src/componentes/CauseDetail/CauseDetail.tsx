import { CausePostBody } from '@/lib/api/causes';
import climateLogo from '../../assets/climateLogo.png';

export const CauseDetail = ({ imageUrl, title, description, wallet }: CausePostBody) => {
  return (
    <div>
      <div className="flex box-border border-solid border border-climate-border p-5 rounded-xl">
        <img
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = climateLogo;
          }}
          src={imageUrl}
          alt={imageUrl}
          className="w-10 object-contain rounded-lg shadow-md"
        />
        <div className="flex flex-col font-sanspro">
          <p className="pl-5 text-base text-climate-black-text">{title}</p>
          <p className="pl-5 text-sm text-climate-gray-artist">{description}</p>
          <p className="pl-5 text-sm text-climate-gray-artist">
            {wallet?.slice(0, 8)}...{wallet?.slice(-8)}
          </p>
        </div>
      </div>
    </div>
  );
};
