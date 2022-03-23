import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { Card } from '@/componentes/Elements/Card/Card';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { httpClient } from '@/lib/httpClient';
import { NFTListed } from '@/lib/api/nfts';

const fetchNfts = async () => {
  const res = await httpClient.get('nfts');
  return res.data;
};

export const Landing = () => {
  const { data, isLoading, error } = useQuery<NFTListed[]>('nfts', fetchNfts, {
    refetchOnMount: false,
  });
  if (error) return <div>{`An error occurred ${error}`}</div>;

  console.log('data', data);

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
                    <Link key={i} to={`/nft/${nft.ipnft}`}>
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
