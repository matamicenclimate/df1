import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { Card } from '@/componentes/Elements/Card/Card';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { httpClient } from '@/lib/httpClient';
import { NFTListed } from '@/lib/api/nfts';
import { useMemo } from 'react';
import { getGlobalState } from './NftDetail';

async function asAppDataIfPossible(element: NFTListed) {
  const id = element.arc69.properties.app_id;
  // if (id == null) {
  //   return null;
  // }
  if (id != null) {
    const state = await getGlobalState(id);
    if (state.bid_amount != null) {
      element.arc69.properties.price = state.bid_amount;
    }
  }
  return element;
}

const fetchNfts = async () => {
  const list: NFTListed[] = [];
  const ofList = await httpClient.get('nfts').then(({ data }) => data);
  console.log('....>', ofList);
  for (const data of ofList) {
    const out = await asAppDataIfPossible(data);
    if (out == null) continue;
    list.push(out);
  }
  return list;
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
    console.log('DUMP NFT INFO:', data);
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
                  <Link key={`link-of-${nft.id}`} to={`/nft/${nft.id}`}>
                    <Card key={`card-of-${nft.id}`} nft={nft} />
                  </Link>
                ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
