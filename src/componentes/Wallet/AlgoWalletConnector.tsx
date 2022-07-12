/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, MouseEvent } from 'react';
import { SessionWallet, allowedWallets } from 'algorand-session-wallet';
import { Button } from '@/componentes/Elements/Button/Button';
import { Dialog } from '@/componentes/Dialog/Dialog';
import { useWalletContext } from '@/context/WalletContext';
import { Dropdown } from '@/componentes/Dropdown/Dropdown';

const ps = {
  algod: {
    // server: 'https://testnet.algoexplorerapi.io',
    server: 'https://algoindexer.testnet.algoexplorerapi.io',
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

  const acctsTrunc = accts.map((acc) => acc.substring(0, 8) + '...');

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
    sw.connected();
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
            <Dropdown
              options={acctsTrunc}
              defaultValue={acctsTrunc[0]}
              setOptionSelected={setOptionSelected}
            />
          )}
          <Button className="p-2 ml-6" onClick={disconnectWallet}>
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
        <Button variant="login" onClick={() => setIsOpen(!isOpen)}>
          Login / Connect Wallet
        </Button>
      )}

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
    </div>
  );
};
