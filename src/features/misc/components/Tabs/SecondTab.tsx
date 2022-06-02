import { useState } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { diffFrom } from '@common/src/lib/dates';
import ErrorHint from '@/componentes/Form/ErrorHint';

import './mycssfile.css';
import { Button } from '@/componentes/Elements/Button/Button';

const defaultOffset = 24 * 60 * 60 * 1000;

function bind<A>(dispatch: React.Dispatch<React.SetStateAction<A>>, key: keyof A) {
  return (data: A[typeof key]) => dispatch((old) => ({ ...old, [key]: data }));
}

type Nullable<T> = { [P in keyof T]?: T[P] | null };
type DateErrors = { start?: string; end?: string };
type Dates = { start: Date; end: Date };

const SecondTab = () => {
  const [dateErrors, setDateErrors] = useState<DateErrors>({});
  const [dates, setDates] = useState<Nullable<Dates>>({
    start: new Date(),
    end: new Date(Date.now() + defaultOffset),
  });
  const setStartDate = bind(setDates, 'start');
  const setEndDate = bind(setDates, 'end');
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
        <Button>Confirm</Button>
      </div>
    </div>
  );
};
export default SecondTab;
