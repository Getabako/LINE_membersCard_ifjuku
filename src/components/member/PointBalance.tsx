import { clsx } from 'clsx';

interface PointBalanceProps {
  points: number;
  size?: 'sm' | 'lg';
  expiryDate?: string;
}

export const PointBalance: React.FC<PointBalanceProps> = ({
  points,
  size = 'lg',
  expiryDate,
}) => {
  const formattedPoints = points.toLocaleString();

  return (
    <div className="flex items-baseline gap-1">
      <span className="text-lg">🎯</span>
      <span
        className={clsx(
          'font-bold text-line-green',
          size === 'lg' ? 'text-points' : 'text-xl'
        )}
      >
        {formattedPoints}
      </span>
      <span className="text-body text-gray-500">pt</span>
      {expiryDate && (
        <span className="ml-2 text-caption text-gray-400">
          有効期限: {expiryDate}
        </span>
      )}
    </div>
  );
};
