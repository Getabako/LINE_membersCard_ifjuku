import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowPath } from 'react-icons/hi2';
import { Loading } from '../../components/common/Loading';
import { MemberCard } from '../../components/member/MemberCard';
import { useUserStore } from '../../stores/userStore';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, error, fetchUser } = useUserStore();

  const loadUser = useCallback(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleEditClick = () => {
    navigate('/profile/edit');
  };

  if (isLoading) {
    return <Loading fullScreen text="読み込み中..." />;
  }

  if (error || !user) {
    return (
      <div className="cyber-bg min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center relative z-10">
          <p className="text-cyan-300 mb-4">
            {error || 'ユーザー情報の取得に失敗しました'}
          </p>
          <button
            onClick={loadUser}
            className="cyber-button flex items-center gap-2 mx-auto rounded-lg"
          >
            <HiArrowPath className="w-5 h-5" />
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return <MemberCard user={user} onEditClick={handleEditClick} />;
};
