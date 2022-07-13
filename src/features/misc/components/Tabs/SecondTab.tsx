import { useContext, useState } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { diffFrom } from '@common/src/lib/dates';
import ErrorHint from '@/componentes/Form/ErrorHint';
import { useTranslation } from 'react-i18next';
import './mycssfile.css';
import { Button } from '@/componentes/Elements/Button/Button';
import Container from 'typedi';
import ProcessDialog from '@/service/ProcessDialog';
import NetworkClient from '@common/src/services/NetworkClient';
import { AuctionLogic } from '@common/src/services/AuctionLogic';
import { AssetEntity, Nft } from '@common/src/lib/api/entities';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import algosdk from 'algosdk';
import { WalletContext } from '@/context/WalletContext';

const defaultOffset = 24 * 60 * 60 * 1000;

function bind<A>(dispatch: React.Dispatch<React.SetStateAction<A>>, key: keyof A) {
  return (data: A[typeof key]) => dispatch((old) => ({ ...old, [key]: data }));
}

type Nullable<T> = { [P in keyof T]?: T[P] | null };
type DateErrors = { start?: string; end?: string };
type Dates = { start: Date; end: Date };

/** Quick nemonic validation for two dates (difference check). */
function validateDates(dates: Nullable<Dates>): true | 'past' | 'reverse' | 'invalid' {
  for (const diff of diffFrom(dates.start, dates.end)) {
    if (diff.past || !diff.valid) {
      if (diff.past) {
        return 'past';
      }
      if (!diff.valid) {
        return 'reverse';
      }
    }
    return true;
  }
  return 'invalid';
}

type SecondTabProps = {
  nft: Nft | AssetEntity;
  assetId: number;
  causePercentage: number;
  creatorWallet: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SecondTab = ({ creatorWallet, causePercentage, assetId, setIsOpen }: SecondTabProps) => {
  const { t } = useTranslation();
  const walletCtx = useContext(WalletContext);
  const [dateErrors, setDateErrors] = useState<DateErrors>({});
  const [dates, setDates] = useState<Nullable<Dates>>({
    start: new Date(),
    end: new Date(Date.now() + defaultOffset),
  });
  const goToPage = useNavigate();
  const setStartDate = bind(setDates, 'start');
  const setEndDate = bind(setDates, 'end');

  async function handleCreateAuction(
    assetId: number,
    dates: Nullable<Dates>,
    creatorWallet: string,
    causePercentage: number,
    goToPage: NavigateFunction
  ) {
    const dialog = Container.get(ProcessDialog);
    const auctions = Container.get(AuctionLogic);
    const net = Container.get(NetworkClient);
    return await dialog.process(async function () {
      this.title = 'Processing auction creation';
      // this.message = 'Opting in...';
      // const optResult = await net.core.post('opt-in', { assetId });
      // console.info('Asset opted-in:', optResult);
      // const transfer = await auctions.makeTransferToAccount(
      // optResult.data.targetAccount,
      // assetId,
      // new Uint8Array()
      // );
      // console.info('Asset transfer to app:', transfer);
      if (dates.start == null || dates.end == null) {
        throw new Error("Can't start auction creation process: Dates were undefined!");
      }
      const {
        data: {
          appIndex,
          unsignedTxnGroup: { encodedOpnInTxn, ...otherTxn },
        },
      } = await net.core.post('create-listing', {
        assetId,
        creatorWallet,
        type: 'auction',
        causePercentage,
        startDate: dates.start.toISOString(),
        endDate: dates.end.toISOString(),
      });
      this.message = 'Creating auction...';
      const tx = algosdk.decodeUnsignedTransaction(Buffer.from(encodedOpnInTxn, 'base64'));
      const wallet = walletCtx?.userWallet?.wallet;
      if (wallet == null) {
        throw new Error('Invalid app state!');
      }
      tx.from = algosdk.decodeAddress(wallet.getDefaultAccount());
      console.log('Signing transaction of:', tx);
      const [stx] = await wallet.signTxn([tx]);
      const res = await net.core.post('finish-create-listing', {
        appIndex,
        type: 'auction',
        signedTxn: {
          ...otherTxn,
          signedOpnInTxn: Buffer.from(stx.blob).toString('base64'),
        },
      });
      // const tx = await net.core.post('create-auction', {
      //   assetId: assetId,
      //   creatorWallet: creatorWallet,
      //   causePercentage: causePercentage ?? 50,
      //   startDate: dates.start.toISOString(),
      //   endDate: dates.end.toISOString(),
      // });
      console.info('Auction program was created:', res.data);
      if (res.data.appIndex) {
        this.title = t('Minter.dialog.dialogNFTListedSuccess');
        this.message = '';
        goToPage(`/nft/${assetId}`);
        await new Promise((r) => setTimeout(r, 5000));
      }
    });
  }

  async function handleConfirm() {
    const result = validateDates(dates);
    if (result === true) {
      setIsOpen(false);
      await handleCreateAuction(assetId, dates, creatorWallet, causePercentage, goToPage);
      return;
    }
    setDateErrors({});
    switch (result) {
      case 'invalid':
        setDateErrors({ start: 'Not a valid input!' });
        break;
      case 'past':
        setDateErrors((d) => ({ ...d, start: "Start date can't be in the past." }));
        break;
      case 'reverse':
        setDateErrors((d) => ({ ...d, end: 'End date must be later than start date.' }));
        break;
    }
  }
  return (
    <div className="SecondTab">
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
      <div className=" mt-6 text-right">
        <Button onClick={handleConfirm}>Confirm</Button>
      </div>
    </div>
  );
};
export default SecondTab;
