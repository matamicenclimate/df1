import clsx from 'clsx';

const base = 'rounded-lg';

const sizes = {
  sm: 'p-2',
  md: 'p-3',
  lg: 'p-4',
};

const variants = {
  light: 'text-climate-gray font-semibold bg-climate-action-light',
  primary: 'text-climate-white bg-climate-blue',
  delete: 'text-white bg-red-800',
};

const hover = {
  primary:
    'hover:text-gray-300 hover:shadow-inner hover:opacity-75 hover:font-bold hover:text-white',
};

type ButtonProps = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  type?: 'submit';
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
  className?: string;
  disabled?: boolean;
};

export const Button = ({
  onClick,
  size = 'md',
  variant = 'primary',
  disabled = false,
  className,
  ...props
}: ButtonProps) => {
  const disabledClass = disabled
    ? clsx('bg-climate-gray-light', 'hover:bg-climate-gray-light', 'cursor-not-allowed')
    : '';
  return (
    <>
      <button
        disabled={disabled}
        onClick={disabled ? undefined : onClick}
        className={clsx(
          base,
          sizes[size],
          variants[variant],
          disabled ? undefined : hover.primary,
          disabledClass,
          className
        )}
        {...props}
      />
    </>
  );
};
