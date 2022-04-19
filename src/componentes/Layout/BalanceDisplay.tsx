import { WalletFunds } from '@/context/WalletFundsContext';
import clsx from 'clsx';
import algoLogo from '../../assets/algoLogo.svg';

export default function BalanceDisplay({
  wallet,
  funds,
}: {
  wallet?: string;
  funds: WalletFunds | null;
}) {
  const hide = funds == null || (wallet?.length ?? 0) === 0;
  return (
    <div className={clsx('mr-7', hide && 'hidden')}>
      <div className="flex justify-center">
        <h6 className="font-normal text-climate-blue font-dinpro text-base mr-2">
          {funds?.balanceAlgo ?? '--'}
        </h6>
        <img className="w-4 h-4" src={algoLogo} alt="algoLogo" />
      </div>
      <div className="flex justify-center">
        <h6 className="font-normal text-climate-blue font-dinpro text-base mr-3 self-center">
          {funds?.balanceAlgoUSD ?? '--'}
        </h6>
        <span className="text-xl text-climate-blue">$</span>
      </div>
    </div>
  );
}
