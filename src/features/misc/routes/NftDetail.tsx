import { Button } from '@/componentes/Elements/Button/Button';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { Nft } from '@/lib/api/nfts';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import algoLogo from '../../../assets/algoLogo.svg';

export const NftDetail = () => {
  const { id } = useParams();
  const paramId = Number(id);
  const [data, setData] = useState<Nft[]>();

  useEffect(() => {
    mockFetch();
  }, [paramId]);

  const mockFetch = () => {
    axios
      .get(`http://127.0.0.1:8080/api/v1/nfts.json/`)
      .then((res) => {
        setData(res.data);
        console.log('res.data', res.data);
      })
      .catch((err) => console.log(err));
  };

  const nftSelected = data?.find((nft) => nft.id === paramId);

  return (
    <MainLayout>
      <div className="w-[45rem] m-auto">
        <div className="flex justify-around">
          <img
            className="w-96 object-contain rounded-lg"
            src={nftSelected?.image}
            alt={nftSelected?.image}
          />
          <div className="flex flex-col justify-around">
            <h2 className="text-2xl">
              <strong>{nftSelected?.title}</strong>
            </h2>
            <p>
              <strong>{nftSelected?.description}</strong>
            </p>
            <p>
              Creator: <strong>{nftSelected?.artist}</strong>{' '}
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <Button className="text-2xl flex text-black mt-6">
            <span>
              Buy for: <strong>{nftSelected?.price}</strong>{' '}
            </span>
            <img className="w-4 h-4 self-center" src={algoLogo} alt="algologo" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};
