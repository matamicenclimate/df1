import clsx from 'clsx';

export interface NftStatusProps {
  status: 'selling' | 'bidding' | 'sold' | 'locked';
  onEdit?: () => void;
  onDuplicate?: () => void;
  onSend?: () => void;
  onDelete?: () => void;
  className?: string;
}

export default function NftStatus({ status, className }: NftStatusProps) {
  return (
    <div className={clsx('flex justify-between items-center', className)}>
      <div className="p-1 pl-4 pr-4 rounded-md bg-climate-informative-green bg-opacity-10 text-climate-informative-green">
        {status}
      </div>
      <button className="text-xl font-bold">...</button>
    </div>
  );
}
