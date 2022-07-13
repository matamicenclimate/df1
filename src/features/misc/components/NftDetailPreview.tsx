import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { isVideo } from '@/lib/media';
import { option } from '@octantis/option';
import CurrentNFTInfo from '../state/CurrentNFTInfo';

function mapToDisplay(detail: CurrentNFTInfo) {
  if (detail.nft.asset.imageUrl.endsWith('.mp4')) {
    return (
      <div className="w-full object-cover rounded-lg min-h-[325px] max-h-[325px] mr-8">
        <video className="min-h-[325px] max-h-[325px]" autoPlay loop muted>
          <source src={isVideo(detail.nft.asset.imageUrl)} type="video/mp4" />
        </video>
      </div>
    );
  }
  return (
    <img
      className="w-full h-full object-contain rounded-xl"
      src={detail.nft.asset.imageUrl}
      alt={detail.nft.asset.imageUrl}
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
