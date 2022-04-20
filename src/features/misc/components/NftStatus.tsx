import clsx from 'clsx';

export interface NftStatusProps {
  status: 'selling' | 'bidding' | 'sold' | 'locked';
  onEdit?: () => void;
  onDuplicate?: () => void;
  onSend?: () => void;
  onDelete?: () => void;
  className?: string;
}

const colors = {
  bidding: 'climate-informative-green',
  sold: 'climate-informative-yellow',
} as ByStatus;

const text = {
  bidding: 'Auction Open',
  sold: 'Auction Ended',
} as ByStatus;

type ByStatus = { [D in NftStatusProps['status']]: string };

export default function NftStatus({ status, className }: NftStatusProps) {
  const color = colors[status];
  return (
    <div className={clsx('flex justify-between items-center', className)}>
      <div
        className={clsx('p-1 pl-4 pr-4 rounded-md bg-opacity-10', `bg-${color}`, `text-${color}`)}
      >
        {text[status] ?? status}
      </div>
      <button className="text-xl font-bold">...</button>
    </div>
  );
}
