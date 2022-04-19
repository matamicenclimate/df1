import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { isVideo } from '@/lib/media';
import { option } from '@octantis/option';
import CurrentNFTInfo from '../state/CurrentNFTInfo';

function mapToDisplay(detail: CurrentNFTInfo) {
  if (detail.nft.image_url.endsWith('.mp4')) {
    return (
      <div className="w-full object-cover rounded-lg min-h-[325px] max-h-[325px] mr-8">
        <video className="min-h-[325px] max-h-[325px]" autoPlay loop muted>
          <source src={isVideo(detail.nft.image_url)} type="video/mp4" />
        </video>
      </div>
    );
  }
  return (
    <img
      className="w-full h-full object-contain rounded-xl"
      src={detail.nft.image_url}
      alt={detail.nft.image_url}
    />
  );
}

export interface NftDetailPreviewProps {
  nft: option<CurrentNFTInfo>;
  className?: string;
}

/**
 * A simple component that maps an optional NFT state to
 * a thumbnail depending on the underlying type of asset.
 */
export default function NftDetailPreview({ nft, className }: NftDetailPreviewProps) {
  return nft.fold(<Spinner />, mapToDisplay);
}
