import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RankBadge } from './RankBadge';

describe('RankBadge', () => {
  it('should render BRONZE rank correctly', () => {
    render(<RankBadge rank="BRONZE" />);
    expect(screen.getByText('BRONZE')).toBeInTheDocument();
    expect(screen.getByText('⭐')).toBeInTheDocument();
  });

  it('should render SILVER rank correctly', () => {
    render(<RankBadge rank="SILVER" />);
    expect(screen.getByText('SILVER')).toBeInTheDocument();
    expect(screen.getByText('⭐⭐')).toBeInTheDocument();
  });

  it('should render GOLD rank correctly', () => {
    render(<RankBadge rank="GOLD" />);
    expect(screen.getByText('GOLD')).toBeInTheDocument();
    expect(screen.getByText('⭐⭐⭐')).toBeInTheDocument();
  });

  it('should render PLATINUM rank correctly', () => {
    render(<RankBadge rank="PLATINUM" />);
    expect(screen.getByText('PLATINUM')).toBeInTheDocument();
    expect(screen.getByText('👑')).toBeInTheDocument();
  });

  it('should apply correct badge style for GOLD rank', () => {
    render(<RankBadge rank="GOLD" />);
    const badge = screen.getByText('GOLD').closest('span');
    expect(badge).toHaveClass('badge-gold');
  });
});
