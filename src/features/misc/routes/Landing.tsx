import { MainLayout } from '@/componentes/Layout/MainLayout';
import { useEffect, useState } from 'react';
import { retrying } from '@common/src/lib/net';
import Container from 'typedi';
import NetworkClient from '@common/src/services/NetworkClient';
import { Listing } from '@common/src/lib/api/entities';
import { useCauseContext } from '@/context/CauseContext';
import CauseSlider from '@/componentes/Layout/CauseSlider';
import Sidebar from '@/componentes/Sidebar/Sidebar';

const net = Container.get(NetworkClient);

type State = Listing[];
type Update = React.Dispatch<React.SetStateAction<Listing[]>>;

async function tryGetManifest(setList: Update) {
  const res = await retrying(net.core.get('assets'));
  console.log('Current asset manifest:', res.data.assets);
  setList(res.data.assets);
}

export const Landing = () => {
  const [list, setList] = useState<State>([]);
  const { causes } = useCauseContext();

  useEffect(() => {
    tryGetManifest(setList);
  }, []);

  return (
    <MainLayout>
      <div className="flex">
        <Sidebar />
        <div className="w-[70%] p-4">
          {causes && <CauseSlider nftList={list} causes={causes} />}
        </div>
      </div>
    </MainLayout>
  );
};
