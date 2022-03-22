import React, { useState } from 'react';
import { destroyAsset } from '@/lib/nft';
import { setupClient } from '@/lib/algorand';
import { Wallet } from 'algorand-session-wallet';
import { Button } from '@/componentes/Elements/Button/Button';
import { Dialog } from '@/componentes/Dialog/Dialog';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { Form } from '@/componentes/Form/Form';

type DeleteAssetProps = {
  account: string | undefined;
  wallet: Wallet | undefined;
};

export const DeleteAsset = ({ account, wallet }: DeleteAssetProps) => {
  const [inputValue, setInputValue] = useState<string | undefined>('');
  const [deletingAsset, setDeletingAsset] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [, setIsOpen] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    setInputValue(newValue);
  };

  const handleDeleteAsset = async () => {
    setDeletingAsset(true);
    const algoClient = await setupClient();
    destroyAsset(algoClient, account, inputValue, wallet)
      .then(() => {
        setInputValue('');
        setDeletingAsset(false);
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
        setDeletingAsset(false);
      });
  };

  return (
    <div className="text-center">
      <Form onSubmit={handleDeleteAsset}>
        <input
          className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 md:text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          type="number"
          placeholder="Asset ID to be deleted"
          value={inputValue}
          onChange={handleInputChange}
          required
        />
        <Button variant="delete" type="submit">
          Delete Asset
        </Button>
      </Form>
      {deletingAsset && (
        <Dialog isOpen={deletingAsset} setIsOpen={setIsOpen} title={'Deleting asset...'}>
          <div className="flex justify-center mt-3">{deletingAsset && <Spinner size="lg" />}</div>
        </Dialog>
      )}
      {error && <div>{error}</div>}
    </div>
  );
};
