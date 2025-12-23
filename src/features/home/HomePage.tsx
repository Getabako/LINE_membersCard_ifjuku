import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiClipboardDocumentList, HiCalendarDays, HiListBullet } from 'react-icons/hi2';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Loading } from '../../components/common/Loading';
import { MemberCard } from '../../components/member/MemberCard';
import { useUserStore } from '../../stores/userStore';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoading) {
    return <Loading fullScreen text="読み込み中..." />;
  }

  if (!user) {
    return <Loading fullScreen text="ユーザー情報を取得中..." />;
  }

  return (
    <div className="min-h-screen bg-line-light">
      <Header title="オンライン学習塾" showSettings />

      <main className="p-4 pb-8 space-y-6">
        {/* 会員証 */}
        <MemberCard user={user} />

        {/* アクションボタン */}
        <div className="grid grid-cols-2 gap-4">
          <Card
            onClick={() => navigate('/points')}
            className="flex flex-col items-center py-6 cursor-pointer"
          >
            <HiClipboardDocumentList className="w-8 h-8 text-line-green mb-2" />
            <span className="text-body font-medium">ポイント履歴</span>
          </Card>

          <Card
            onClick={() => navigate('/booking')}
            className="flex flex-col items-center py-6 cursor-pointer"
          >
            <HiCalendarDays className="w-8 h-8 text-line-green mb-2" />
            <span className="text-body font-medium">予約する</span>
          </Card>
        </div>

        {/* 予約一覧リンク */}
        <Card onClick={() => navigate('/bookings')} className="cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HiListBullet className="w-6 h-6 text-gray-500" />
              <span className="text-body">予約一覧を見る</span>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </Card>
      </main>
    </div>
  );
};
