import { Button } from '@/componentes/Elements/Button/Button';
import { Form } from '@/componentes/Form/Form';
import { Input } from '@/componentes/Form/Inputs';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { RichTable } from '@/componentes/Layout/RichTable';
import { Nft } from '@/lib/api/nfts';
import { none, option, some } from '@octantis/option';
import { Wallet } from 'algorand-session-wallet';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import NftCause from '../components/NftCause';
import NftName from '../components/NftName';
import NftPrice from '../components/NftPrice';
import NftStatus from '../components/NftStatus';

function ProfileColumn({
  children,
  className,
  ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return (
    <div className={`basis-1/3 pr-12 ${className ?? ''}`.trim()} {...props}>
      {children}
    </div>
  );
}

function TransactionFrame({
  children,
  className,
  ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return (
    <div className={`basis-2/3 pl-12 ${className ?? ''}`.trim()} {...props}>
      {children}
    </div>
  );
}

export interface MyNftListProps {
  wallet: Wallet;
  account: string;
}

interface UserState {
  balance: number;
  projects: number;
}

const ProfileLoading = () => (
  <div className="flex p-4 flex-col items-center basis-1/2 shadow-lg rounded-xl bg-white animate-pulse">
    <h5 className="text-lg font-dinpro font-normal rounded w-full bg-climate-action-light">
      &nbsp;
    </h5>
    <p className="text-md m-2 font-normal font-dinpro w-full rounded bg-climate-action-light">
      &nbsp;
    </p>
    <p className="text-sm font-normal font-dinpro w-full rounded bg-climate-action-light">
      <a>&nbsp;</a>
    </p>
    <div className="flex pt-2 justify-evenly w-full">
      <div className=" flex w-full flex-col items-center p-2">
        <div className="bg-climate-action-light w-full rounded">&nbsp;</div>
        <p className="font-sanspro text-xs bg-climate-action-light rounded w-full mt-2">&nbsp;</p>
      </div>
      <div className="flex w-full flex-col items-center p-2">
        <div className="bg-climate-action-light w-full rounded">&nbsp;</div>
        <p className="font-sanspro text-xs bg-climate-action-light rounded w-full mt-2">&nbsp;</p>
      </div>
    </div>
    <div className="p-3 pt-4 w-full">
      <hr />
    </div>
    <div className="flex justify-center w-full">
      <a className="w-full p-1">
        <Button className="m-1 w-full" size="sm">
          &nbsp;
        </Button>
      </a>
      <a className="w-full p-1">
        <Button className="m-1 w-full" size="sm" variant="light">
          &nbsp;
        </Button>
      </a>
    </div>
  </div>
);

const createProfile = (account: string, wallet: Wallet, state: UserState) => (
  <div className="flex p-4 flex-col items-center basis-1/2 shadow-lg rounded-xl bg-white">
    <h5 className="text-lg font-dinpro font-normal text-climate-black-text">
      {wallet.displayName()}
    </h5>
    <p className="text-sm pb-2 font-normal font-dinpro text-climate-gray-light">
      <a target="_blank" rel="noreferrer" href={`https://algoexplorer.io/address/${account}`}>
        @{account.slice(0, 8)}...{account.slice(-8)}
      </a>
    </p>
    <div className="flex pt-2 justify-evenly">
      <div className=" flex flex-col items-center p-2">
        <p>{state.balance} €</p>
        <p className="font-sanspro text-xs text-climate-gray-artist">Total balance</p>
      </div>
      <div className="flex flex-col items-center p-2">
        <p>{state.projects}</p>
        <p className="font-sanspro text-xs text-climate-gray-artist">Projects backed</p>
      </div>
    </div>
    <div className="p-3 pt-4 w-full">
      <hr />
    </div>
    <div className="flex justify-center w-full">
      <a className="w-full p-1">
        <Button className="m-1 w-full" size="sm">
          Mint NFT
        </Button>
      </a>
      <a
        className="w-full p-1"
        target="_blank"
        rel="noreferrer"
        href={`https://algoexplorer.io/address/${account}`}
      >
        <Button className="m-1 w-full" size="sm" variant="light">
          Wallet
        </Button>
      </a>
    </div>
  </div>
);

/**
 * A root component that shows a panel with information about the
 * minted user's NFTs, ongoing bids, sales...
 */
export default function MyNftList({ wallet, account }: MyNftListProps) {
  const { register } = useForm();
  const [user, setUser] = useState<option<UserState>>(none());
  const [nfts, setNfts] = useState<Nft[]>([]);
  useEffect(() => {
    setUser(
      some({
        projects: 0,
        balance: 0,
      })
    );
  }, []);
  return (
    <MainLayout>
      <div className="flex flex-row w-full">
        <ProfileColumn className="flex">
          <div className="basis-1/2">&nbsp;</div>
          {user.fold(<ProfileLoading />, (state) => createProfile(account, wallet, state))}
        </ProfileColumn>
        <TransactionFrame className="flex">
          <div className="flex flex-col basis-3/4">
            <h2 className="text-4xl font-normal font-dinpro text-climate-black-title">My NFTs</h2>
            <div className="p-3 rounded-3xl bg-white shadow-lg mt-7">
              <Form onSubmit={async () => void 0}>
                <div className="flex justify-between">
                  <Input
                    className="basis-2/4"
                    register={register}
                    name="term"
                    type="search"
                    placeholder="Search"
                  />
                  <Button className="basis-1/3" size="sm" variant="inverted">
                    + Mint new NFT
                  </Button>
                </div>
              </Form>
              <RichTable
                order={['name', 'price', 'cause', 'status']}
                header={{
                  name: 'NFT Name',
                  price: 'Price / Type',
                  cause: 'Cause',
                  status: 'Status',
                }}
                rows={nfts.map((nft) => {
                  const id = `${nft.id ?? '?????'}`;
                  return {
                    $id: id,
                    name: <NftName title="NFT Name here" id={id} />,
                    price: <NftPrice price={nft.price ?? -1} type="direct" />,
                    cause: <NftCause id={nft.description ?? '?'} />,
                    status: <NftStatus status="selling" />,
                  };
                })}
              />
            </div>
          </div>
          <div className="basis-1/4">&nbsp;</div>
        </TransactionFrame>
      </div>
    </MainLayout>
  );
}
