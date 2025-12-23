import { clsx } from 'clsx';

interface RankBadgeProps {
  rank: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
}

const rankConfig = {
  BRONZE: {
    label: 'BRONZE',
    icon: '⭐',
    className: 'badge-bronze',
  },
  SILVER: {
    label: 'SILVER',
    icon: '⭐⭐',
    className: 'badge-silver',
  },
  GOLD: {
    label: 'GOLD',
    icon: '⭐⭐⭐',
    className: 'badge-gold',
  },
  PLATINUM: {
    label: 'PLATINUM',
    icon: '👑',
    className: 'badge-platinum',
  },
};

export const RankBadge: React.FC<RankBadgeProps> = ({ rank }) => {
  const config = rankConfig[rank];

  return (
    <span className={clsx('badge', config.className)}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};
