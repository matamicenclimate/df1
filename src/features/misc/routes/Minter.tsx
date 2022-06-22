import { useContext, useState } from 'react';
import { Button } from '@/componentes/Elements/Button/Button';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Form } from '@/componentes/Form/Form';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { ImageUploader } from '@/componentes/ImageUploader/ImageUploader';
import { Wallet } from 'algorand-session-wallet';
import { NFTMetadataBackend } from '@/lib/type';
import { InputGenerator } from '@/componentes/InputGenerator/InputGenerator';
import { useCauseContext } from '@/context/CauseContext';
import * as TransactionSigner from '@common/src/services/TransactionSigner';
import SimpleTransactionSigner from '@/service/impl/SimpleTransactionSigner';
import { Some } from '@octantis/option';
import { useTranslation } from 'react-i18next';
import { getNFTMetadata, useMintAction } from '../lib/minting';
import TextInput from '../components/MinterTextInput';
import ErrorHint from '@/componentes/Form/ErrorHint';
import Configuration from '@/context/ConfigContext';
import { TestMint } from '../components/components/TestMint';

export type MinterProps = {
  wallet: Wallet;
  account: string;
};

export const Minter = ({ wallet, account }: MinterProps) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState<boolean>(false);
  const { causes } = useCauseContext();
  const mintNFT = useMintAction(causes);
  const config = useContext(Configuration.Context);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NFTMetadataBackend>();

  const formSubmitHandler: SubmitHandler<NFTMetadataBackend> = async (data: NFTMetadataBackend) => {
    (TransactionSigner.get() as SimpleTransactionSigner).wallet = Some(wallet);
    const meta = await getNFTMetadata(data);
    const info = {
      cause: {
        id: meta.arc69.properties.cause,
        part: meta.arc69.properties.causePercentage,
      },
    };
    mintNFT(meta, info, account);
  };

  return (
    <div>
      <MainLayout>
        <TestMint
          onMint={(data) => {
            formSubmitHandler(data);
          }}
        />
        <div className="flex justify-center rounded m-auto">
          <Form
            onSubmit={handleSubmit(formSubmitHandler) as () => Promise<void>}
            className="rounded px-8 pt-6 pb-8 mb-4 min-w-[800px]"
          >
            <h6 className="font-dinpro font-normal text-base py-5">{t('Minter.basicInfo')}</h6>
            <TextInput id="title" error={errors.title} register={register} />
            <TextInput id="author" error={errors.author} register={register} />
            <TextInput
              id="properties.price"
              error={errors.properties?.price}
              register={register}
              min={1}
              number={'number'}
            />
            <div className="flex w-full py-6">
              <div className="w-3/4">
                <select
                  className="text-climate-gray w-full bg-[url('/src/assets/chevronDown.svg')] bg-no-repeat bg-right shadow appearance-none border border-climate-border rounded-xl p-3"
                  {...register('properties.cause', { required: true })}
                >
                  <option>{t('Minter.nftCause')}</option>
                  {causes?.map((cause) => (
                    <option className="text-climate-black-text" key={cause.id} value={cause.id}>
                      {cause.title}
                    </option>
                  )) ?? null}
                </select>
                <ErrorHint on={errors.properties?.cause} text="Minter.selectCause" />
              </div>
              <div className="ml-2">
                <input
                  className="w-full border border-climate-border rounded-xl p-3 shadow"
                  id="percentage"
                  type="number"
                  placeholder={t('Minter.nftCausePercentage')}
                  {...register('properties.causePercentage', {
                    required: true,
                    valueAsNumber: true,
                    min: config.minBidPart,
                    max: 99,
                  })}
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
                {...register('description', { required: true })}
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
