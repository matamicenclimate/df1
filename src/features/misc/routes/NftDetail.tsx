import { Button } from '@/componentes/Elements/Button/Button';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { NFTListed } from '@/lib/api/nfts';
import { httpClient } from '@/lib/httpClient';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import algoLogoWhite from '../../../assets/algorandWhite.svg';

export const NftDetail = () => {
  const { ipnft } = useParams();
  const [error, setError] = useState<Error>();
  const [data, setData] = useState<NFTListed[]>();

  useEffect(() => {
    fetchNfts();
  }, [ipnft]);

  const fetchNfts = async () => {
    try {
      const res = await httpClient.get('nfts');
      setData(res.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const nftSelected = data?.find((nft) => nft.ipnft === ipnft);

  const checkIfVideo = (imageUrl: string) => {
    if (imageUrl.endsWith('.mp4')) {
      const spitString = imageUrl.split('/');
      spitString[2] = 'ipfs.io';

      return spitString.join('/');
    }
    return imageUrl;
  };

  return (
    <MainLayout>
      <div className="w-[45rem] m-auto">
        <div className="flex justify-around">
          {nftSelected?.image_url.endsWith('.mp4') ? (
            <div className="w-full object-cover rounded-lg min-h-[325px] max-h-[325px] mr-8">
              <video className=" min-h-[325px] max-h-[325px]" autoPlay loop muted>
                <source src={checkIfVideo(nftSelected?.image_url)} type="video/mp4" />
              </video>
            </div>
          ) : (
            <div className="w-full object-cover mr-8 rounded-lg">
              <img
                className="w-full object-contain min-h-[325px] max-h-[325px] "
                src={nftSelected?.image_url}
                alt={nftSelected?.image_url}
              />
            </div>
          )}

          <div className="flex flex-col justify-around">
            <h2 className="text-2xl">
              <strong>{nftSelected?.title}</strong>
            </h2>
            <p>
              Description: <strong>{nftSelected?.arc69?.description}</strong>
            </p>
            <p>
              Creator: <strong>{nftSelected?.arc69?.properties?.artist}</strong>{' '}
            </p>
            <p>
              Cause: <strong>{nftSelected?.arc69?.properties?.cause}</strong>{' '}
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <Button className="text-2xl flex text-climate-white mt-8 font-dinpro">
            <span>
              Buy for <strong>{nftSelected?.arc69?.properties?.price}</strong>{' '}
            </span>
            <img className="w-4 h-4 self-center ml-1" src={algoLogoWhite} alt="algologowhite" />
          </Button>
        </div>
      </div>
      {error && <div>{error}</div>}
    </MainLayout>
  );
};
