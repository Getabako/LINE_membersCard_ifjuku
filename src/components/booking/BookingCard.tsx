import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { HiCalendar } from 'react-icons/hi2';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import type { Booking } from '../../lib/api';

interface BookingCardProps {
  booking: Booking;
  onEdit?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onEdit,
  onCancel,
  showActions = true,
}) => {
  const formattedDate = format(new Date(booking.date), 'yyyy/MM/dd（E）', { locale: ja });
  const isCancelled = booking.status === 'CANCELLED';
  const isCompleted = booking.status === 'COMPLETED';

  return (
    <Card className={isCancelled ? 'opacity-50' : ''}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-line-green/10 rounded-lg">
          <HiCalendar className="w-6 h-6 text-line-green" />
        </div>
        <div className="flex-1">
          <p className="text-body font-medium">
            {formattedDate} {booking.timeSlot}
          </p>
          <p className="text-caption text-gray-500">{booking.title}</p>
          {isCancelled && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-600 text-caption rounded">
              キャンセル済み
            </span>
          )}
          {isCompleted && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-600 text-caption rounded">
              完了
            </span>
          )}
        </div>
      </div>

      {showActions && !isCancelled && !isCompleted && (
        <div className="flex gap-2 mt-4">
          <Button variant="secondary" size="sm" onClick={onEdit} className="flex-1">
            変更
          </Button>
          <Button variant="danger" size="sm" onClick={onCancel} className="flex-1">
            キャンセル
          </Button>
        </div>
      )}
    </Card>
  );
};
