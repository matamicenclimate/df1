import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { Card } from '@/componentes/Elements/Card/Card';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';

export type NftType = {
  title?: string;
  description?: string;
  image?: string;
  artist?: string;
};

const fetchNfts = async () => {
  const response = await fetch('https://climate-nft-marketplace-api.staging.dekaside.com/api/v1/nfts');
  const result = await response.json();
  return result;
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
