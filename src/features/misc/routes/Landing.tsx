import { Link } from 'react-router-dom';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { Card } from '@/componentes/Elements/Card/Card';
import { useEffect, useState } from 'react';
import { Case, Match } from '@/componentes/Generic/Match';
import { retrying } from '@common/src/lib/net';
import Container from 'typedi';
import NetworkClient from '@common/src/services/NetworkClient';
import { useTranslation } from 'react-i18next';
import { Listing } from '@common/src/lib/api/entities';
import { useCauseContext } from '@/context/CauseContext';

const net = Container.get(NetworkClient);

type State = Listing[];
type Update = React.Dispatch<React.SetStateAction<Listing[]>>;

const sidebarOptions = ['Price', 'Cause', 'Artist', 'Auction type', 'SGDs'];

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
        <div className="w-[330px] h-screen px-9">
          <ul className="font-normal text-climate-light-gray">
            {sidebarOptions.map((option) => (
              <li key={option} className="mt-4 flex justify-between items-center">
                <p>{option}</p>
                <span className="cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4">
          <Match>
            <Case of="default">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
                {list.length === 0 ? (
                  <div>{t('misc.Landing.no-nft-message')}</div>
                ) : (
                  list.map((asset) => {
                    const id = asset.assetIdBlockchain;
                    return (
                      <Link key={`link-of-${id}`} to={`/nft/${id}`}>
                        <Card nft={asset.asset} />
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
