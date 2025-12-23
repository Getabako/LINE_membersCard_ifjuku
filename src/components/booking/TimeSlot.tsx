import { clsx } from 'clsx';

interface TimeSlotProps {
  time: string;
  status: 'available' | 'full' | 'selected';
  onClick: () => void;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({ time, status, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={status === 'full'}
      className={clsx(
        status === 'available' && 'time-slot-available',
        status === 'selected' && 'time-slot-selected',
        status === 'full' && 'time-slot-full'
      )}
    >
      {time}
    </button>
  );
};
