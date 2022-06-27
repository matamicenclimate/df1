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
import { Nft } from '@common/src/lib/api/entities';
import { Cause, CausePostBody } from '@/lib/api/causes';
import { useNFTPurchasingActions } from '../lib/detail';
import { BuyAndBidButtons } from '../components/NftDetailSub';

const getDateObj = (mintingDate: any) => {
  const date = new Date(mintingDate);
  const day = date.getDate();
  const monthName = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `Minted on ${day} ${monthName} ${year}`;
};

const net = Container.get(NetworkClient);

const getAppId = async (id: string) => {
  const res = await retrying(net.core.get('asset/:id', { params: { id } }), 10);
  const nft = res.data.value;
  const appId = res.data.value.arc69.properties.app_id;
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

let sideTimer: NodeJS.Timeout | null = null;
export const NftDetail = () => {
  const { t } = useTranslation();
  const { causes } = useCauseContext();
  const { ipnft: assetId } = useParams() as { ipnft: string };
  const [nft, setNft] = useOptionalState<CurrentNFTInfo>();
  const [error, setError, resetError] = useOptionalState<unknown>();
  const { wallet, walletAccount } = useWalletContext();

  const now = Date.now() / 1000;

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

  const getCause = (causes: Cause[] | undefined, nft: Nft) => {
    const cause: Cause | undefined = causes?.find(
      (cause: Cause) => cause.id === nft?.arc69?.properties?.cause
    );
    return cause as CausePostBody;
  };

  return (
    <MainLayout>
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
                      {detail.nft.arc69.description}
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
                        title={getCause(causes, detail.nft)?.title}
                        imageUrl={getCause(causes, detail.nft)?.imageUrl}
                        description={getCause(causes, detail.nft)?.description}
                        wallet={getCause(causes, detail.nft)?.wallet}
                      />
                    </div>
                  </div>
                  <div className="image w-[650px] h-[580px]">
                    <div className="py-14 flex justify-between font-dinpro">
                      <h4 className="font-normal text-2xl">
                        {t('NFTDetail.Overview.nftResources')}
                      </h4>
                      <p className="self-center font-normal text-climate-gray-light text-lg">
                        {getDateObj(detail.nft.arc69.properties.date)}
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
              <div className="rounded-xl p-5 h-[690px] w-[370px] bg-white shadow-[3px_-5px_40px_0px_rgba(205, 205, 212, 0.3)]">
                <div className="image w-[330px] h-[345px]">
                  <NftDetailPreview nft={nft} />
                </div>
                <div className="p-3">
                  <div className="cardText">
                    <div className="bg-white">
                      <div className="font-sanspro font-semibold text-climate-green flex items-baseline">
                        <span className="h-2 w-2 bg-climate-green rounded-full inline-block mr-1 self-center"></span>
                        <p className="whitespace-nowrap overflow-hidden truncate text-ellipsis">
                          {getCause(causes, detail.nft)?.title}
                        </p>
                      </div>
                      <h4 className="py-2 text-4xl font-dinpro font-normal uppercase truncate text-ellipsis ">
                        {detail.nft.title}
                      </h4>
                      <div className="font-sanspro text-climate-gray-artist text-sm truncate text-ellipsis">
                        @{detail.nft.arc69.properties.artist}
                      </div>
                    </div>
                  </div>
                  <BuyAndBidButtons nft={detail.nft} state={detail} actions={nftActions} />
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
