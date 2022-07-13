import { Button } from '@/componentes/Elements/Button/Button';
import { Card } from '@/componentes/Elements/Card/Card';
import { useCauseContext } from '@/context/CauseContext';
import { useCheckoutContext } from '@/context/CheckoutContext';
import { CausePostBody } from '@/lib/api/causes';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCause } from './NftDetail';

const CheckoutPage = () => {
  const { nftPurchased } = useCheckoutContext();
  const { causes } = useCauseContext();
  const [cause, setCause] = useState<CausePostBody>();

  useMemo(() => {
    if (nftPurchased && causes) {
      setCause(getCause(causes, nftPurchased.asset));
    }
  }, [nftPurchased]);

  return (
    <div className="w-2/3 h-screen m-auto flex flex-col justify-center">
      <h2 className="ml-10 text-[32px] font-semibold">My order</h2>
      <div className="flex justify-center gap-4 items-center">
        {cause && (
          <div
            className="w-[680px] h-[440px] relative  rounded-md"
            style={{
              backgroundImage: `linear-gradient(to bottom, transparent 0%, black 100%), url(${cause.imageUrl})`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="absolute h-full top-[20%] left-[20%] text-center text-white">
              <span className="checkmark">
                <div className="checkmark_circle"></div>
                <div className="absolute top-8 left-10">
                  <div className="checkmark_stem"></div>
                  <div className="checkmark_kick"></div>
                </div>
              </span>
              <p className="text-2xl font-semibold">Congratulations!</p>
              <div className="text-base mt-5">
                <p>You have successfully purchased your NFT</p>
                <p>
                  You have contributed to{' '}
                  <span className="text-climate-yellow font-bold">320€</span> the cause &quot;
                  {cause.title}&quot;.
                </p>
              </div>
              <div className="flex gap-3 justify-center mt-10">
                <Button variant="login">
                  <Link className="font-semibold" to="/my-nfts">
                    {' '}
                    Go to &quot;My NFTs &quot;{' '}
                  </Link>
                </Button>
                <Link to="">
                  <p className="flex items-center rounded-3xl border border-white p-3 hover:font-bold">
                    Download Certificate
                  </p>
                </Link>
              </div>
            </div>
          </div>
        )}
        <div>{nftPurchased && <Card nft={nftPurchased.asset} />}</div>
      </div>
    </div>
  );
};

export default CheckoutPage;
