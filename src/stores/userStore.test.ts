import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUserStore } from './userStore';

// APIモック
vi.mock('../lib/api', () => ({
  userApi: {
    getMe: vi.fn(),
    getPointHistory: vi.fn(),
  },
}));

import { userApi } from '../lib/api';

describe('userStore', () => {
  beforeEach(() => {
    // ストアをリセット
    useUserStore.setState({
      user: null,
      pointHistory: [],
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it('should have initial state', () => {
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.pointHistory).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should fetch user successfully', async () => {
    const mockUser = {
      id: 'user-1',
      lineUserId: 'U123',
      displayName: 'テスト',
      memberNumber: '0001-0000-0000',
      rank: 'GOLD' as const,
      points: 1000,
      createdAt: '2024-01-01',
    };

    vi.mocked(userApi.getMe).mockResolvedValue(mockUser);

    await useUserStore.getState().fetchUser();

    const state = useUserStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle fetch user error', async () => {
    vi.mocked(userApi.getMe).mockRejectedValue(new Error('Network error'));

    await useUserStore.getState().fetchUser();

    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  it('should fetch point history successfully', async () => {
    const mockHistory = [
      { id: '1', amount: 100, type: 'bonus', description: 'ボーナス', createdAt: '2024-01-01' },
    ];

    vi.mocked(userApi.getPointHistory).mockResolvedValue(mockHistory);

    await useUserStore.getState().fetchPointHistory();

    const state = useUserStore.getState();
    expect(state.pointHistory).toEqual(mockHistory);
  });

  it('should update user', () => {
    useUserStore.setState({
      user: {
        id: 'user-1',
        lineUserId: 'U123',
        displayName: '旧名前',
        memberNumber: '0001-0000-0000',
        rank: 'BRONZE',
        points: 100,
        createdAt: '2024-01-01',
      },
    });

    useUserStore.getState().updateUser({ displayName: '新名前' });

    const state = useUserStore.getState();
    expect(state.user?.displayName).toBe('新名前');
  });
});
