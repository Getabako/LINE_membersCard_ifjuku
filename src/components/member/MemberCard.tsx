import { QRCodeSVG } from 'qrcode.react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart, faRocket, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Card } from '../common/Card';
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
    <div className="flex flex-col items-center gap-4">
      {/* if(塾)会員証メインカード - オレンジグラデーション */}
      <Card variant="elevated" className="w-full bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white p-0 overflow-hidden shadow-xl">
        {/* ヘッダー */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-200 text-xs font-medium tracking-wider">MEMBERSHIP CARD</p>
              <h1 className="text-2xl font-bold tracking-wide">if(塾)</h1>
            </div>
            <div className="text-right">
              <img
                src="/logo.png"
                alt="if(塾)ロゴ"
                className="w-12 h-12 rounded-full object-cover border-2 border-orange-300/50 shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* 会員情報 */}
        <div className="px-5 py-4 bg-white/15 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {user.pictureUrl ? (
              <img
                src={user.pictureUrl}
                alt={user.displayName}
                className="w-14 h-14 rounded-full object-cover border-2 border-white/60 shadow-md"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center border-2 border-white/60 shadow-md">
                <FontAwesomeIcon icon={faUser} className="text-xl" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-orange-100 text-xs">会員名</p>
              <h2 className="text-lg font-bold">{user.displayName}</h2>
            </div>
          </div>
        </div>

        {/* QRコードセクション */}
        <div className="px-5 py-4 bg-white flex items-center gap-4">
          <div className="bg-white p-2 rounded-lg shadow-inner border border-gray-100">
            <QRCodeSVG
              value={user.memberNumber || user.id}
              size={80}
              level="M"
              includeMargin={false}
            />
          </div>
          <div className="flex-1">
            <p className="text-gray-500 text-xs">会員番号</p>
            <p className="font-mono text-gray-800 font-bold">{user.memberNumber || user.id.slice(0, 12)}</p>
          </div>
        </div>
      </Card>

      {/* 登録情報カード */}
      {needsSetup ? (
        <Card className="w-full">
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              好きな活動と将来の夢を登録して<br />会員証を完成させよう！
            </p>
            <button
              onClick={onEditClick}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-shadow"
            >
              登録する
            </button>
          </div>
        </Card>
      ) : (
        <Card className="w-full">
          {/* 好きな活動 */}
          <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon icon={faHeart} className="text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">好きな活動</p>
              <div className="flex flex-wrap gap-2">
                {activityNames.map((name) => (
                  <span key={name} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 将来やりたいことと授業日 */}
          <div className="flex items-center gap-3 pt-4">
            <div className="flex-1 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faRocket} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">将来やりたいこと</p>
                <p className="font-medium text-gray-800">{futureGoalName || '-'}</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">通常の授業日</p>
                <p className="font-bold text-orange-600 text-lg">
                  月曜17時
                </p>
              </div>
            </div>
          </div>

          {/* 編集ボタン */}
          <button
            onClick={onEditClick}
            className="mt-4 w-full py-2 text-orange-600 text-sm font-medium border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
          >
            登録情報を変更
          </button>
        </Card>
      )}
    </div>
  );
};
