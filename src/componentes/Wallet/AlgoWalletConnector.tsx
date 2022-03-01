import { useState, useEffect, MouseEvent } from 'react';
import { SessionWallet, allowedWallets } from 'algorand-session-wallet';
import { Button } from '../Elements/Button/Button';
import { Dialog } from '../Dialog/Dialog';

type AlgorandWalletConnectorProps = {
  darkMode?: boolean;
  connected?: boolean;
  accounts?: string[];
  sessionWallet: SessionWallet;
  updateWallet: (sw: SessionWallet) => void;
};

export const AlgoWalletConnector = (props: AlgorandWalletConnectorProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    connectWallet();
  }, [props.sessionWallet]);

  const connectWallet = async () => {
    if (props.sessionWallet.connected()) return;
    await props.sessionWallet.connect();
    props.updateWallet(props.sessionWallet);
  };

  const handleDialog = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectedWallet = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const choice = event.currentTarget.id;

    if (!(choice in allowedWallets)) {
      props.sessionWallet.disconnect();
      return setIsOpen(false);
    }
    const sw = new SessionWallet(
      props.sessionWallet.network,
      props.sessionWallet.permissionCallback,
      choice
    );
    if (!(await sw.connect())) {
      sw.disconnect();
      // showErrorToaster("Couldn't connect to wallet")
    }
    props.updateWallet(sw);
    setIsOpen(!isOpen);
  };

  const disconnectWallet = () => {
    props.sessionWallet.disconnect();
    props.updateWallet(
      new SessionWallet(props.sessionWallet.network, props.sessionWallet.permissionCallback)
    );
  };

  return (
    <div>
      {props.sessionWallet.accountList()[0] ? (
        <div>
          <Button onClick={disconnectWallet}>Disconnect Wallet</Button>
          <h2 className="mt-2 font-bold text-lg">
            {props.sessionWallet.accountList()[0].substring(0, 10) + '...'}
          </h2>
        </div>
      ) : (
        <Button onClick={handleDialog}>connect wallet</Button>
      )}

      {isOpen && (
        <Dialog isOpen={isOpen} setIsOpen={setIsOpen} title="Select Wallet" subtitle="" claim="">
          <div className="flex flex-col space-between w-80 content-center m-auto my-5">
            <div className="m-5 w-60 border-2 border-slate-800 rounded">
              <button
                className="p-3 w-full"
                id="algo-signer"
                onClick={(event) => handleSelectedWallet(event)}
              >
                AlgoSigner
              </button>
            </div>
            <div className="m-5 w-60 border-2 border-slate-800 rounded">
              <button
                className="p-3 w-full"
                id="my-algo-connect"
                onClick={(event) => handleSelectedWallet(event)}
              >
                MyAlgo
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};
