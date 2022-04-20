export interface NftCauseProps {
  id: string;
  className?: string;
}

export default function NftCause({ className, id }: NftCauseProps) {
  return <div className={className}>Cause {id}</div>;
}
