export function ProfileColumn({
  children,
  className,
  ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return (
    <div className={`basis-1/3 pr-12 ${className ?? ''}`.trim()} {...props}>
      {children}
    </div>
  );
}
