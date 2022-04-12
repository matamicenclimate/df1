import { useContext, useEffect, useState } from 'react';
import { Button } from '@/componentes/Elements/Button/Button';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Form } from '@/componentes/Form/Form';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { ImageUploader } from '@/componentes/ImageUploader/ImageUploader';
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

const required = false;

export type MinterProps = {
  wallet: Wallet | undefined;
  account: string | undefined;
};

const dialog = Container.get(ProcessDialog);

export const Minter = ({ wallet, account }: MinterProps) => {
  const [checked, setChecked] = useState<boolean>(false);
  const [imageURL, setImageURL] = useState<string>();
  const [dataToPost, setDataToPost] = useState<NFTMetadataBackend | undefined>();
  const [metadataNFT, setMetadataNFT] = useState<metadataNFTType | undefined>();
  const [transaction, setTransaction] = useState<AssetInfo | undefined>();
  const [selectedImage, setSelectedImage] = useState<unknown | any | File>();

  const causeContext = useContext(CauseContext);
  const causes = causeContext?.data;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NFTMetadataBackend>();

  async function mintNFT(meta: metadataNFTType, wallet: Wallet, account: string) {
    const cause = causes?.find((cause) => cause.id === dataToPost?.properties.cause);
    if (cause == null) {
      return alert("Can't send that!");
    }
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
          causeWallet: cause.wallet,
          creatorWallet: account,
          causePercentaje: dataToPost?.properties.causePercentage ?? 30,
          creatorPercentaje: 30,
        });
        console.info('Auction program was created:', tx.data);
        return;
      }
      return console.warn(
        "Can't opt-in this asset: No data returned at creation-time! This is a no-op, but it may indicate a problem."
      );
    });
  }

  const getNFTMetadata = async (data: NFTMetadataBackend) => {
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
        <div className="flex justify-center rounded m-auto">
          <Form
            onSubmit={handleSubmit(formSubmitHandler) as () => Promise<void>}
            className="rounded px-8 pt-6 pb-8 mb-4 min-w-[800px]"
          >
            <h6 className="font-dinpro font-normal text-base py-5">Basic Info</h6>
            <div className="py-6">
              <input
                className="w-full border border-climate-border rounded-xl p-3 shadow"
                id="title"
                type="text"
                placeholder="NFT Title"
                {...register('title', { required })}
              />
              {errors.title && <span className="text-red-500">This field is required</span>}
            </div>
            <div className="py-6">
              <input
                className="w-full border border-climate-border rounded-xl p-3 shadow"
                id="artist"
                type="text"
                placeholder="NFT Creator"
                {...register('author', { required })}
              />
              {errors?.author && <span className="text-red-500">This field is required</span>}
            </div>
            <div className=" py-6">
              <input
                className="w-full shadow appearance-none border border-climate-border rounded-xl p-3"
                id="price"
                type="number"
                placeholder="NFT Price"
                {...register('properties.price', { required })}
              />
              {errors.properties?.price && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
            <div className="flex w-full py-6">
              <div className="w-3/4">
                <select
                  className="text-climate-gray w-full bg-[url('/src/assets/chevronDown.svg')] bg-no-repeat bg-right shadow appearance-none border border-climate-border rounded-xl p-3"
                  {...register('properties.cause', { required })}
                >
                  <option disabled>Cause</option>
                  {causes &&
                    causes?.map((cause) => (
                      <option className="text-climate-black-text" key={cause.id} value={cause.id}>
                        {cause.title}
                      </option>
                    ))}
                </select>
                {errors.properties?.cause && (
                  <span className="text-red-500">You should select a cause</span>
                )}
              </div>
              <div className="ml-2">
                <input
                  className="w-full border border-climate-border rounded-xl p-3 shadow"
                  id="percentage"
                  type="number"
                  placeholder="Cause Percentage"
                  // defaultValue={30}
                  {...register('properties.causePercentage', { required, min: 30, max: 99 })}
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
              <h6 className="font-normal font-dinpro text-base py-5">NFT details</h6>
              <textarea
                className="w-full border border-climate-border rounded-xl p-3"
                id="description"
                placeholder="Description.."
                {...register('description', { required })}
              />
              {errors.description && <span className="text-red-500">This field is required</span>}
            </div>
            <div>
              <div className="flex justify-between">
                <h6 className="font-normal font-dinpro text-base py-5">Upload resources</h6>
                <h6 className="font-dinpro font-normal text-sm text-climate-gray-artist self-center">
                  You can mint jpg, gif, mov, mp4, cad, pdf
                </h6>
              </div>
              <div className="mb-4">
                <Controller
                  control={control}
                  name="properties.file"
                  render={({ field: { value, onChange } }) => (
                    <ImageUploader selectedImage={value ?? null} setSelectedImage={onChange} />
                  )}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <input type="checkbox" onChange={() => setChecked(!checked)} checked={checked} />
                <p className="pl-2 text-climate-gray">
                  I agree to ClimateTrade’s Cookie and Privacy Policy.
                </p>
              </div>
              <Button className="w-48" variant="primary" type="submit" /*disabled={!checked}*/>
                Mint Nft
              </Button>
            </div>
          </Form>
        </div>
      </MainLayout>
    </div>
  );
};
