import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import type { User } from '../../lib/api';
import { FAVORITE_ACTIVITIES, getGoalNameById } from '../../lib/activities';

interface MemberCardProps {
  user: User;
  onEditClick?: () => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ user, onEditClick }) => {
  const activityNames = user.favoriteActivities
    ?.map(activityId => FAVORITE_ACTIVITIES.find(a => a.id === activityId)?.name)
    .filter(Boolean) || [];

  const futureGoalName = user.futureGoal ? getGoalNameById(user.futureGoal) : null;

  const needsSetup = !user.futureGoal || user.favoriteActivities.length === 0;

  return (
    <div className="cyber-bg min-h-screen w-full flex flex-col relative">
      {/* コンテンツ */}
      <div className="relative z-10 flex flex-col min-h-screen px-4 py-6">
        {/* ロゴ・タイトル */}
        <div className="text-center mb-6">
          <img
            src="/logo.png"
            alt="if(塾)"
            className="h-20 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]"
          />
          <p className="text-cyan-400 text-sm tracking-[0.3em] mt-1">
            MEMBERSHIP CARD
          </p>
        </div>

        {/* ユーザー情報 */}
        <div className="flex items-center gap-4 mb-6">
          {user.pictureUrl ? (
            <img
              src={user.pictureUrl}
              alt={user.displayName}
              className="w-14 h-14 rounded-full object-cover border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/30"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-cyan-900/50 flex items-center justify-center border-2 border-cyan-400/50">
              <FontAwesomeIcon icon={faUser} className="text-xl text-cyan-400" />
            </div>
          )}
          <h2 className="text-2xl font-bold text-white tracking-wide">
            {user.displayName}
          </h2>
        </div>

        {/* 会員番号カード */}
        <div className="qr-container rounded-xl p-4 mb-6">
          <p className="text-cyan-400 text-xs tracking-wider mb-1">会員番号</p>
          <p className="font-mono text-white text-2xl font-bold tracking-wider">
            {user.memberNumber || user.id.slice(0, 10)}
          </p>
        </div>

        {/* 登録情報セクション */}
        {needsSetup ? (
          <div className="cyber-card p-6 text-center flex-1 flex flex-col justify-center">
            <p className="text-cyan-300 mb-6 text-lg">
              好きな活動と将来の夢を登録して<br />会員証を完成させよう！
            </p>
            <button
              onClick={onEditClick}
              className="cyber-button w-full rounded-lg text-lg"
            >
              登録する
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-4">
            {/* 好きな活動 */}
            <div className="cyber-border rounded-xl p-4">
              <p className="text-cyan-400 text-xs tracking-wider mb-2">好きな活動</p>
              <p className="text-white text-lg font-bold">
                {activityNames.join('、') || '-'}
              </p>
            </div>

            {/* 将来やりたいこと */}
            <div className="cyber-border rounded-xl p-4">
              <p className="text-cyan-400 text-xs tracking-wider mb-2">将来やりたいこと</p>
              <p className="text-white text-lg font-bold">
                {futureGoalName || '-'}
              </p>
            </div>

            {/* 通常の授業日 */}
            <div className="cyber-border-orange rounded-xl p-4">
              <p className="text-orange-400 text-xs tracking-wider mb-2">通常の授業日</p>
              <p className="neon-text-orange text-2xl font-bold">
                月曜17時
              </p>
            </div>

            {/* 編集ボタン */}
            <button
              onClick={onEditClick}
              className="cyber-button w-full rounded-lg mt-auto"
            >
              登録情報を変更
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
