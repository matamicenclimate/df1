import { Button } from '@/componentes/Elements/Button/Button';
import { Wallet } from 'algorand-session-wallet';
import { Link } from 'react-router-dom';
import { UserState } from './MyNftList';

export const CreateProfile = (account: string, wallet: Wallet, state: UserState) => (
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
        <p>{state.balance} $</p>
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
      <Link to="/mint" className="w-full p-1">
        <Button className="m-1 w-full" size="sm">
          Mint NFT
        </Button>
      </Link>
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
