export interface NftStatusProps {
  status: 'selling' | 'bidding' | 'sold' | 'locked';
  onEdit?: () => void;
  onDuplicate?: () => void;
  onSend?: () => void;
  onDelete?: () => void;
}

export default function NftStatus({ status }: NftStatusProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="p-1 pl-4 pr-4 rounded-md bg-climate-informative-green bg-opacity-10 text-climate-informative-green">
        {status}
      </div>
      <button className="text-xl font-bold">...</button>
    </div>
  );
}
