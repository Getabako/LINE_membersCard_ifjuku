import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBookingStore } from './bookingStore';

// APIモック
vi.mock('../lib/api', () => ({
  bookingApi: {
    getAll: vi.fn(),
    getSlots: vi.fn(),
    create: vi.fn(),
    cancel: vi.fn(),
  },
}));

import { bookingApi } from '../lib/api';

describe('bookingStore', () => {
  beforeEach(() => {
    useBookingStore.setState({
      bookings: [],
      slots: [],
      selectedDate: null,
      selectedSlot: null,
      isLoading: false,
      isSlotsLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it('should have initial state', () => {
    const state = useBookingStore.getState();
    expect(state.bookings).toEqual([]);
    expect(state.slots).toEqual([]);
    expect(state.selectedDate).toBeNull();
    expect(state.selectedSlot).toBeNull();
  });

  it('should set selected date and fetch slots', async () => {
    const mockSlots = [
      { id: 'slot-1', date: '2024-12-24', time: '10:00', available: true, remainingSeats: 2 },
    ];
    vi.mocked(bookingApi.getSlots).mockResolvedValue(mockSlots);

    const date = new Date('2024-12-24');
    useBookingStore.getState().setSelectedDate(date);

    expect(useBookingStore.getState().selectedDate).toEqual(date);
    expect(useBookingStore.getState().selectedSlot).toBeNull();
  });

  it('should set selected slot', () => {
    useBookingStore.getState().setSelectedSlot('slot-1');
    expect(useBookingStore.getState().selectedSlot).toBe('slot-1');
  });

  it('should fetch bookings successfully', async () => {
    const mockBookings = [
      {
        id: 'booking-1',
        date: '2024-12-24',
        timeSlot: '14:00',
        title: 'テスト',
        duration: 60,
        status: 'CONFIRMED' as const,
        createdAt: '2024-12-20',
      },
    ];
    vi.mocked(bookingApi.getAll).mockResolvedValue(mockBookings);

    await useBookingStore.getState().fetchBookings();

    const state = useBookingStore.getState();
    expect(state.bookings).toEqual(mockBookings);
    expect(state.isLoading).toBe(false);
  });

  it('should cancel booking', async () => {
    useBookingStore.setState({
      bookings: [
        {
          id: 'booking-1',
          date: '2024-12-24',
          timeSlot: '14:00',
          title: 'テスト',
          duration: 60,
          status: 'CONFIRMED' as const,
          createdAt: '2024-12-20',
        },
      ],
    });

    vi.mocked(bookingApi.cancel).mockResolvedValue(undefined);

    await useBookingStore.getState().cancelBooking('booking-1');

    const state = useBookingStore.getState();
    expect(state.bookings[0].status).toBe('CANCELLED');
  });

  it('should reset state', () => {
    useBookingStore.setState({
      selectedDate: new Date(),
      selectedSlot: 'slot-1',
      slots: [{ id: 'slot-1', date: '2024-12-24', time: '10:00', available: true, remainingSeats: 2 }],
    });

    useBookingStore.getState().reset();

    const state = useBookingStore.getState();
    expect(state.selectedDate).toBeNull();
    expect(state.selectedSlot).toBeNull();
    expect(state.slots).toEqual([]);
  });
});
