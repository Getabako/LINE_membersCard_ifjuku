import '@testing-library/jest-dom';
import { vi } from 'vitest';

// LIFFモックをグローバルに設定
vi.mock('@line/liff', () => ({
  default: {
    init: vi.fn().mockResolvedValue(undefined),
    isLoggedIn: vi.fn().mockReturnValue(true),
    isInClient: vi.fn().mockReturnValue(true),
    getProfile: vi.fn().mockResolvedValue({
      userId: 'U1234567890',
      displayName: 'テストユーザー',
      pictureUrl: 'https://example.com/pic.jpg',
      statusMessage: 'テスト',
    }),
    getAccessToken: vi.fn().mockReturnValue('mock-access-token'),
    closeWindow: vi.fn(),
    sendMessages: vi.fn().mockResolvedValue(undefined),
    login: vi.fn(),
  },
}));

// fetch モック
global.fetch = vi.fn();

// ResizeObserver モック
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// matchMedia モック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
