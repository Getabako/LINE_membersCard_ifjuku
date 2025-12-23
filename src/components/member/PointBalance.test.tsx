import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PointBalance } from './PointBalance';

describe('PointBalance', () => {
  it('should render points correctly', () => {
    render(<PointBalance points={1250} />);
    expect(screen.getByText('1,250')).toBeInTheDocument();
    expect(screen.getByText('pt')).toBeInTheDocument();
  });

  it('should format large numbers with commas', () => {
    render(<PointBalance points={10000} />);
    expect(screen.getByText('10,000')).toBeInTheDocument();
  });

  it('should display zero points', () => {
    render(<PointBalance points={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should render expiry date when provided', () => {
    render(<PointBalance points={100} expiryDate="2025/12/31" />);
    expect(screen.getByText('有効期限: 2025/12/31')).toBeInTheDocument();
  });

  it('should not render expiry date when not provided', () => {
    render(<PointBalance points={100} />);
    expect(screen.queryByText(/有効期限/)).not.toBeInTheDocument();
  });

  it('should apply large size class when size is lg', () => {
    render(<PointBalance points={100} size="lg" />);
    const pointsText = screen.getByText('100');
    expect(pointsText).toHaveClass('text-points');
  });
});
