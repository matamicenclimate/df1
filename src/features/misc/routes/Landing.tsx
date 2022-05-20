import { Link } from 'react-router-dom';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { Card } from '@/componentes/Elements/Card/Card';
import { useEffect, useState } from 'react';
import { Case, Match } from '@/componentes/Generic/Match';
import { retrying } from '@common/src/lib/net';
import Container from 'typedi';
import NetworkClient from '@common/src/services/NetworkClient';
import { RekeyAccountRecord } from '@common/src/lib/api/entities';
import { useTranslation } from 'react-i18next';

const net = Container.get(NetworkClient);

type State = RekeyAccountRecord[];
type Update = React.Dispatch<React.SetStateAction<RekeyAccountRecord[]>>;

async function tryGetManifest(setList: Update) {
  const res = await retrying(net.core.get('assets'));
  console.log('Current asset manifest:', res.data.assets);
  setList(res.data.assets);
}

export const Landing = () => {
  const { t } = useTranslation();
  const [list, setList] = useState<State>([]);

  useEffect(() => {
    tryGetManifest(setList);
  }, []);

  return (
    <MainLayout>
      <div className="flex justify-center">
        <div className="p-4">
          <h2 className="font-normal font-dinpro text-4xl">NFTs marketplace</h2>
          <Match>
            <Case of="default">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
                {list.length === 0 ? (
                  <div>{t('misc.Landing.no-nft-message')}</div>
                ) : (
                  list.map((asset) => {
                    const id = asset.assetId;
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
