import { Link } from 'react-router-dom';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { Card } from '@/componentes/Elements/Card/Card';
import { NFTListed } from '@/lib/api/nfts';
import { useContext, useEffect, useState } from 'react';
import { Case, Match } from '@/componentes/Generic/Match';
import { retrying } from '@common/src/lib/net';
import Container from 'typedi';
import NetworkClient from '@common/src/services/NetworkClient';
import { Asset } from '@common/src/lib/api/entities';
import { TransactionOperation } from '@common/src/services/TransactionOperation';
import { AuctionAppState } from '@common/src/lib/types';
import { useTranslation } from 'react-i18next';

const net = Container.get(NetworkClient);

type State = (NFTListed | Asset)[];
type Update = React.Dispatch<React.SetStateAction<(Asset | NFTListed)[]>>;

async function tryGetManifest(setList: Update) {
  const res = await retrying(net.core.get('assets'), 10);
  console.log('???', res.data.assets);
  setList(res.data.assets);
}

function isAsset(asset: State[number]): asset is Asset {
  return (asset as Asset)['asset-id'] != null;
}

function getId(asset: State[number]) {
  if (isAsset(asset)) {
    return asset['asset-id'];
  }
  return asset.id;
}

async function tryUpdateOne(list: State, setList: Update) {
  const found = list.findIndex((a) => isAsset(a));
  if (found !== -1) {
    const asset = list[found] as Asset;
    const clone = [...list];
    const data = await retrying(
      net.core.get('asset/:id', { params: { id: asset['asset-id'].toString() } }),
      10
    );
    const id = data.data.value.arc69.properties.app_id;
    if (id == null) {
      console.info(`Asset ${data.data.value.id} has no app ID, skipping...`);
      clone.splice(found, 1);
      return setList(clone);
    }
    try {
      await TransactionOperation.do.getApplicationState<AuctionAppState>(id);
    } catch {
      console.info(`Asset ${data.data.value.id} did error, skipping...`);
      clone.splice(found, 1);
      return setList(clone);
    }
    clone[found] = data.data.value;
    setList(clone);
  }
}

export const Landing = () => {
  const { t } = useTranslation();
  const [list, setList] = useState<State>([]);

  useEffect(() => {
    tryGetManifest(setList);
  }, []);

  useEffect(() => {
    tryUpdateOne(list, setList);
  }, [list]);

  return (
    <MainLayout>
      <div className="flex justify-center">
        <div className="p-4">
          <h2 className="font-normal font-dinpro text-4xl">NFTs marketplace</h2>
          <Match>
            {/* <Case of={error}>
              <div className="text-xl text-red-600">An error occurred: {`${error}`}</div>
            </Case>
            <Case of={isLoading}>
              <div className="flex justify-center pt-6">
                <Spinner size="lg" />
              </div>
            </Case> */}
            <Case of="default">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
                {/* {dataMemo &&
                  dataMemo?.map((nft: NFTListed) => (
                    <Link key={`link-of-${nft.id}`} to={`/nft/${nft.id}`}>
                      <Card loading key={`card-of-${nft.id}`} nft={nft} />
                    </Link>
                  ))} */}
                {list.length === 0 ? (
                  <div>{t('misc.Landing.no-nft-message')}</div>
                ) : (
                  list.map((asset) => {
                    const id = getId(asset);
                    if (isAsset(asset)) {
                      return <Card key={`link-of-${id}`} loading />;
                    }
                    return (
                      <Link key={`link-of-${id}`} to={`/nft/${id}`}>
                        <Card nft={asset} />
                      </Link>
                    );
                  })
                )}
              </div>
            </Case>
          </Match>
        </div>
      </div>
    </MainLayout>
  );
};
