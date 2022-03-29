import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { Card } from '@/componentes/Elements/Card/Card';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { httpClient } from '@/lib/httpClient';
import { NFTListed } from '@/lib/api/nfts';
import { useMemo } from 'react';

const fetchNfts = async () => {
  const res = await httpClient.get('nfts');
  return res.data;
};

export const Landing = () => {
  const { data, isLoading, error } = useQuery<NFTListed[]>('nfts', fetchNfts);
  if (error) return <div>{`An error occurred ${error}`}</div>;

  const checkIfVideo = (imageUrl: string) => {
    if (imageUrl.endsWith('.mp4')) {
      const spitString = imageUrl.split('/');
      spitString[2] = 'ipfs.io';

      return spitString.join('/');
    }
    return imageUrl;
  };

  const newDataTrial: NFTListed[] | undefined = useMemo(() => {
    return data?.map((nft) => ({ ...nft, image_url: checkIfVideo(nft.image_url) }));
  }, [data]);

  return (
    <MainLayout>
      <div className="flex justify-center">
        <div className="p-4">
          {isLoading ? (
            <Spinner size="lg" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
              {newDataTrial &&
                newDataTrial?.map((nft: NFTListed, i: number) => (
                  <Link key={i} to={`/nft/${nft.ipnft}`}>
                    <Card key={i} nft={nft} />
                  </Link>
                ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
