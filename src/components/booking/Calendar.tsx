import { useState } from 'react';
import { clsx } from 'clsx';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

interface CalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onSelectDate,
  minDate: _minDate = new Date(),
  maxDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const renderDays = () => {
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      const currentDay = day;
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isSelected = selectedDate && isSameDay(day, selectedDate);
      const isTodayDate = isToday(day);
      const isPast = isBefore(day, new Date(new Date().setHours(0, 0, 0, 0)));
      const isDisabled = isPast || (maxDate && day > maxDate);

      days.push(
        <button
          key={day.toISOString()}
          onClick={() => !isDisabled && onSelectDate(currentDay)}
          disabled={isDisabled}
          className={clsx(
            'calendar-day',
            !isCurrentMonth && 'text-gray-300',
            isDisabled && 'calendar-day-disabled',
            isSelected && 'calendar-day-selected',
            isTodayDate && !isSelected && 'calendar-day-today',
            !isDisabled && !isSelected && 'calendar-day-active'
          )}
        >
          {format(day, 'd')}
        </button>
      );

      day = addDays(day, 1);
    }

    return days;
  };

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="bg-white rounded-card p-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-100 touch-feedback"
          aria-label="前の月"
        >
          <HiChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-section">
          {format(currentMonth, 'yyyy年M月', { locale: ja })}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100 touch-feedback"
          aria-label="次の月"
        >
          <HiChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 曜日 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={clsx(
              'text-center text-caption font-medium py-2',
              index === 0 && 'text-red-500',
              index === 6 && 'text-blue-500'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日付 */}
      <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
    </div>
  );
};
