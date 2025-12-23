import { clsx } from 'clsx';
import { HiArrowPath } from 'react-icons/hi2';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  children,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-button transition-all duration-200 touch-feedback';

  const variants = {
    primary: 'bg-line-green text-white hover:bg-line-green-dark active:scale-[0.98]',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:scale-[0.98]',
    danger: 'bg-error text-white hover:bg-red-600 active:scale-[0.98]',
    ghost: 'bg-transparent text-line-green hover:bg-line-green/10',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-3 text-body min-h-touch',
    lg: 'px-6 py-4 text-base min-h-[56px]',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <HiArrowPath className="w-5 h-5 mr-2 animate-spin" />}
      {children}
    </button>
  );
};
