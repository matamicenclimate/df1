import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { Card } from '@/componentes/Elements/Card/Card';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { httpClient, httpClientMockNfts } from '@/lib/httpClient';
import { Nft } from '@/lib/api/nfts';

const fetchNfts = async () => {
  const res = await httpClient.get('nfts');
  return res.data;
};

const mockNftsFetch = async () => {
  const res = await httpClientMockNfts.get('/api/v1/nfts.json');
  return res.data;
};

export const Landing = () => {
  // const { data, isLoading, error } = useQuery<Nft[]>('nfts', fetchNfts);
  const { data, isLoading, error } = useQuery<Nft[]>('nfts', mockNftsFetch, {
    refetchOnMount: false,
  });
  if (error) return <div>{`An error occurred ${error}`}</div>;

  return (
    <MainLayout>
      <div className="flex justify-center">
        <div className="p-4">
          <div>
            {isLoading ? (
              <Spinner size="lg" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {data &&
                  data.map((nft, i) => (
                    <Link key={i} to={`/nft/${nft.id}`}>
                      <Card key={i} nft={nft} />
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
