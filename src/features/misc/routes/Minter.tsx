import { useContext, useEffect, useState } from 'react';
import { Button } from '@/componentes/Elements/Button/Button';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Form } from '@/componentes/Form/Form';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { Wallet } from 'algorand-session-wallet';
import { httpClient } from '@/lib/httpClient';
import { AssetInfo, createNFT } from '@/lib/nft';
import { NFTMetadataBackend, metadataNFTType } from '@/lib/type';
import { InputGenerator, InputGeneratorType } from '@/componentes/InputGenerator/InputGenerator';
import { CauseContext } from '@/context/CauseContext';
import { client } from '@/lib/algorand';
import * as TransactionSigner from '@common/src/services/TransactionSigner';
import SimpleTransactionSigner from '@/service/impl/SimpleTransactionSigner';
import { some } from '@octantis/option';
import Container from 'typedi';
import { AuctionLogic } from '@common/src/services/AuctionLogic';
import ProcessDialog from '@/service/ProcessDialog';
import algosdk from 'algosdk';

export type MinterProps = {
  wallet: Wallet | undefined;
  account: string | undefined;
};

const dialog = Container.get(ProcessDialog);

export const Minter = ({ wallet, account }: MinterProps) => {
  const [imageURL, setImageURL] = useState<string>();
  const [dataToPost, setDataToPost] = useState<NFTMetadataBackend | undefined>();
  const [metadataNFT, setMetadataNFT] = useState<metadataNFTType | undefined>();
  const [transaction, setTransaction] = useState<AssetInfo | undefined>();

  const causeContext = useContext(CauseContext);
  const data = causeContext?.data;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NFTMetadataBackend>();

  async function mintNFT(meta: metadataNFTType, wallet: Wallet, account: string) {
    const algodClient = client();
    await dialog.process(async function () {
      this.title = 'Uploading to blockchain';
      this.message = 'Creating the NFT data...';
      setImageURL(meta.image_url);
      const result = await createNFT(algodClient, account, meta, wallet);
      if (result.isDefined()) {
        setTransaction(result.value);
        this.message = 'Opting in...';
        const optResult = await httpClient.post('opt-in', {
          assetId: result.value.assetID,
        });
        console.info('Asset opted-in:', optResult);
        const transfer = await Container.get(AuctionLogic).makeTransferToAccount(
          optResult.data.targetAccount,
          result.value.assetID,
          new Uint8Array()
        );
        console.info('Asset transfer to app:', transfer);
        const tx = await httpClient.post('create-auction', {
          assetId: result.value.assetID,
        });
        console.info('Auction program was created:', tx.data);
        // Modify the asset metadata
        {
          const assetId = result.value.assetID;
          const appIndex = tx.data.appIndex;
          const asset = meta;
          const note = await algosdk.encodeObj({
            ...asset,
            arc69: {
              ...asset.arc69,
              properties: { ...asset.arc69.properties, app_id: appIndex },
            },
          });
          const params = await client().getTransactionParams().do();
          const txn = await algosdk.makeAssetConfigTxnWithSuggestedParamsFromObject({
            from: account,
            reserve: account,
            clawback: account,
            manager: account,
            freeze: account,
            suggestedParams: params,
            assetIndex: assetId,
            note,
            strictEmptyAddressChecking: false,
          });
          const stxn = await wallet.signTxn([txn]);
          const r = await client().sendRawTransaction(stxn[0].blob).do();
          const c = await algosdk.waitForConfirmation(client(), r, 10);
          console.log('PATCHING ASSET NOTE', assetId, c);
          console.info('Done, targetting asset transfer...');
          const transfer = await Container.get(AuctionLogic).makeTransferToAccount(
            optResult.data.targetAccount,
            result.value.assetID,
            new Uint8Array()
          );
          console.info('Asset transfer to app:', transfer);
          console.info('Done, targetting auction activation...');
          const rspActivate = await httpClient.post('activate-auction', {
            appId: appIndex,
            assetId,
          });
          console.log('Auction activation result:', rspActivate.data);
        }
        // -------------------------
        return;
      }
      return console.warn(
        "Can't opt-in this asset: No data returned at creation-time! This is a no-op, but it may indicate a problem."
      );
    });
  }

  const getNFTMetadata = async (data: NFTMetadataBackend) => {
    const filelist = data.file;
    const oneFile = filelist[0];
    console.log('oneFile', oneFile);

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
    console.log('dataStringdataStringdataString', dataString);
    const form = new FormData();
    form.append('data', JSON.stringify(dataString));
    form.append('file', oneFile, oneFile.name);

    // selectedImage && form.append('file', selectedImage as File);

    const res = await httpClient.post('ipfs', form);

    console.log('res.data', res.data);
    setMetadataNFT(res.data);
    dialog.stop();
  };

  useEffect(() => {
    if (dataToPost) {
      dialog.message = 'Uploading NFT to IPFS...';
      dialog.title = 'Preparing NFT';
      dialog.start();
      getNFTMetadata(dataToPost);
    }
  }, [dataToPost]);

  useEffect(() => {
    // if (metadataNFT && wallet.isDefined() && account.isDefined()) {
    if (wallet != null) {
      (TransactionSigner.get() as SimpleTransactionSigner).wallet = some(wallet);
    }
    if (metadataNFT && wallet && account) {
      mintNFT(metadataNFT, wallet, account);
    }
  }, [metadataNFT]);

  const formSubmitHandler: SubmitHandler<NFTMetadataBackend> = (data: NFTMetadataBackend) => {
    setDataToPost(data);
  };

  return (
    <div>
      <MainLayout>
        <div className="flex justify-center h-screen rounded m-auto">
          <Form
            onSubmit={handleSubmit(formSubmitHandler) as () => Promise<void>}
            className="rounded px-8 pt-6 pb-8 mb-4 min-w-[800px]"
          >
            <h6 className="font-dinpro font-normal text-base">Basic Info</h6>
            <div>
              <label
                className="block text-custom-white md:text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <input
                className="border border-climate-border rounded-xl p-3"
                id="title"
                type="text"
                placeholder="Title.."
                {...register('title', { required: true })}
              />
              {errors.title && <span className="text-red-500">This field is required</span>}
            </div>
            <div>
              <label
                className="block text-custom-white md:text-gray-700 text-sm font-bold mb-2"
                htmlFor="artist"
              >
                Artist
              </label>
              <input
                className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 md:text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="artist"
                type="text"
                placeholder="Artist.."
                {...register('author', { required: true })}
              />
              {errors?.author && <span className="text-red-500">This field is required</span>}
            </div>
            <div>
              <label
                className="block text-custom-white md:text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <input
                className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 md:text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                placeholder="Description.."
                {...register('description', { required: true })}
              />
              {errors.description && <span className="text-red-500">This field is required</span>}
            </div>
            <div>
              <label
                className="block text-custom-white md:text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Price
              </label>
              <input
                className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 md:text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="price"
                type="number"
                placeholder="Set a price for your asset.."
                {...register('properties.price', { required: true })}
              />
              {errors.properties?.price && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
            <div className="flex w-full">
              <div className="w-3/4">
                <label
                  className="block text-custom-white md:text-gray-700 text-sm font-bold mb-2"
                  htmlFor="cause"
                >
                  Cause
                </label>
                <select
                  className="w-full bg-[url('/src/assets/chevronDown.svg')] bg-no-repeat bg-right shadow appearance-none border border-gray-500 rounded py-2 px-3 md:text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  {...register('properties.cause', { required: true })}
                >
                  <option value="">Select...</option>
                  {data && data?.map((cause) => <option key={cause.id}>{cause.title}</option>)}
                </select>
                {errors.properties?.cause && (
                  <span className="text-red-500">You should select a cause</span>
                )}
              </div>
              <div className="ml-2">
                <label
                  className="block text-custom-white md:text-gray-700 text-sm font-bold mb-2"
                  htmlFor="percentage"
                >
                  Percentage
                </label>
                <input
                  className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 md:text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="percentage"
                  type="number"
                  placeholder="Percentage.."
                  defaultValue={30}
                  {...register('properties.causePercentage', { required: true, min: 30, max: 99 })}
                />
                {errors.properties?.causePercentage && (
                  <span className="text-red-500">Percentage should be 30% or above</span>
                )}
              </div>
            </div>
            <div>
              <Controller
                control={control}
                name="properties.attributes"
                render={({ field: { value, onChange } }) => (
                  <InputGenerator
                    inputList={value ?? [{ trait_type: '', value: '' }]}
                    setInputList={onChange}
                  />
                )}
              />
            </div>
            <div>
              <div className="flex justify-between">
                <h6>Upload resources</h6>
                <p>You can mint jpg, gif, mov, mp4, cad, pdf</p>
              </div>
              <div className="mb-4">
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-custom-white md:text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="file"
                  type="file"
                  {...register('file', { required: true })}
                />
                {errors?.file && <span className="text-red-500">This field is required</span>}
              </div>
            </div>
            <Button variant="primary" type="submit">
              Mint Nft
            </Button>
          </Form>
        </div>
      </MainLayout>
    </div>
  );
};
