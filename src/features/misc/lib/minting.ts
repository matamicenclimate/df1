/*
  Mint action related business logic.
*/
import { InputGeneratorType } from '@/componentes/InputGenerator/InputGenerator';
import { client } from '@/lib/algorand';
import { Cause } from '@/lib/api/causes';
import { createNFT } from '@/lib/nft';
import { metadataNFTType, NFTMetadataBackend } from '@/lib/type';
import ProcessDialog from '@/service/ProcessDialog';
import { DateLike } from '@common/src/lib/dates';
import NetworkClient from '@common/src/services/NetworkClient';
import { Wallet } from 'algorand-session-wallet';
import { useTranslation } from 'react-i18next';
import Container from 'typedi';
import { useNavigate } from 'react-router-dom';

const dialog = Container.get(ProcessDialog);
const net = Container.get(NetworkClient);

/**
 * Retrieves the NFT metadata.
 */
export async function getNFTMetadata(data: NFTMetadataBackend) {
  return await dialog.process(async function () {
    this.message = 'Uploading NFT to IPFS...';
    this.title = 'Minting NFT..';
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
    dataString.properties.price = algosToMicroalgos(Number(dataString.properties.price));

    const form = new FormData();
    form.append('data', JSON.stringify(dataString));
    form.append('file', oneFile, oneFile.name);

    const res = await net.core.post('ipfs', form);
    console.log('res.data', res.data);
    return res.data;
  });
}

export type MintMeta = {
  end?: DateLike;
  start?: DateLike;
  cause: {
    part?: number;
    id: string;
  };
};

/**
 * Creates a bound in-place mint action that can be used to mint a new
 * NFT from a react component.
 */
export function useMintAction(causes: Cause[] | undefined) {
  const { t } = useTranslation();

  const goToPage = useNavigate();

  if (causes == null) {
    return () => alert('Causes not loaded yet.');
  }
  return async function mintNFT(
    data: metadataNFTType,
    info: MintMeta,
    wallet: Wallet,
    account: string
  ) {
    const cause = causes.find((cause) => cause.id === info.cause.id);
    if (cause == null) {
      return alert('Invalid cause selected!');
    }
    const algodClient = client();
    await dialog.process(async function () {
      this.title = 'Uploading to blockchain';
      this.message = 'Creating the NFT data...';
      const result = await createNFT(algodClient, account, data, wallet);
      console.log('result from createNFT', result);
      if (result) {
        this.title = t('Minter.dialog.dialogNFTCreatedSuccess');
        this.message = '';

        goToPage(`/my-nfts`);
        await new Promise((r) => setTimeout(r, 5000));
      }
      return console.warn(
        "Can't opt-in this asset: No data returned at creation-time! This is a no-op, but it may indicate a problem."
      );
    });
  };
}

export function algosToMicroalgos(num: number) {
  return num * 1000000;
}

export function microalgosToAlgos(num: number) {
  return num / 1000000;
}
