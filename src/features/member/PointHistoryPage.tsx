import { useEffect } from 'react';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Loading } from '../../components/common/Loading';
import { PointBalance } from '../../components/member/PointBalance';
import { PointHistoryItem } from '../../components/member/PointHistoryItem';
import { useUserStore } from '../../stores/userStore';

export const PointHistoryPage: React.FC = () => {
  const { user, pointHistory, isLoading, fetchUser, fetchPointHistory } = useUserStore();

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
    fetchPointHistory();
  }, [user, fetchUser, fetchPointHistory]);

  if (isLoading || !user) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-line-light">
      <Header title="ポイント履歴" showBack />

      <main className="p-4 space-y-4">
        {/* 現在のポイント */}
        <Card className="text-center">
          <p className="text-caption text-gray-500 mb-2">現在のポイント</p>
          <PointBalance points={user.points} size="lg" />
        </Card>

        {/* 履歴 */}
        <Card>
          <h2 className="text-section mb-2">履歴</h2>
          {pointHistory.length > 0 ? (
            <div>
              {pointHistory.map((history) => (
                <PointHistoryItem key={history.id} history={history} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">履歴はありません</p>
          )}
        </Card>
      </main>
    </div>
  );
};
