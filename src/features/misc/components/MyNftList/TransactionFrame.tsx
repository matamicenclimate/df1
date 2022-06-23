export function TransactionFrame({
  children,
  className,
  ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return (
    <div className={`basis-2/3 pl-12 ${className ?? ''}`.trim()} {...props}>
      {children}
    </div>
  );
}
