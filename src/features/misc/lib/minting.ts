/*
  Mint action related business logic.
*/
import { InputGeneratorType } from '@/componentes/InputGenerator/InputGenerator';
import { client } from '@/lib/algorand';
import { Cause } from '@/lib/api/causes';
import { AssetInfo, createNFT } from '@/lib/nft';
import { metadataNFTType, NFTMetadataBackend } from '@/lib/type';
import ProcessDialog from '@/service/ProcessDialog';
import { DateLike } from '@common/src/lib/dates';
import { AuctionLogic } from '@common/src/services/AuctionLogic';
import NetworkClient from '@common/src/services/NetworkClient';
import { Wallet } from 'algorand-session-wallet';
import { useTranslation } from 'react-i18next';
import Container from 'typedi';
import { useNavigate } from 'react-router-dom';
import { NftCreation } from './MintingState';

const dialog = Container.get(ProcessDialog);

const net = Container.get(NetworkClient);

/**
 * Retrieves the NFT metadata.
 */
export async function getNFTMetadata(data: NFTMetadataBackend) {
  return await dialog.process(async function () {
    this.message = 'Uploading NFT to IPFS...';
    this.title = 'Preparing NFT';
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
    return res.data;
  });
}

export type MintMeta = {
  end: DateLike;
  start: DateLike;
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
      let nftCreationStatus!: NftCreation;
      {
        const tryCreate = () => createNFT(algodClient, account, data, wallet);
        nftCreationStatus = await tryCreate();
        let attempts = 0;
        while (nftCreationStatus.notDone) {
          if (attempts++ > 3) throw nftCreationStatus.reason;
          nftCreationStatus = await tryCreate();
        }
      }
      const asset = nftCreationStatus.asset;
      console.log('result from createNFT', asset);

      this.message = 'Opting in...';
      const optResult = await net.core.post('opt-in', {
        assetId: asset.assetID,
      });
      console.info('Asset opted-in:', optResult);
      const transfer = await Container.get(AuctionLogic).makeTransferToAccount(
        optResult.data.targetAccount,
        asset.assetID,
        new Uint8Array()
      );
      console.info('Asset transfer to app:', transfer);
      this.message = 'Creating auction...';
      const tx = await net.core.post('create-auction', {
        assetId: asset.assetID,
        creatorWallet: account,
        causePercentage: info.cause.part ?? 30,
        startDate: info.start.toISOString(),
        endDate: info.end.toISOString(),
      });

      console.info('Auction program was created:', tx.data);
      if (tx.data.appIndex) {
        this.title = 'Your NFT has been successfully created!!';
        this.message = '';

        goToPage(`/nft/${asset.assetID}`);
        await new Promise((r) => setTimeout(r, 5000));
      }

      return;

      return console.warn(
        "Can't opt-in this asset: No data returned at creation-time! This is a no-op, but it may indicate a problem."
      );
    });
  };
}
