import { useNavigate } from 'react-router-dom';
import { HiCheckCircle } from 'react-icons/hi2';
import { Button } from '../../components/common/Button';

export const BookingCompletePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-line-light flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <HiCheckCircle className="w-20 h-20 text-line-green mx-auto mb-4" />
        <h1 className="text-title mb-2">予約が完了しました</h1>
        <p className="text-body text-gray-500 mb-8">
          予約のリマインドはLINEでお知らせします
        </p>

        <div className="space-y-3 w-full max-w-xs mx-auto">
          <Button fullWidth onClick={() => navigate('/bookings')}>
            予約一覧を見る
          </Button>
          <Button variant="secondary" fullWidth onClick={() => navigate('/')}>
            ホームに戻る
          </Button>
        </div>
      </div>
    </div>
  );
};
