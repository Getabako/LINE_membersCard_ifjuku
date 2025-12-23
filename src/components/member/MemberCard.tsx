import { QRCodeSVG } from 'qrcode.react';
import { Card } from '../common/Card';
import { RankBadge } from './RankBadge';
import { PointBalance } from './PointBalance';
import type { User } from '../../lib/api';

interface MemberCardProps {
  user: User;
}

export const MemberCard: React.FC<MemberCardProps> = ({ user }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* QRコード */}
      <Card variant="elevated" className="flex flex-col items-center p-6">
        <div className="bg-white p-4 rounded-lg">
          <QRCodeSVG
            value={user.memberNumber}
            size={180}
            level="M"
            includeMargin={false}
          />
        </div>
        <p className="mt-4 font-mono text-body text-gray-600">
          No. {user.memberNumber}
        </p>
      </Card>

      {/* 会員情報カード */}
      <Card className="w-full">
        <div className="flex items-center gap-3 mb-4">
          {user.pictureUrl ? (
            <img
              src={user.pictureUrl}
              alt={user.displayName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xl text-gray-500">👤</span>
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-section">{user.displayName}</h2>
            <RankBadge rank={user.rank} />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-caption text-gray-500 mb-1">ポイント残高</p>
          <PointBalance points={user.points} size="lg" />
        </div>
      </Card>
    </div>
  );
};
