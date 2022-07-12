import { useCauseContext } from '@/context/CauseContext';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { none, option, some } from '@octantis/option';
import Container from 'typedi';
import '@common/src/lib/binary/extension';
import { useWalletContext } from '@/context/WalletContext';
import { CauseDetail } from '@/componentes/CauseDetail/CauseDetail';
import Fold from '@/componentes/Generic/Fold';
import { TransactionOperation } from '@common/src/services/TransactionOperation';
import { AuctionAppState } from '@common/src/lib/types';
import useOptionalState from '@/hooks/useOptionalState';
import CurrentNFTInfo from '../state/CurrentNFTInfo';
import NftDetailPreview from '../components/NftDetailPreview';
import { useTranslation } from 'react-i18next';
import NetworkClient from '@common/src/services/NetworkClient';
import { retrying } from '@common/src/lib/net';
import { AssetEntity } from '@common/src/lib/api/entities';
import { Cause, CausePostBody } from '@/lib/api/causes';
import { useNFTPurchasingActions } from '../lib/detail';
import { BuyAndBidButtons } from '../components/NftDetailSub';

const getDateObj = (mintingDate: string | number) => {
  const date = new Date(mintingDate);
  const day = date.getDate();
  const monthName = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `Minted on ${day} ${monthName} ${year}`;
};

const net = Container.get(NetworkClient);

const getAppId = async (id: string) => {
  const res = await retrying(net.core.get('listing/:id', { params: { id } }), 10);
  const nft = res.data;
  console.log('nft getappId', nft);

  const appId = res.data.applicationIdBlockchain;
  return [nft, appId] as const;
};

async function tryGetNFTData(
  id: string,
  current: option<CurrentNFTInfo>,
  setNft: (nft: CurrentNFTInfo) => void,
  setError: (err: unknown) => void
) {
  let info = current.flatMap((s) => s.info);
  let state: CurrentNFTInfo['state'] = none();
  try {
    const [nft, appId] = await getAppId(id);
    if (appId != null) {
      const req = await TransactionOperation.do.getApplicationState<AuctionAppState>(appId);
      state = some(req);
    }
    if (!info.isDefined()) {
      const res = await Container.get(NetworkClient).core.get('asset-info/:id', { params: { id } });
      info = some(res.data);
    }
    setNft({ info, state, nft });
  } catch (err) {
    setError(err);
  }
}

export const getCause = (causes: Cause[] | undefined, nft: AssetEntity) => {
  const cause: Cause | undefined = causes?.find(
    (cause: Cause) => cause.id === nft?.arc69?.properties?.cause
  );
  return cause as CausePostBody;
};

let sideTimer: NodeJS.Timeout | null = null;
export const NftDetail = () => {
  const { t } = useTranslation();
  const { causes } = useCauseContext();
  const { ipnft: assetId } = useParams() as { ipnft: string };
  const [nft, setNft] = useOptionalState<CurrentNFTInfo>();
  const [error, setError] = useOptionalState<unknown>();
  const { wallet } = useWalletContext();

  function updateNFTInfo() {
    return tryGetNFTData(assetId, nft, setNft, setError);
  }
  useEffect(() => {
    updateNFTInfo();
  }, []);

  useEffect(() => {
    for (const data of nft) {
      if (!data.state.isDefined()) {
        if (sideTimer != null) {
          clearTimeout(sideTimer);
        }
        sideTimer = setTimeout(() => {
          updateNFTInfo();
        }, 1 * 60 * 1000);
      }
    }
  }, [nft]);

  const nftActions = useNFTPurchasingActions(assetId, wallet, nft, updateNFTInfo);

  return (
    <MainLayout nft={nft}>
      <Fold
        option={error}
        as={(e) => <div className="text-red-600 flex justify-center">Error: {`${e}`}</div>}
      />
      <Fold
        option={nft}
        as={(detail) => (
          <div className="grid grid-cols-3 gap-4">
            <div className="left col-span-2 flex justify-center">
              <div className="w-[670px]">
                <div>
                  <div className="py-14">
                    <h4 className="font-dinpro font-normal text-2xl">
                      {t('NFTDetail.Overview.nftDescription')}
                    </h4>
                  </div>
                  <div>
                    <p className="font-sanspro font-normal text-sm ">
                      {detail.nft.asset.arc69.description}
                    </p>
                  </div>
                  <div>
                    <div className="py-14">
                      <h4 className="font-dinpro font-normal text-2xl">
                        {t('NFTDetail.Overview.nftCause')}
                      </h4>
                    </div>
                    <div className="w-[650px]">
                      <CauseDetail
                        title={getCause(causes, detail.nft.asset)?.title}
                        imageUrl={getCause(causes, detail.nft.asset)?.imageUrl}
                        description={getCause(causes, detail.nft.asset)?.description}
                        wallet={getCause(causes, detail.nft.asset)?.wallet}
                      />
                    </div>
                  </div>
                  <div className="image w-[650px] h-[580px]">
                    <div className="py-14 flex justify-between font-dinpro">
                      <h4 className="font-normal text-2xl">
                        {t('NFTDetail.Overview.nftResources')}
                      </h4>
                      <p className="self-center font-normal text-climate-gray-light text-lg">
                        {getDateObj(detail.nft.asset.arc69.properties.date)}
                      </p>
                    </div>
                    <div className="w-full min-h-[580px] max-h-[580px] object-cover mr-8 rounded-lg">
                      <NftDetailPreview nft={nft} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="right-4 col-span-1">
              <div className="absolute bottom-[200px] rounded-xl p-5 h-[477px] w-[312px] bg-white shadow-[3px_-5px_40px_0px_rgba(205, 205, 212, 0.3)]">
                <div className="image w-[280px] h-[235px] rounded-lg">
                  <NftDetailPreview nft={nft} />
                </div>
                <div className="p-3">
                  <div className="cardText ">
                    <div className="bg-white">
                      <div className="flex justify-between">
                        <span className="text-base text-climate-light-gray">NFT Price</span>
                        <p> TODO: fetch price</p>
                      </div>
                      <div className="flex justify-between mt-4">
                        <span className="text-base text-climate-light-gray">Token price</span>
                        <p> TODO: what???</p>
                      </div>
                      <div className="font-sanspro font-semibold flex justify-between items-baseline text-climate-light-gray mb-2">
                        <div className="flex items-center mt-4">
                          <span className="font-normal text-xs">Cause percentage</span>
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </div>
                        <p className="whitespace-nowrap overflow-hidden truncate text-ellipsis">
                          {detail.nft.asset.arc69.properties.causePercentage} %
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-12">
                    <BuyAndBidButtons nft={detail.nft.asset} state={detail} actions={nftActions} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      >
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      </Fold>
    </MainLayout>
  );
};
