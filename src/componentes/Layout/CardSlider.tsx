import { Cause } from '@/lib/api/causes';
import { Listing } from '@common/src/lib/api/entities';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ChevronLeft from '../Arrows/ChevronLeft';
import { Card } from '../Elements/Card/Card';

type CardSliderProps = {
  nftList: Listing[];
  causes: Cause[];
  nftListByCause?: any;
};

export type NftFilteredByIdType = {
  cause: string | undefined;
  arrayNft: Listing[];
};

const CardSlider = ({ nftList, causes }: CardSliderProps) => {
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
                <ChevronLeft />
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

export default CardSlider;
