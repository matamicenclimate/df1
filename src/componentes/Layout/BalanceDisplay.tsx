import clsx from 'clsx';
import algoLogo from '../../assets/algoLogo.svg';

export default function BalanceDisplay({
  wallet,
  balanceAlgo,
  balanceAlgoUSD,
}: {
  wallet?: string;
  balanceAlgo: number | null | undefined;
  balanceAlgoUSD: number | null | undefined;
}) {
  const hide = balanceAlgo == null || (wallet?.length ?? 0) === 0;
  return (
    <div className={clsx('mr-7', hide && 'hidden')}>
      <div className="flex justify-center">
        <h6 className="font-normal text-white font-inter text-base mr-2">{balanceAlgo ?? '--'}</h6>
        <img className="w-4 h-4" src={algoLogo} alt="algoLogo" />
      </div>
      <div className="flex justify-center">
        <h6 className="font-normal text-white font-inter text-base mr-3 self-center">
          {balanceAlgoUSD ?? '--'}
        </h6>
        <span className="text-xl text-white">$</span>
      </div>
    </div>
  );
}
