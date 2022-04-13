export interface NftNameProps {
  title: string;
  id: string;
  thumbnail?: string;
}

export default function NftName({ title, id, thumbnail }: NftNameProps) {
  return (
    <div className="flex">
      <div className="mr-2 bg-climate-gray-light rounded-lg w-10 h-10">&nbsp;</div>
      <div className="flex flex-col">
        <div>{title}</div>
        <div className="text-climate-gray-light">#{id}</div>
      </div>
    </div>
  );
}
