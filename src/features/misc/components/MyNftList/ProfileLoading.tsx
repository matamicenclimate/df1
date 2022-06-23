import { Button } from '@/componentes/Elements/Button/Button';

export const ProfileLoading = () => (
  <div className="flex p-4 flex-col items-center basis-1/2 shadow-lg rounded-xl bg-white animate-pulse">
    <h5 className="text-lg font-dinpro font-normal rounded w-full bg-climate-action-light">
      &nbsp;
    </h5>
    <p className="text-md m-2 font-normal font-dinpro w-full rounded bg-climate-action-light">
      &nbsp;
    </p>
    <p className="text-sm font-normal font-dinpro w-full rounded bg-climate-action-light">
      <a>&nbsp;</a>
    </p>
    <div className="flex pt-2 justify-evenly w-full">
      <div className=" flex w-full flex-col items-center p-2">
        <div className="bg-climate-action-light w-full rounded">&nbsp;</div>
        <p className="font-sanspro text-xs bg-climate-action-light rounded w-full mt-2">&nbsp;</p>
      </div>
      <div className="flex w-full flex-col items-center p-2">
        <div className="bg-climate-action-light w-full rounded">&nbsp;</div>
        <p className="font-sanspro text-xs bg-climate-action-light rounded w-full mt-2">&nbsp;</p>
      </div>
    </div>
    <div className="p-3 pt-4 w-full">
      <hr />
    </div>
    <div className="flex justify-center w-full">
      <a className="w-full p-1">
        <Button className="m-1 w-full" size="sm">
          &nbsp;
        </Button>
      </a>
      <a className="w-full p-1">
        <Button className="m-1 w-full" size="sm" variant="light">
          &nbsp;
        </Button>
      </a>
    </div>
  </div>
);
