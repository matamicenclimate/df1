import { Button } from '@/componentes/Elements/Button/Button';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { NFTListed } from '@/lib/api/nfts';
import { httpClient } from '@/lib/httpClient';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import algoLogo from '../../../assets/algoLogo.svg';
import { CauseDetail } from '@/componentes/CauseDetail/CauseDetail';

export const NftDetail = () => {
  const { ipnft } = useParams();
  const [error, setError] = useState<Error>();
  const [nftDetail, setNftDetail] = useState<NFTListed>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchNfts();
  }, [ipnft]);

  const fetchNfts = async () => {
    try {
      setIsLoading(true);
      const req = await httpClient.get('nfts');
      const data = req.data;
      const nftSelected = data?.find((nft) => nft.ipnft === ipnft);
      setNftDetail(nftSelected);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  const checkIfVideo = (imageUrl: string) => {
    if (imageUrl.endsWith('.mp4')) {
      const spitString = imageUrl.split('/');
      spitString[2] = 'ipfs.io';

      return spitString.join('/');
    }
    return imageUrl;
  };

  const nftDetailLogo = nftDetail?.image_url.endsWith('.mp4') ? (
    <div className="w-full object-cover rounded-lg min-h-[325px] max-h-[325px] mr-8">
      <video className=" min-h-[325px] max-h-[325px]" autoPlay loop muted>
        <source src={checkIfVideo(nftDetail?.image_url)} type="video/mp4" />
      </video>
    </div>
  ) : (
    <img
      className="w-full h-full object-contain rounded-xl"
      src={nftDetail?.image_url}
      alt={nftDetail?.image_url}
    />
  );

  const getDateObj = (mintingDate: any) => {
    const date = new Date(mintingDate);
    const day = date.getDate();
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `Minted on ${day} ${monthName} ${year}`;
  };

  if (error) <div className="flex justify-center">{error}</div>;

  return (
    <MainLayout>
      {isLoading ? (
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className=" grid grid-cols-3 gap-4">
          <div className="left col-span-2 flex justify-center overflow-y-auto">
            <div className="w-[670px]">
              <div className="py-14">
                <h4 className="font-dinpro font-normal text-2xl">Description</h4>
              </div>
              <div>
                <p className="font-sanspro font-normal text-sm ">{nftDetail?.arc69?.description}</p>
              </div>
              <div>
                <div className="py-14">
                  <h4 className="font-dinpro font-normal text-2xl">Causes</h4>
                </div>
                <div className="w-[650px]">
                  <CauseDetail nftDetailCause={nftDetail?.arc69?.properties?.cause} />
                </div>
              </div>
              <div className="image w-[650px] h-[580px]">
                <div className="py-14 flex justify-between font-dinpro">
                  <h4 className="font-normal text-2xl">Resources</h4>
                  <p className="self-center font-normal text-climate-gray-light text-lg">
                    {getDateObj(nftDetail?.arc69?.properties?.date)}
                  </p>
                </div>
                <div className="w-full min-h-[580px] max-h-[580px] object-cover mr-8 rounded-lg">
                  {nftDetailLogo}
                </div>
              </div>
            </div>
          </div>
          <div className="right col-span-1">
            <div className="rounded-xl p-5 h-[715px] w-[370px] bg-white shadow-[3px_-5px_40px_0px_rgba(205, 205, 212, 0.3)]">
              <div className="image w-[330px] h-[345px]">{nftDetailLogo}</div>
              <div className="p-3">
                <div className="cardText">
                  <div className="bg-white">
                    <div className="font-sanspro font-semibold text-climate-green flex items-baseline">
                      <span className="h-2 w-2 bg-climate-green rounded-full inline-block mr-1 self-center"></span>
                      <p className="whitespace-nowrap overflow-hidden truncate text-ellipsis">
                        {nftDetail?.arc69?.properties?.cause}
                      </p>
                    </div>
                    <h4 className="py-2 text-4xl font-dinpro font-normal uppercase truncate text-ellipsis ">
                      {nftDetail?.title}
                    </h4>
                    <div className="font-sanspro text-climate-gray-artist text-sm truncate text-ellipsis">
                      @{nftDetail?.arc69?.properties?.artist}
                    </div>
                  </div>
                </div>
                <div className="offerBid flex justify-between py-7">
                  <div className="flex flex-col">
                    <label
                      className="font-sanspro text-climate-gray-artist text-sm pb-4"
                      htmlFor="title"
                    >
                      Offer Bid
                    </label>
                    <input
                      className="shadow appearance-none border border-gray-500 rounded-xl w-36 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                      id="title"
                      type="text"
                      placeholder={`${nftDetail?.arc69?.properties?.price}`}
                    />
                  </div>
                  <div className="flex self-end">
                    <p className="text-xl text-climate-blue self-center">
                      {nftDetail?.arc69?.properties?.price}
                    </p>
                    <img className="w-4 h-4 self-center ml-1" src={algoLogo} alt="algologo" />
                  </div>
                </div>
                <div className="buttons">
                  <Button className="w-full text-2xl text-climate-white mt-8 font-dinpro">
                    <span>Place Bid</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};
