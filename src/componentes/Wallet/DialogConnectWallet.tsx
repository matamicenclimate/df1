import { Dialog } from '@/componentes/Dialog/Dialog';
import { useWalletContext } from '@/context/WalletContext';
import { SessionWallet, allowedWallets } from 'algorand-session-wallet';
import React, { useState } from 'react';
import { Button } from '../Elements/Button/Button';

type DialogConnectWalletProps = {
  textButton: React.ReactElement;
};
const ps = {
  algod: {
    server: 'https://algoindexer.testnet.algoexplorerapi.io',
    port: 0,
    token: '',
    network: 'TestNet',
  },
};

const DialogConnectWallet = ({ textButton }: DialogConnectWalletProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const sw = new SessionWallet(ps.algod.network);
  const [sessionWallet, setSessionWallet] = useState(sw);
  const [accts, setAccounts] = useState(sw.accountList());
  const [connected, setConnected] = useState(sw.connected());

  const [optionSelected, setOptionSelected] = useState<string | undefined>();

  const { setUserWallet } = useWalletContext();

  function handleContextWalletAcct(sw: SessionWallet) {
    if (!setUserWallet) return;
    return setUserWallet({
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

  const handleSelectedWallet = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const choice = event.currentTarget.id;

    if (!(choice in allowedWallets)) {
      sessionWallet.disconnect();
      return setIsOpen(false);
    }
    const sw = new SessionWallet(sessionWallet.network, sessionWallet.permissionCallback, choice);
    if (!(await sw.connect())) {
      sw.disconnect();
    }
    updateWallet(sw);
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <>
      <div onClick={() => setIsOpen(!isOpen)}>{textButton}</div>
      {isOpen && (
        <Dialog
          closeButton
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title=""
          subtitle="Connect your wallet"
          claim="Please select the provider you wish to connect your wallet to."
        >
          <div className="flex flex-col space-between m-auto items-center font-inter">
            <div className="m-5 w-[260px] border border-climate-light-blue rounded-3xl">
              <button
                className="p-3 w-full flex justify-center items-center hover:font-bold"
                id="algo-signer"
                onClick={(event) => handleSelectedWallet(event)}
              >
                <img
                  className="w-10"
                  src="https://dartroom.xyz/img/algosigner.69be6245.svg"
                  alt="algosigner-logo"
                />
                <span className="ml-4 text-climate-light-blue font-medium text-base">
                  AlgoSigner
                </span>
              </button>
            </div>
            <div className="m-5 w-[260px] border border-climate-light-blue rounded-3xl">
              <button
                className="p-3 w-full flex justify-center items-center hover:font-bold"
                id="my-algo-connect"
                onClick={(event) => handleSelectedWallet(event)}
              >
                <img
                  className="w-10"
                  src="https://dartroom.xyz/img/myalgo.b2b6857d.svg"
                  alt="myalgo-logo"
                />
                <span className="ml-4 text-climate-light-blue">MyAlgo</span>
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default DialogConnectWallet;
