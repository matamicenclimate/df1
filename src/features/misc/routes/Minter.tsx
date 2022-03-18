import { useContext, useEffect, useState } from 'react';
import algosdk from 'algosdk';
import { Button } from '@/componentes/Elements/Button/Button';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Form } from '@/componentes/Form/Form';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { Wallet } from 'algorand-session-wallet';
import { httpClient } from '@/lib/httpClient';
import { Dialog } from '@/componentes/Dialog/Dialog';
import { createNFT } from '@/lib/nft';
import { NFTMetadataBackend, metadataNFTType, assetInfoType } from '@/lib/type';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { InputGenerator, InputGeneratorType } from '@/componentes/InputGenerator/InputGenerator';
import { CauseContext } from '@/context/CauseContext';
import { setupClient } from '@/lib/algorand';
import { DeleteAsset } from '@/componentes/DeleteAsset/DeleteAsset';
import Container from 'typedi';
import OptInService from '@common/src/services/OptInService';

export type MinterProps = {
  wallet: Wallet | undefined;
  account: string | undefined;
};

export const Minter = ({ wallet, account }: MinterProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const [selectedImage, setSelectedImage] = useState<File>();
  // console.log('selectedImage from minter', selectedImage);

  const [uploadingIPFS, setUploadingToIPFS] = useState(false);
  const [uploadingToBlock, setUploadingToBlock] = useState(false);
  const [imageURL, setImageURL] = useState<string>();
  const [dataToPost, setDataToPost] = useState<NFTMetadataBackend | undefined>();
  const [metadataNFT, setMetadataNFT] = useState<metadataNFTType | undefined>();
  const [transaction, setTransaction] = useState<assetInfoType | undefined>();

  const causeContext = useContext(CauseContext);
  const data = causeContext?.data;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NFTMetadataBackend>();

  async function mintNFT(metadat: metadataNFTType, wallet: Wallet, account: string) {
    const algodClient = await setupClient();
    console.log('algodClient from Minter', algodClient);

    // const algodClient = new algosdk.Algodv2(token, server, port);
    setUploadingToBlock(true);
    setImageURL(metadat.image_url);

    const result = await createNFT(algodClient, account, metadat, wallet);
    const opt = Container.get(OptInService);
    setTransaction(result);
    setUploadingToBlock(false);
    if (result == null) {
      return console.warn(
        "Can't opt-in this asset: No data returned at creation-time! This is a no-op, but it may indicate a problem."
      );
    }
    const optResult = await opt.optInAssetByID(result.assetID);
    console.info('Asset opted-in:', optResult);
  }

  const getNFTMetadata = async (data: NFTMetadataBackend) => {
    const filelist: any = data.file;
    const oneFile: File = filelist[0];
    console.log('oneFile', oneFile);

    const attribute = data.properties?.attributes?.reduce(
      // (acc: Record<string, any>, curr: InputGeneratorType['inputList'][0]) => {
      (acc: Record<string, any>, curr: InputGeneratorType['inputList'][0]) => {
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
    setMetadataNFT(res.data as metadataNFTType);
    setUploadingToIPFS(false);
  };

  useEffect(() => {
    if (dataToPost) {
      setUploadingToIPFS(true);
      getNFTMetadata(dataToPost);
    }
  }, [dataToPost]);

  useEffect(() => {
    // if (metadataNFT && wallet.isDefined() && account.isDefined()) {
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
        <DeleteAsset account={account} />
        {transaction && (
          <div className="text-center">
            <h2 className="font-bold text-2xl">Your Transaction and Asset</h2>
            <h2 className="font-bold cursor-pointer hover:text-gray-600">
              <a href={`https://testnet.algoexplorer.io/tx/${transaction.transactionId}`}>
                Transaction ID: {transaction.transactionId}
              </a>
            </h2>
            <h2 className="font-bold cursor-pointer hover:text-gray-600">
              Asset ID:{' '}
              <a href={`https://testnet.algoexplorer.io/asset/${transaction.assetID}`}>
                {transaction.assetID}
              </a>
            </h2>
            {imageURL && (
              <div className="flex justify-center">
                <img className="w-40 h-40" src={imageURL} />
              </div>
            )}
          </div>
        )}
        {uploadingIPFS && (
          <Dialog isOpen={uploadingIPFS} setIsOpen={setIsOpen} title={'Uploading file to IPFS...'}>
            <div className="flex justify-center mt-3">
              <Spinner size="lg" />
            </div>
          </Dialog>
        )}
        {uploadingToBlock && (
          <Dialog
            isOpen={uploadingToBlock}
            setIsOpen={setIsOpen}
            title={'Uploading transaction to Algorand blockchain...'}
          >
            <div className="flex justify-center mt-3">
              <Spinner size="lg" />
            </div>
          </Dialog>
        )}
        <div className="flex justify-center h-screen rounded m-auto">
          <Form
            onSubmit={handleSubmit(formSubmitHandler)}
            className="rounded px-8 pt-6 pb-8 mb-4 md:max-h-[40rem]"
          >
            <div className="mb-4">
              <label
                className="block text-custom-white md:text-gray-700 text-sm font-bold mb-2"
                htmlFor="file"
              >
                Select File
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-custom-white md:text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="file"
                type="file"
                {...register('file', { required: true })}
              />
              {errors?.file && <span className="text-red-500">This field is required</span>}
            </div>
            <div>
              <label
                className="block text-custom-white md:text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <input
                className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 md:text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
            <Button type="submit">Mint Nft</Button>
          </Form>
        </div>
      </MainLayout>
    </div>
  );
};
