import { http, HttpResponse } from 'msw';

const API_BASE = '/api';

// モックデータ
export const mockUser = {
  id: 'user-1',
  lineUserId: 'U1234567890',
  displayName: 'テストユーザー',
  pictureUrl: 'https://example.com/pic.jpg',
  memberNumber: '0001-2345-6789',
  rank: 'GOLD' as const,
  points: 1250,
  createdAt: '2024-01-01T00:00:00.000Z',
};

export const mockBookings = [
  {
    id: 'booking-1',
    date: '2024-12-24T00:00:00.000Z',
    timeSlot: '14:00',
    title: 'オンライン個別指導',
    duration: 60,
    status: 'CONFIRMED' as const,
    createdAt: '2024-12-20T00:00:00.000Z',
  },
  {
    id: 'booking-2',
    date: '2024-12-28T00:00:00.000Z',
    timeSlot: '10:00',
    title: 'オンライン個別指導',
    duration: 60,
    status: 'CONFIRMED' as const,
    createdAt: '2024-12-21T00:00:00.000Z',
  },
];

export const mockPointHistory = [
  {
    id: 'point-1',
    amount: 50,
    type: 'bonus',
    description: '授業参加ボーナス',
    createdAt: '2024-12-20T00:00:00.000Z',
  },
  {
    id: 'point-2',
    amount: 100,
    type: 'bonus',
    description: '月額継続ボーナス',
    createdAt: '2024-12-15T00:00:00.000Z',
  },
  {
    id: 'point-3',
    amount: -200,
    type: 'use',
    description: 'ポイント利用',
    createdAt: '2024-12-10T00:00:00.000Z',
  },
];

export const mockSlots = [
  { id: 'slot-1', date: '2024-12-24', time: '10:00', available: true, remainingSeats: 2 },
  { id: 'slot-2', date: '2024-12-24', time: '11:00', available: false, remainingSeats: 0 },
  { id: 'slot-3', date: '2024-12-24', time: '13:00', available: true, remainingSeats: 3 },
  { id: 'slot-4', date: '2024-12-24', time: '14:00', available: true, remainingSeats: 1 },
  { id: 'slot-5', date: '2024-12-24', time: '15:00', available: true, remainingSeats: 3 },
  { id: 'slot-6', date: '2024-12-24', time: '16:00', available: true, remainingSeats: 2 },
];

// MSWハンドラー
export const handlers = [
  // ユーザー情報取得
  http.get(`${API_BASE}/users/me`, () => {
    return HttpResponse.json(mockUser);
  }),

  // ポイント履歴取得
  http.get(`${API_BASE}/users/me/points`, () => {
    return HttpResponse.json(mockPointHistory);
  }),

  // 予約一覧取得
  http.get(`${API_BASE}/bookings`, () => {
    return HttpResponse.json(mockBookings);
  }),

  // 予約作成
  http.post(`${API_BASE}/bookings`, async ({ request }) => {
    const body = await request.json() as { date: string; timeSlot: string };
    const newBooking = {
      id: 'booking-new',
      date: body.date,
      timeSlot: body.timeSlot,
      title: 'オンライン個別指導',
      duration: 60,
      status: 'CONFIRMED' as const,
      createdAt: new Date().toISOString(),
    };
    return HttpResponse.json(newBooking, { status: 201 });
  }),

  // 予約キャンセル
  http.delete(`${API_BASE}/bookings/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // スロット取得
  http.get(`${API_BASE}/slots`, () => {
    return HttpResponse.json(mockSlots);
  }),
];
