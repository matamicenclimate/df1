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
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { diffFrom } from '@common/src/lib/dates';

export type MinterProps = {
  wallet: Wallet;
  account: string;
};

const defaultOffset = 24 * 60 * 60 * 1000;

function bind<A>(dispatch: React.Dispatch<React.SetStateAction<A>>, key: keyof A) {
  return (data: A[typeof key]) => dispatch((old) => ({ ...old, [key]: data }));
}

type Nullable<T> = { [P in keyof T]?: T[P] | null };
type DateErrors = { start?: string; end?: string };
type Dates = { start: Date; end: Date };

export const Minter = ({ wallet, account }: MinterProps) => {
  const { t } = useTranslation();
  const [dates, setDates] = useState<Nullable<Dates>>({
    start: new Date(),
    end: new Date(Date.now() + defaultOffset),
  });
  const [dateErrors, setDateErrors] = useState<DateErrors>({});
  const setStartDate = bind(setDates, 'start');
  const setEndDate = bind(setDates, 'end');
  const [checked, setChecked] = useState<boolean>(false);
  const causeContext = useContext(CauseContext);
  const causes = causeContext?.data;
  const mintNFT = useMintAction(causes);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NFTMetadataBackend>();

  /**
   * This handles the submit of the data.
   */
  const formSubmitHandler: SubmitHandler<NFTMetadataBackend> = async (data: NFTMetadataBackend) => {
    (TransactionSigner.get() as SimpleTransactionSigner).wallet = some(wallet);
    for (const diff of diffFrom(dates.start, dates.end)) {
      if (diff.past || !diff.valid) {
        setDateErrors({});
        if (diff.past) {
          setDateErrors((d) => ({ ...d, start: "Start date can't be in the past." }));
        }
        if (!diff.valid) {
          setDateErrors((d) => ({ ...d, end: 'End date must be later than start date.' }));
        }
        return;
      }
      const meta = await getNFTMetadata(data);
      const info = {
        start: diff.start,
        end: diff.end,
        cause: {
          id: meta.arc69.properties.cause,
          part: meta.arc69.properties.causePercentage,
        },
      };
      mintNFT(meta, info, wallet, account);
    }
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
            <TextInput
              id="properties.price"
              error={errors.properties?.price}
              register={register}
              min={1}
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
                    min: 50,
                    max: 99,
                  })}
                />
                <ErrorHint on={errors.properties?.causePercentage} text="Minter.selectPercentage" />
              </div>
            </div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <div className="flex justify-evenly py-6">
                <div className="flex flex-col w-full mr-1">
                  <label className="font-dinpro font-normal text-base py-3">Auction start</label>
                  <DateTimePicker
                    renderInput={(_) => <TextField {..._} className="bg-white " />}
                    onChange={setStartDate}
                    value={dates.start}
                  />
                  <ErrorHint on={dateErrors.start} text={dateErrors.start ?? ''} />
                </div>
                <div className="flex flex-col w-full ml-1">
                  <label className="font-dinpro font-normal text-base py-3">Auction end</label>
                  <DateTimePicker
                    renderInput={(_) => <TextField {..._} className="bg-white" />}
                    onChange={setEndDate}
                    value={dates.end}
                  />
                  <ErrorHint on={dateErrors.end} text={dateErrors.end ?? ''} />
                </div>
              </div>
            </LocalizationProvider>

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
