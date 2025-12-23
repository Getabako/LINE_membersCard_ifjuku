import { vi } from 'vitest';

export const mockLiff = {
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
};

export const resetLiffMock = () => {
  mockLiff.init.mockClear();
  mockLiff.isLoggedIn.mockReturnValue(true);
  mockLiff.isInClient.mockReturnValue(true);
  mockLiff.getProfile.mockResolvedValue({
    userId: 'U1234567890',
    displayName: 'テストユーザー',
    pictureUrl: 'https://example.com/pic.jpg',
    statusMessage: 'テスト',
  });
  mockLiff.getAccessToken.mockReturnValue('mock-access-token');
};

export const mockLiffNotLoggedIn = () => {
  mockLiff.isLoggedIn.mockReturnValue(false);
  mockLiff.getAccessToken.mockReturnValue(null);
};

export const mockLiffExternalBrowser = () => {
  mockLiff.isInClient.mockReturnValue(false);
};
