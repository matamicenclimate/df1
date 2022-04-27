/*
  Mint action related business logic.
*/
import { InputGeneratorType } from '@/componentes/InputGenerator/InputGenerator';
import { client } from '@/lib/algorand';
import { Cause } from '@/lib/api/causes';
import { createNFT } from '@/lib/nft';
import { metadataNFTType, NFTMetadataBackend } from '@/lib/type';
import ProcessDialog from '@/service/ProcessDialog';
import { AuctionLogic } from '@common/src/services/AuctionLogic';
import NetworkClient from '@common/src/services/NetworkClient';
import { Wallet } from 'algorand-session-wallet';
import Container from 'typedi';

const dialog = Container.get(ProcessDialog);

const net = Container.get(NetworkClient);

/**
 * Retrieves the NFT metadata.
 */
export async function getNFTMetadata(data: NFTMetadataBackend) {
  dialog.message = 'Uploading NFT to IPFS...';
  dialog.title = 'Preparing NFT';
  dialog.start();
  const oneFile = data.properties.file;
  const attribute = data.properties?.attributes?.reduce?.(
    (acc: Record<string, unknown>, curr: InputGeneratorType['inputList'][0]) => {
      acc[curr.trait_type] = curr.value;
      return acc;
    },
    {}
  );
  delete data.properties.attributes;
  const dataString = {
    ...data,
    properties: { ...data.properties, ...attribute },
    file: undefined,
  };
  dataString.properties.causePercentage = Number(dataString.properties.causePercentage);
  dataString.properties.price = Number(dataString.properties.price);
  const form = new FormData();
  form.append('data', JSON.stringify(dataString));
  form.append('file', oneFile, oneFile.name);
  const res = await net.core.post('ipfs', form);
  console.log('res.data', res.data);
  dialog.stop();
  return res.data;
}

/**
 * Creates a bound in-place mint action that can be used to mint a new
 * NFT from a react component.
 */
export function useMintAction(
  causes: Cause[] | undefined,
  dataToPost: NFTMetadataBackend | undefined,
  bidDuration: number = 5 * 60 * 1000
) {
  return async function mintNFT(meta: metadataNFTType, wallet: Wallet, account: string) {
    const cause = causes?.find((cause) => cause.id === dataToPost?.properties.cause);
    if (cause == null) {
      return alert("Can't send that!");
    }
    const algodClient = client();
    await dialog.process(async function () {
      this.title = 'Uploading to blockchain';
      this.message = 'Creating the NFT data...';
      const result = await createNFT(algodClient, account, meta, wallet);
      if (result.isDefined()) {
        this.message = 'Opting in...';
        const optResult = await net.core.post('opt-in', {
          assetId: result.value.assetID,
        });
        console.info('Asset opted-in:', optResult);
        const transfer = await Container.get(AuctionLogic).makeTransferToAccount(
          optResult.data.targetAccount,
          result.value.assetID,
          new Uint8Array()
        );
        console.info('Asset transfer to app:', transfer);
        const tx = await net.core.post('create-auction', {
          assetId: result.value.assetID,
          creatorWallet: account,
          causePercentage: dataToPost?.properties.causePercentage ?? 30,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + bidDuration).toISOString(),
        });
        console.info('Auction program was created:', tx.data);
        return;
      }
      return console.warn(
        "Can't opt-in this asset: No data returned at creation-time! This is a no-op, but it may indicate a problem."
      );
    });
  };
}
