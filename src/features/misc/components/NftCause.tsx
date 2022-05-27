import { useCauseContext } from '@/context/CauseContext';
import { Cause } from '@/lib/api/causes';
import climateLogo from '../../../assets/climateLogo.png';

export interface NftCauseProps {
  id: string;
  className?: string;
}

export default function NftCause({ className, id }: NftCauseProps) {
  const { causes } = useCauseContext();
  const cause = causes?.find((cause: Cause) => cause.id === id);
  const imgCause = cause?.imageUrl;

  return (
    <div className={className}>
      {imgCause && (
        <img
          className="w-10 h-10"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = climateLogo;
          }}
          src={imgCause}
          alt={imgCause}
        />
      )}
    </div>
  );
}
