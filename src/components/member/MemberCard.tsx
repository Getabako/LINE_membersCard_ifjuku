import { QRCodeSVG } from 'qrcode.react';
import { HiCalendarDays, HiMapPin, HiShoppingBag } from 'react-icons/hi2';
import { Card } from '../common/Card';
import type { User } from '../../lib/api';
import { COURSES, getDeliveryDayByArea, getDayFullName } from '../../lib/deliveryAreas';

interface MemberCardProps {
  user: User;
  onEditClick?: () => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ user, onEditClick }) => {
  const deliveryDay = user.area ? getDeliveryDayByArea(user.area) : null;
  const courseNames = user.courses
    ?.map(courseId => COURSES.find(c => c.id === courseId)?.name)
    .filter(Boolean) || [];

  const needsSetup = !user.area || user.courses.length === 0;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* ベジラク便会員証メインカード */}
      <Card variant="elevated" className="w-full bg-gradient-to-br from-green-600 to-green-700 text-white p-0 overflow-hidden">
        {/* ヘッダー */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-xs font-medium">MEMBERSHIP CARD</p>
              <h1 className="text-xl font-bold tracking-wide">ベジラク便</h1>
            </div>
            <div className="text-right">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🥬</span>
              </div>
            </div>
          </div>
        </div>

        {/* 会員情報 */}
        <div className="px-5 py-4 bg-white/10">
          <div className="flex items-center gap-3">
            {user.pictureUrl ? (
              <img
                src={user.pictureUrl}
                alt={user.displayName}
                className="w-14 h-14 rounded-full object-cover border-2 border-white/50"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center border-2 border-white/50">
                <span className="text-2xl">👤</span>
              </div>
            )}
            <div className="flex-1">
              <p className="text-green-100 text-xs">会員名</p>
              <h2 className="text-lg font-bold">{user.displayName}</h2>
            </div>
          </div>
        </div>

        {/* QRコードセクション */}
        <div className="px-5 py-4 bg-white flex items-center gap-4">
          <div className="bg-white p-2 rounded-lg shadow-inner">
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
              コースと地域を登録して<br />会員証を完成させましょう
            </p>
            <button
              onClick={onEditClick}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold"
            >
              登録する
            </button>
          </div>
        </Card>
      ) : (
        <Card className="w-full">
          {/* コース */}
          <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <HiShoppingBag className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">登録コース</p>
              <div className="flex flex-wrap gap-2">
                {courseNames.map((name) => (
                  <span key={name} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 地域とお届け曜日 */}
          <div className="flex items-center gap-3 pt-4">
            <div className="flex-1 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <HiMapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">お届け地域</p>
                <p className="font-medium text-gray-800">{user.area}</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <HiCalendarDays className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">お届け日</p>
                <p className="font-bold text-orange-600 text-lg">
                  {deliveryDay ? getDayFullName(deliveryDay) : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* 編集ボタン */}
          <button
            onClick={onEditClick}
            className="mt-4 w-full py-2 text-green-600 text-sm font-medium border border-green-200 rounded-lg hover:bg-green-50"
          >
            登録情報を変更
          </button>
        </Card>
      )}
    </div>
  );
};
