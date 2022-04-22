import { useContext, useEffect, useState } from 'react';
import { Button } from '@/componentes/Elements/Button/Button';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Form } from '@/componentes/Form/Form';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { ImageUploader } from '@/componentes/ImageUploader/ImageUploader';
import { Wallet } from 'algorand-session-wallet';
import { NFTMetadataBackend, metadataNFTType } from '@/lib/type';
import { InputGenerator } from '@/componentes/InputGenerator/InputGenerator';
import { CauseContext } from '@/context/CauseContext';
import * as TransactionSigner from '@common/src/services/TransactionSigner';
import SimpleTransactionSigner from '@/service/impl/SimpleTransactionSigner';
import { some } from '@octantis/option';
import { useTranslation } from 'react-i18next';
import { getNFTMetadata, useMintAction } from '../lib/minting';
import TextInput from '../components/MinterTextInput';
import ErrorHint from '@/componentes/Form/ErrorHint';

const required = false;

export type MinterProps = {
  wallet: Wallet;
  account: string;
};

export const Minter = ({ wallet, account }: MinterProps) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState<boolean>(false);
  const [dataToPost, setDataToPost] = useState<NFTMetadataBackend | undefined>();
  const [metadataNFT, setMetadataNFT] = useState<metadataNFTType | undefined>();
  const causeContext = useContext(CauseContext);
  const causes = causeContext?.data;
  const mintNFT = useMintAction(causes, dataToPost);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NFTMetadataBackend>();

  async function handleUpload() {
    if (dataToPost) {
      setMetadataNFT(await getNFTMetadata(dataToPost));
    }
  }
  useEffect(() => {
    handleUpload();
  }, [dataToPost]);

  useEffect(() => {
    (TransactionSigner.get() as SimpleTransactionSigner).wallet = some(wallet);
    if (metadataNFT) {
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
            <h6 className="font-dinpro font-normal text-base py-5">{t('Minter.basicInfo')}</h6>
            <TextInput id="title" error={errors.title} register={register} />
            <TextInput id="author" error={errors.author} register={register} />
            <TextInput id="properties.price" error={errors.properties?.price} register={register} />
            <div className="flex w-full py-6">
              <div className="w-3/4">
                <select
                  className="text-climate-gray w-full bg-[url('/src/assets/chevronDown.svg')] bg-no-repeat bg-right shadow appearance-none border border-climate-border rounded-xl p-3"
                  {...register('properties.cause', { required })}
                >
                  <option disabled>{t('Minter.nftCause')}</option>
                  {causes &&
                    causes?.map((cause) => (
                      <option className="text-climate-black-text" key={cause.id} value={cause.id}>
                        {cause.title}
                      </option>
                    ))}
                </select>
                <ErrorHint on={errors.properties?.cause} text="Minter.selectCause" />
              </div>
              <div className="ml-2">
                <input
                  className="w-full border border-climate-border rounded-xl p-3 shadow"
                  id="percentage"
                  type="number"
                  placeholder={t('Minter.nftCausePercentage')}
                  // defaultValue={30}
                  {...register('properties.causePercentage', { required, min: 30, max: 99 })}
                />
                <ErrorHint on={errors.properties?.causePercentage} text="Minter.selectPercentage" />
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
              <h6 className="font-normal font-dinpro text-base py-5">{t('Minter.nftDetails')}</h6>
              <textarea
                className="w-full border border-climate-border rounded-xl p-3"
                id="description"
                placeholder={t('Minter.nftDescription')}
                {...register('description', { required })}
              />
              <ErrorHint on={errors.description} text="Minter.fieldRequired" />
            </div>
            <div>
              <div className="flex justify-between">
                <h6 className="font-normal font-dinpro text-base py-5">
                  {t('Minter.uploadResources')}
                </h6>
                <h6 className="font-dinpro font-normal text-sm text-climate-gray-artist self-center">
                  {t('Minter.uploadFile')}
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
                <p className="pl-2 text-climate-gray">{t('Minter.agreeConditions')}</p>
              </div>
              <Button className="w-48" variant="primary" type="submit" disabled={!checked}>
                Mint Nft
              </Button>
            </div>
          </Form>
        </div>
      </MainLayout>
    </div>
  );
};
