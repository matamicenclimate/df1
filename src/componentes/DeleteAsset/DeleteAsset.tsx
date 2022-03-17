import React, { useState } from 'react';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { destroyAsset } from '@/lib/nft';
import { setupClient } from '@/lib/algorand';

type DeleteAssetProps = {
  account: string | undefined;
};

export const DeleteAsset = ({ account }: DeleteAssetProps) => {
  const [inputValue, setInputValue] = useState<number | undefined>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setInputValue(e.target.value);
  };

  const handleDeleteAsset = async () => {
    const algoClient = await setupClient();
    return await destroyAsset(algoClient, account, inputValue);
  };

  return (
    <div className="text-center">
      <input
        type="number"
        placeholder="Asset ID to be deleted"
        value={inputValue}
        onChange={handleInputChange}
      />
      <button onClick={handleDeleteAsset}>Delete Asset</button>
    </div>
  );
};
