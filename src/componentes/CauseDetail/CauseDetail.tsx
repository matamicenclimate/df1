import { useEffect, useState } from 'react';
import { useCauseContext } from '@/context/CauseContext';
import { Cause } from '@/lib/api/causes';

type CauseDetailProps = { nftDetailCause: string | undefined };

export const CauseDetail = ({ nftDetailCause }: CauseDetailProps) => {
  const [cause, setCause] = useState<Cause>();
  const { causes } = useCauseContext();

  const getCause = () => {
    const cause = causes?.find((cause) => cause.title === nftDetailCause);
    setCause(cause);
  };

  useEffect(() => {
    getCause();
  }, [nftDetailCause]);

  return (
    <div>
      {cause && (
        <div className="flex box-border border-solid border border-climate-border p-5 rounded-xl">
          <img className="w-11 h-11 rounded-lg" src={cause?.imageUrl} alt="causeLogo" />
          <div className="flex flex-col font-sanspro">
            <p className="pl-5 text-base text-climate-black-text">{cause?.title}</p>
            <p className="pl-5 text-sm text-climate-gray-artist">{cause?.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};
