import clsx from 'clsx';

export interface NftNameProps {
  title: string;
  id: string;
  thumbnail?: string;
  className?: string;
}

export default function NftName({ title, id, className, thumbnail }: NftNameProps) {
  return (
    <div className={clsx('flex', className)}>
      <div
        className="mr-2 bg-climate-gray-light rounded-lg w-10 h-10 bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url('${thumbnail}')`,
        }}
      >
        &nbsp;
      </div>
      <div className="flex flex-col">
        <div>{title}</div>
        <div className="text-climate-gray-light">
          <a target="_blank" rel="noreferrer" href={`https://testnet.algoexplorer.io/asset/${id}`}>
            #{id}
          </a>
        </div>
      </div>
    </div>
  );
}
