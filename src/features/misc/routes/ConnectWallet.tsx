import React, { useState, useEffect, MouseEvent, useContext } from 'react';
import { SessionWallet, allowedWallets } from 'algorand-session-wallet';
import { Button } from '@/componentes/Elements/Button/Button';
import { Dialog } from '@/componentes/Dialog/Dialog';
import { UserWalletContext } from '@/context/UserContext';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import useWallet from '@/hooks/useWallet';

const ps = {
  algod: {
    server: 'https://testnet.algoexplorerapi.io',
    port: 0,
    token: '',
    network: 'TestNet',
  },
};

export const ConnectWallet = () => {
  const sw = new SessionWallet(ps.algod.network);
  const [sessionWallet, setSessionWallet] = useState(sw);
  const [accts, setAccounts] = useState(sw.accountList());
  const [connected, setConnected] = useState(sw.connected());

  const [optionSelected, setOptionSelected] = useState<string | undefined>();
  const [wallet, setWallet, discardWallet] = useWallet();

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
  };

  const handleSelectedWallet = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const choice = event.currentTarget.id;

    if (!(choice in allowedWallets)) {
      sessionWallet.disconnect();
    }
    const sw = new SessionWallet(sessionWallet.network, sessionWallet.permissionCallback, choice);
    if (!(await sw.connect())) {
      sw.disconnect();
      // showErrorToaster("Couldn't connect to wallet")
    }
    setWallet(sw.wallet);
    updateWallet(sw);
  };

  return (
    <div>
      <MainLayout>
        <h1 className="text-center text-2xl font-bold">
          Please connect your Wallet to create an NFT
        </h1>
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
      </MainLayout>
    </div>
  );
};
