import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { Card } from '@/componentes/Elements/Card/Card';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { httpClient } from '@/lib/httpClient';

export type NftType = {
  title?: string;
  description?: string;
  image?: string;
  artist?: string;
};

const fetchNfts = async () => {
  const res = await httpClient.get('nfts');
  return res.data;
};

export const Landing = () => {
  const { data, isLoading, error } = useQuery<NftType[]>('nfts', fetchNfts);

  if (isLoading) return <Spinner />;
  if (error) return <div>{`An error occurred ${error}`}</div>;

  return (
    <MainLayout>
      <div className="flex justify-center">
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {data && data.map((nft, i) => <Card key={i} item={nft} />)}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
