import { clsx } from 'clsx';

interface CardProps {
  variant?: 'default' | 'elevated';
  padding?: 'sm' | 'md' | 'lg' | 'none';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  className,
  onClick,
}) => {
  const variants = {
    default: 'shadow-card',
    elevated: 'shadow-elevated',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={clsx(
        'bg-white rounded-card',
        variants[variant],
        paddings[padding],
        onClick && 'cursor-pointer hover:shadow-elevated transition-shadow',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
