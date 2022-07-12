import { Cause } from '@/lib/api/causes';
import { Listing } from '@common/src/lib/api/entities';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card } from '../Elements/Card/Card';

type CauseSliderProps = {
  nftList: Listing[];
  causes: Cause[];
};

type NftFilteredByIdType = {
  cause: string | undefined;
  arrayNft: Listing[];
};

const CauseSlider = ({ nftList, causes }: CauseSliderProps) => {
  const { t } = useTranslation();
  const [nftFilteredByCauseId, setNftFilteredByCauseId] = useState<
    Record<string, NftFilteredByIdType>
  >({});

  useMemo(() => {
    const result: Record<string, NftFilteredByIdType> = {};
    const causeById: Record<NonNullable<Cause['id']>, Cause> = {};

    for (const cause of causes) {
      if (cause.id == null) continue;
      causeById[cause.id] = cause;
    }

    for (const nft of nftList) {
      const cause = causeById[nft.asset.arc69.properties.cause] as Required<Cause>;
      if (cause == null) continue;

      if (cause.id in result) {
        result[cause.id].arrayNft.push(nft);
      } else {
        result[cause.id] = { cause: cause.title, arrayNft: [nft] };
      }
    }
    setNftFilteredByCauseId(result);
  }, [nftList]);

  return (
    <div>
      {Object.keys(nftFilteredByCauseId).length === 0 ? (
        <div>{t('misc.Landing.no-nft-message')}</div>
      ) : (
        Object.entries(nftFilteredByCauseId).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between mt-10">
              <h3 className="font-semibold text-2xl mb-5">{value.cause}</h3>
              <div className="flex font-normal text-base text-climate-light-gray">
                <p>{value.arrayNft?.length} NFTs</p>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div className="flex gap-5">
              {value.arrayNft.map((nft) => (
                <div key={nft.id}>
                  <Link
                    key={`link-of-${nft.assetIdBlockchain}`}
                    to={`/nft/${nft.assetIdBlockchain}`}
                  >
                    <Card nft={nft.asset} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CauseSlider;
