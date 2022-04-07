import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { Card } from '@/componentes/Elements/Card/Card';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { NFTListed } from '@/lib/api/nfts';
import { useMemo } from 'react';
import { Case, Match } from '@/componentes/Generic/Match';
import { fetchNfts } from '@/lib/NFTFetching';
import { isVideo } from '@/lib/media';

export const Landing = () => {
  const { data, isLoading, error } = useQuery('nfts', fetchNfts);
  const dataMemo: NFTListed[] | undefined = useMemo(() => {
    return data?.map((nft) => ({ ...nft, image_url: isVideo(nft.image_url) }));
  }, [data]);

  return (
    <MainLayout>
      <div className="flex justify-center">
        <div className="p-4">
          <h2 className="font-normal font-dinpro text-4xl">NFTs marketplace</h2>
          <Match>
            <Case of={error}>
              <div style={{ fontSize: '4rem', color: 'red' }}>An error occurred: {error}</div>
            </Case>
            <Case of={isLoading}>
              <Spinner size="lg" />
            </Case>
            <Case of="default">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
                {dataMemo &&
                  dataMemo?.map((nft: NFTListed, i: number) => (
                    <Link key={`link-of-${nft.id}`} to={`/nft/${nft.id}`}>
                      <Card key={`card-of-${nft.id}`} nft={nft} />
                    </Link>
                  ))}
              </div>
            </Case>
          </Match>
        </div>
      </div>
    </MainLayout>
  );
};
