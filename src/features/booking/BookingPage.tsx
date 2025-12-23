import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { Calendar } from '../../components/booking/Calendar';
import { TimeSlotGrid } from '../../components/booking/TimeSlotGrid';
import { useBookingStore } from '../../stores/bookingStore';

export const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    selectedDate,
    selectedSlot,
    slots,
    isSlotsLoading,
    setSelectedDate,
    setSelectedSlot,
    createBooking,
  } = useBookingStore();

  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot) return;

    setIsSubmitting(true);
    try {
      await createBooking();
      navigate('/booking/complete');
    } catch (error) {
      alert(error instanceof Error ? error.message : '予約に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = selectedDate && selectedSlot && !isSubmitting;

  return (
    <div className="min-h-screen bg-line-light flex flex-col">
      <Header title="授業を予約する" showBack />

      <main className="flex-1 p-4 space-y-6">
        {/* カレンダー */}
        <section>
          <h2 className="text-section mb-3 flex items-center gap-2">
            📅 日付を選択
          </h2>
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </section>

        {/* 時間枠 */}
        {selectedDate && (
          <section className="animate-fade-in">
            <h2 className="text-section mb-3 flex items-center gap-2">
              🕐 時間帯を選択
              <span className="text-caption text-gray-500 font-normal">
                ({format(selectedDate, 'M/d（E）', { locale: ja })})
              </span>
            </h2>
            <TimeSlotGrid
              slots={slots}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
              isLoading={isSlotsLoading}
            />
          </section>
        )}
      </main>

      {/* 確認ボタン */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200">
        <Button
          fullWidth
          disabled={!canSubmit}
          loading={isSubmitting}
          onClick={handleConfirm}
        >
          予約を確認する
        </Button>
      </div>
    </div>
  );
};
