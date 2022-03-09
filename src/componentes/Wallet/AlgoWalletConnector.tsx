import React, { useState, useEffect, MouseEvent, useContext } from 'react';
import { SessionWallet, allowedWallets } from 'algorand-session-wallet';
import { Button } from '../Elements/Button/Button';
import { Dialog } from '../Dialog/Dialog';
import { UserWalletContext } from '@/context/UserContext';
import { Dropdown } from '../Dropdown/Dropdown';
import useWallet from '@/hooks/useWallet';

const ps = {
  algod: {
    server: 'https://testnet.algoexplorerapi.io',
    port: 0,
    token: '',
    network: 'TestNet',
  },
};

type AlgoWalletConnectorProps = {
  isNavbar?: boolean;
};

export const AlgoWalletConnector = ({ isNavbar }: AlgoWalletConnectorProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const sw = new SessionWallet(ps.algod.network);
  const [sessionWallet, setSessionWallet] = useState(sw);
  const [accts, setAccounts] = useState(sw.accountList());
  const [connected, setConnected] = useState(sw.connected());
  const [wallet, setWallet, discardWallet] = useWallet();

  const [optionSelected, setOptionSelected] = useState<string | undefined>();

  const userWalletContext = useContext(UserWalletContext);

  function handleContextWalletAcct(sw: SessionWallet) {
    return userWalletContext?.setUserWallet({
      wallet: sw.wallet,
      account: optionSelected ? optionSelected : sw.getDefaultAccount(),
    });
  }

  function updateWallet(sw: SessionWallet) {
    setSessionWallet(sw);
    setAccounts(sw.accountList());
    setConnected(sw.connected());
    handleContextWalletAcct(sw);
  }

  useEffect(() => {
    connectWallet();
    updateWallet(sessionWallet);
  }, [sessionWallet, optionSelected]);

  const connectWallet = async () => {
    if (sessionWallet.connected()) return;
    await sessionWallet.connect();
    updateWallet(sessionWallet);
    setWallet(sessionWallet.wallet);
  };

  const handleSelectedWallet = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const choice = event.currentTarget.id;

    if (!(choice in allowedWallets)) {
      sessionWallet.disconnect();
      discardWallet();
      return setIsOpen(false);
    }
    const sw = new SessionWallet(sessionWallet.network, sessionWallet.permissionCallback, choice);
    if (!(await sw.connect())) {
      sw.disconnect();
      // showErrorToaster("Couldn't connect to wallet")
    }

    updateWallet(sw);
    setIsOpen(false);
  };

  const disconnectWallet = () => {
    sessionWallet.disconnect();
    updateWallet(new SessionWallet(sessionWallet.network, sessionWallet.permissionCallback));
  };

  return (
    <div>
      {sessionWallet.accountList()[0] && isNavbar ? (
        <div className="flex items-center">
          {accts && (
            <Dropdown accts={accts} defaultValue={accts[0]} setOptionSelected={setOptionSelected} />
          )}
          <Button className="p-2" onClick={disconnectWallet}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </Button>
        </div>
      ) : (
        <Button onClick={() => setIsOpen(!isOpen)}>Connect Wallet</Button>
      )}

      {isOpen && (
        <Dialog isOpen={isOpen} setIsOpen={setIsOpen} title="Select Wallet" subtitle="" claim="">
          <div className="flex flex-col space-between w-80 m-auto my-5 items-center">
            <div className="m-5 w-60 shadow-[1px_1px_5px_2px_rgb(0,0,0.3)] rounded-2xl hover:text hover:bg-gray-100">
              <button
                className="p-3 w-full flex justify-around items-center hover:font-bold"
                id="algo-signer"
                onClick={(event) => handleSelectedWallet(event)}
              >
                <span>AlgoSigner</span>
                <img
                  className="w-10"
                  src="https://dartroom.xyz/img/algosigner.69be6245.svg"
                  alt="algosigner-logo"
                />
              </button>
            </div>
            <div className="m-5 w-60 shadow-[1px_1px_5px_2px_rgb(0,0,0.3)] rounded-2xl hover:bg-gray-100">
              <button
                className="p-3 w-full flex justify-around items-center hover:font-bold"
                id="my-algo-connect"
                onClick={(event) => handleSelectedWallet(event)}
              >
                <span>MyAlgo</span>
                <img
                  className="w-10"
                  src="https://dartroom.xyz/img/myalgo.b2b6857d.svg"
                  alt="myalgo-logo"
                />
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};
