import { create } from 'zustand';
import { userApi, type User, type PointHistory } from '../lib/api';

interface UserState {
  user: User | null;
  pointHistory: PointHistory[];
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  fetchPointHistory: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  pointHistory: [],
  isLoading: false,
  error: null,

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await userApi.getMe();
      set({ user, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch user',
        isLoading: false,
      });
    }
  },

  fetchPointHistory: async () => {
    try {
      const history = await userApi.getPointHistory();
      set({ pointHistory: history });
    } catch (error) {
      console.error('Failed to fetch point history:', error);
    }
  },

  updateUser: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },
}));
