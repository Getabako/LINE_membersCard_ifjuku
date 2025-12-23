import { TimeSlot } from './TimeSlot';
import type { TimeSlot as TimeSlotType } from '../../lib/api';

interface TimeSlotGridProps {
  slots: TimeSlotType[];
  selectedSlot: string | null;
  onSelectSlot: (slotId: string) => void;
  isLoading?: boolean;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-12 bg-gray-100 rounded-button animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        この日の予約枠はありません
      </p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {slots.map((slot) => (
          <TimeSlot
            key={slot.id}
            time={slot.time}
            status={
              slot.id === selectedSlot
                ? 'selected'
                : slot.available
                ? 'available'
                : 'full'
            }
            onClick={() => slot.available && onSelectSlot(slot.id)}
          />
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4 text-caption text-gray-500">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full border border-gray-300" />
          <span>空きあり</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-gray-200" />
          <span>満席</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-line-green" />
          <span>選択中</span>
        </div>
      </div>
    </div>
  );
};
