/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { SessionWallet } from 'algorand-session-wallet';
import { Button } from '@/componentes/Elements/Button/Button';
import { useWalletContext } from '@/context/WalletContext';
import { Dropdown } from '@/componentes/Dropdown/Dropdown';
import DialogConnectWallet from './DialogConnectWallet';

const ps = {
  algod: {
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

  const { userWallet, setUserWallet } = useWalletContext();

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

  const disconnectWallet = () => {
    sessionWallet.disconnect();
    updateWallet(new SessionWallet(sessionWallet.network, sessionWallet.permissionCallback));
  };

  return (
    <>
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
        <DialogConnectWallet
          textButton={
            <Button variant="login">
              <p className="">Login / Connect Wallet</p>
            </Button>
          }
        />
      )}
    </>
  );
};
