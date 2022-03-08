import clsx from 'clsx';

const base = 'rounded-md';

const sizes = {
  sm: 'p-2',
  md: 'p-3',
  lg: 'p-4',
};

const variants = {
  light: 'text-white bg-secondary',
  primary: 'text-white bg-blue-600',
};

const hover = {
  primary:
    'hover:text-gray-300 hover:shadow-inner hover:opacity-75 hover:font-bold hover:text-white',
};

type ButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'submit';
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
  className?: string;
};

export const Button = ({
  onClick,
  size = 'md',
  variant = 'primary',
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      // className={className}
      onClick={onClick}
      className={clsx(base, sizes[size], variants[variant], hover.primary, className)}
      {...props}
    />
  );
};
