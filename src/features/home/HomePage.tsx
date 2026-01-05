import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowPath } from 'react-icons/hi2';
import { Header } from '../../components/common/Header';
import { Loading } from '../../components/common/Loading';
import { MemberCard } from '../../components/member/MemberCard';
import { useUserStore } from '../../stores/userStore';
import { isDevMockMode } from '../../lib/liff';
import liff from '@line/liff';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, error, fetchUser } = useUserStore();
  const [debugInfo, setDebugInfo] = useState<string>('');

  const loadUser = useCallback(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    loadUser();
    // デバッグ情報を収集
    try {
      const info = {
        mockMode: isDevMockMode(),
        isInClient: liff.isInClient(),
        isLoggedIn: liff.isLoggedIn(),
        liffId: import.meta.env.VITE_LIFF_ID || 'undefined',
      };
      setDebugInfo(JSON.stringify(info, null, 2));
    } catch (e) {
      setDebugInfo(`Error: ${e}`);
    }
  }, [loadUser]);

  const handleEditClick = () => {
    navigate('/profile/edit');
  };

  if (isLoading) {
    return <Loading fullScreen text="読み込み中..." />;
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {error || 'ユーザー情報の取得に失敗しました'}
          </p>
          <button
            onClick={loadUser}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-green-600 text-white rounded-lg font-medium"
          >
            <HiArrowPath className="w-5 h-5" />
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header title="ベジ楽便" />

      <main className="p-4 pb-8">
        {/* 会員証 */}
        <MemberCard user={user} onEditClick={handleEditClick} />

        {/* デバッグ情報（後で削除） */}
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs font-mono">
          <p className="font-bold mb-1">DEBUG:</p>
          <pre className="whitespace-pre-wrap">{debugInfo}</pre>
        </div>
      </main>
    </div>
  );
};
