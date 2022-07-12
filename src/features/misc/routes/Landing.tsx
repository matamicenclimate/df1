import { MainLayout } from '@/componentes/Layout/MainLayout';
import { useEffect, useState } from 'react';
import { retrying } from '@common/src/lib/net';
import Container from 'typedi';
import NetworkClient from '@common/src/services/NetworkClient';
import { Listing } from '@common/src/lib/api/entities';
import { useCauseContext } from '@/context/CauseContext';
import CardSlider from '@/componentes/Layout/CardSlider';
import Sidebar from '@/componentes/Sidebar/Sidebar';

const net = Container.get(NetworkClient);

export const Landing = () => {
  const [list, setList] = useState<Listing[]>([]);
  const { causes } = useCauseContext();

  async function fetchAssets() {
    const res = await retrying(net.core.get('assets'));
    console.log('Current assets manifest:', res.data.assets);
    setList(res.data.assets);
  }

  useEffect(() => {
    fetchAssets();
  }, []);

  return (
    <MainLayout>
      <div className="flex">
        <Sidebar />
        <div className="w-[70%] p-4">{causes && <CardSlider nftList={list} causes={causes} />}</div>
      </div>
    </MainLayout>
  );
};
