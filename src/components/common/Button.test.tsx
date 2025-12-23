import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render children correctly', () => {
    render(<Button>テスト</Button>);
    expect(screen.getByText('テスト')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>クリック</Button>);

    fireEvent.click(screen.getByText('クリック'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>無効</Button>);
    expect(screen.getByText('無効')).toBeDisabled();
  });

  it('should be disabled when loading prop is true', () => {
    render(<Button loading>読み込み中</Button>);
    expect(screen.getByText('読み込み中').closest('button')).toBeDisabled();
  });

  it('should apply primary variant styles by default', () => {
    render(<Button>プライマリ</Button>);
    const button = screen.getByText('プライマリ');
    expect(button).toHaveClass('bg-line-green');
  });

  it('should apply secondary variant styles', () => {
    render(<Button variant="secondary">セカンダリ</Button>);
    const button = screen.getByText('セカンダリ');
    expect(button).toHaveClass('bg-white');
  });

  it('should apply danger variant styles', () => {
    render(<Button variant="danger">削除</Button>);
    const button = screen.getByText('削除');
    expect(button).toHaveClass('bg-error');
  });

  it('should apply full width style when fullWidth is true', () => {
    render(<Button fullWidth>全幅</Button>);
    const button = screen.getByText('全幅');
    expect(button).toHaveClass('w-full');
  });
});
