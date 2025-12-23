import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiPlus } from 'react-icons/hi2';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';
import { Modal } from '../../components/common/Modal';
import { BookingCard } from '../../components/booking/BookingCard';
import { useBookingStore } from '../../stores/bookingStore';

export const BookingListPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, isLoading, fetchBookings, cancelBooking } = useBookingStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const now = new Date();
  const upcomingBookings = bookings.filter(
    (b) => new Date(b.date) >= now && b.status === 'CONFIRMED'
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.date) < now || b.status !== 'CONFIRMED'
  );

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const handleCancel = async () => {
    if (!cancelTarget) return;

    setIsCancelling(true);
    try {
      await cancelBooking(cancelTarget);
      setCancelTarget(null);
    } catch (error) {
      alert('キャンセルに失敗しました');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-line-light flex flex-col">
      <Header title="予約一覧" showBack />

      <main className="flex-1 p-4 space-y-4">
        {/* タブ */}
        <div className="tab-bar">
          <button
            className={activeTab === 'upcoming' ? 'tab-item-active' : 'tab-item-inactive'}
            onClick={() => setActiveTab('upcoming')}
          >
            予定 ({upcomingBookings.length})
          </button>
          <button
            className={activeTab === 'past' ? 'tab-item-active' : 'tab-item-inactive'}
            onClick={() => setActiveTab('past')}
          >
            過去
          </button>
        </div>

        {/* 予約リスト */}
        {displayedBookings.length > 0 ? (
          <div className="space-y-3">
            {displayedBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onEdit={() => navigate(`/booking?edit=${booking.id}`)}
                onCancel={() => setCancelTarget(booking.id)}
                showActions={activeTab === 'upcoming'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            {activeTab === 'upcoming' ? '予定の予約はありません' : '過去の予約はありません'}
          </div>
        )}
      </main>

      {/* 新規予約ボタン */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200">
        <Button fullWidth onClick={() => navigate('/booking')}>
          <HiPlus className="w-5 h-5 mr-2" />
          新しい予約を追加
        </Button>
      </div>

      {/* キャンセル確認モーダル */}
      <Modal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="予約をキャンセルしますか？"
        actions={
          <>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setCancelTarget(null)}
            >
              戻る
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              loading={isCancelling}
              onClick={handleCancel}
            >
              キャンセル
            </Button>
          </>
        }
      >
        <p className="text-center text-body text-gray-600">
          この操作は取り消せません
        </p>
      </Modal>
    </div>
  );
};
