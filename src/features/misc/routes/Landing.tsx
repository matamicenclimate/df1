import { useQuery } from 'react-query';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { Card } from '@/componentes/Elements/Card/Card';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { httpClient } from '@/lib/httpClient';
import { Nft } from '@/lib/api/nfts';
import useWallet from '@/hooks/useWallet';

const fetchNfts = async () => {
  const res = await httpClient.get('nfts');
  return res.data;
};

function MinTerm() {
  const [wallet] = useWallet();
  if (wallet.isDefined()) {
    return <h2>El wallo = {wallet.value}</h2>;
  } else {
    return <h2>No wallo</h2>;
  }
}

export const Landing = () => {
  const [wallet, setWallet] = useWallet();
  const { data, isLoading, error } = useQuery<Nft[]>('nfts', fetchNfts);

  if (wallet.isDefined() && wallet.value == null) {
    return <div>This should not be happening</div>;
  }

  if (isLoading) return <Spinner />;
  if (error) return <div>{`An error occurred ${error}`}</div>;

  return (
    <MainLayout>
      <MinTerm />
      <h1>wallet = {wallet.map((w) => w.accounts[0]).getOrElse('UNKNOWN')}</h1>
      <button onClick={() => wallet.forEach((w) => setWallet(w))}>Button</button>
      <div className="flex justify-center">
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {data && data.map((nft, i) => <Card key={i} nft={nft} />)}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
