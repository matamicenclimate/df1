import { Button } from '@/componentes/Elements/Button/Button';
import { Form } from '@/componentes/Form/Form';
import { Input } from '@/componentes/Form/Inputs';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { RichTable } from '@/componentes/Layout/RichTable';
import { useWalletFundsContext } from '@/context/WalletFundsContext';
import { Asset, AssetEntity, Nft } from '@common/src/lib/api/entities';
import { retrying } from '@common/src/lib/net';
import NetworkClient from '@common/src/services/NetworkClient';
import { none, option, some } from '@octantis/option';
import { Wallet } from 'algorand-session-wallet';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Container from 'typedi';
import NftCause from '../components/MyNftList/NftCause';
import NftName from '../components/MyNftList/NftName';
import NftPrice from '../components/MyNftList/NftPrice';
import NftStatus from '../components/MyNftList/NftStatus';
import { TransactionFrame } from '../components/MyNftList/TransactionFrame';
import Sidebar from '@/componentes/Sidebar/Sidebar';

export interface MyNftListProps {
  wallet: Wallet;
  account: string;
}

export interface UserState {
  balance: number;
  projects: number;
}

function getId(value: Asset | AssetEntity | Nft) {
  if (isAsset(value)) {
    return value['asset-id'];
  } else if (isNft(value)) {
    return value.id;
  }
  return value.assetIdBlockchain;
}

function getImageUrl(value: AssetEntity | Nft) {
  if (isNft(value)) {
    return value.image_url;
  }
  return value.imageUrl;
}

function isAsset(value: Asset | AssetEntity | Nft): value is Asset {
  return typeof (value as unknown as Record<string, unknown>)['asset-id'] === 'number';
}
function isNft(value: AssetEntity | Nft): value is Nft {
  return typeof (value as unknown as Record<string, unknown>)['image_url'] === 'string';
}
const net = Container.get(NetworkClient);

/**
 * A root component that shows a panel with information about the
 * minted user's NFTs, ongoing bids, sales...
 */
export default function MyNftList({ account }: MyNftListProps) {
  const { register } = useForm();
  const [user, setUser] = useState<option<UserState>>(none());
  const [nfts, setNfts] = useState<Record<string, AssetEntity | Asset | Nft>>({});
  const { balanceAlgo, balanceAlgoUSD } = useWalletFundsContext();
  const [info, setInfo] = useState('');

  useEffect(() => {
    if (balanceAlgo != null) {
      setUser(
        some({
          projects: 0,
          balance: balanceAlgoUSD ?? 0,
        })
      );
    }
  }, [balanceAlgo, balanceAlgoUSD]);

  useEffect(() => {
    (async () => {
      setInfo(`Preloading assets...`);
      const res = await retrying(
        net.core.get('my-assets', {
          query: {
            wallet: account,
          },
        }),
        10
      );
      if (res.data.assets.length === 0) {
        setInfo('No asset found.');
      }
      setNfts(
        res.data.assets.reduce((map, asset) => {
          map[getId(asset)] = asset;
          return map;
        }, {} as Record<string, Asset | AssetEntity>)
      );
    })();
  }, []);
  useEffect(() => {
    const size = Object.keys(nfts).length;
    if (size === 0) return;
    const pending = [...Object.values(nfts)].filter((s) => isAsset(s)) as Asset[];
    setInfo(`Loaded ${size - pending.length} out of ${size} total assets...`);
    if (pending.length === 0) {
      setInfo(`Done! All assets loaded!`);
      setTimeout(() => {
        setInfo('');
      }, 3000);
    } else {
      const ad = pending.pop();
      if (!ad) {
        throw new Error(`Invalid data payload! This shouldn't be happening!`);
      }
      const id = ad['asset-id'].toString();
      if (id == null) {
        throw new Error(`Invalid data payload! This shouldn't be happening!`);
      }
      (async () => {
        console.info(`Fetching asset ${id}...`);
        const res = await retrying(
          net.core.get(`asset/:id`, {
            params: { id },
          }),
          10
        );
        console.log('response data', res.data);

        setNfts({ ...nfts, [res.data.value.id.toString()]: res.data.value });
      })();
    }
  }, [nfts]);

  return (
    <MainLayout>
      <div className="flex w-full">
        <Sidebar />
        <TransactionFrame className="flex">
          <div className="flex flex-col w-[90%]">
            <div className="bg-white shadow-lg mt-7 border border-neutral-200">
              <Form className="border-b border-neutral-200 pt-4 px-4" onSubmit={async () => void 0}>
                <div className="flex justify-between items-center mb-3">
                  <p>My NFTs</p>
                  <Input
                    className="basis-2/4"
                    register={register}
                    name="term"
                    type="search"
                    placeholder="Search"
                  />
                  <div className="flex items-center">
                    <p className="text-climate-light-gray">Filters</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1 text-climate-light-gray"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <Link to="/mint">
                    <Button
                      className="basis-1/3 bg-climate-light-blue font-normal text-sm rounded-3xl px-5"
                      size="sm"
                    >
                      Create NFT
                    </Button>
                  </Link>
                </div>
              </Form>
              <RichTable
                order={['name', 'price', 'cause', 'status']}
                header={{
                  name: 'NFT Name',
                  price: 'Price',
                  cause: 'Cause',
                  status: 'Status',
                }}
                rows={[...Object.values(nfts)]
                  .sort((a, b) => getId(b) - getId(a))
                  .map((nft) => {
                    if (isAsset(nft)) {
                      const id = nft['asset-id'].toString();
                      return {
                        $id: id,
                        $class: 'animate-pulse',
                        name: (
                          <div className="flex">
                            <div className="mr-2 bg-climate-action-light rounded-lg w-10 h-10">
                              &nbsp;
                            </div>
                            <div className="flex flex-col w-6/12">
                              <div className="rounded mb-2 bg-climate-action-light">&nbsp;</div>
                              <div className="rounded bg-climate-action-light h-2">&nbsp;</div>
                            </div>
                          </div>
                        ),
                        price: (
                          <div className="flex flex-col">
                            <div className="mt-2 mb-4 flex justify-between">
                              <div className="bg-climate-action-light rounded w-full">&nbsp;</div>
                              <div className="ml-2 bg-climate-action-light rounded w-4">&nbsp;</div>
                            </div>
                            <hr />
                          </div>
                        ),
                        cause: <div className="rounded w-full bg-climate-action-light">&nbsp;</div>,
                        status: (
                          <div className="rounded w-full bg-climate-action-light">&nbsp;</div>
                        ),
                      };
                    } else {
                      const id = getId(nft).toString();
                      return {
                        $id: id,
                        $class: '',
                        name: <NftName thumbnail={getImageUrl(nft)} title={nft.title} id={id} />,
                        price: <NftPrice price={nft.arc69.properties.price} />,
                        cause: <NftCause id={nft.arc69.properties.cause} />,
                        status: (
                          <NftStatus
                            nft={nft}
                            assetId={getId(nft)}
                            creatorWallet={account}
                            causePercentage={nft.arc69.properties.causePercentage}
                          />
                        ),
                      };
                    }
                  })}
              />
            </div>
          </div>
        </TransactionFrame>
      </div>
    </MainLayout>
  );
}
