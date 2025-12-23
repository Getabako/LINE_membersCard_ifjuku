import { clsx } from 'clsx';
import { format } from 'date-fns';
import type { PointHistory } from '../../lib/api';

interface PointHistoryItemProps {
  history: PointHistory;
}

export const PointHistoryItem: React.FC<PointHistoryItemProps> = ({ history }) => {
  const isPositive = history.amount > 0;
  const formattedDate = format(new Date(history.createdAt), 'yyyy/MM/dd');
  const formattedAmount = `${isPositive ? '+' : ''}${history.amount.toLocaleString()}`;

  return (
    <div className="list-item">
      <div className="flex-1">
        <p className="text-caption text-gray-400">{formattedDate}</p>
        <p className="text-body">{history.description}</p>
      </div>
      <span
        className={clsx(
          'text-body font-semibold',
          isPositive ? 'points-positive' : 'points-negative'
        )}
      >
        {formattedAmount} pt
      </span>
    </div>
  );
};
