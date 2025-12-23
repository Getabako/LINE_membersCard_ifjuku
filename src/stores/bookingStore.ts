import { create } from 'zustand';
import { bookingApi, type Booking, type TimeSlot } from '../lib/api';

interface BookingState {
  bookings: Booking[];
  slots: TimeSlot[];
  selectedDate: Date | null;
  selectedSlot: string | null;
  isLoading: boolean;
  isSlotsLoading: boolean;
  error: string | null;

  setSelectedDate: (date: Date) => void;
  setSelectedSlot: (slotId: string | null) => void;
  fetchBookings: () => Promise<void>;
  fetchSlots: (date: string) => Promise<void>;
  createBooking: () => Promise<Booking>;
  cancelBooking: (id: string) => Promise<void>;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  slots: [],
  selectedDate: null,
  selectedSlot: null,
  isLoading: false,
  isSlotsLoading: false,
  error: null,

  setSelectedDate: (date) => {
    set({ selectedDate: date, selectedSlot: null });
    get().fetchSlots(date.toISOString().split('T')[0]);
  },

  setSelectedSlot: (slotId) => {
    set({ selectedSlot: slotId });
  },

  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const bookings = await bookingApi.getAll();
      set({ bookings, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch bookings',
        isLoading: false,
      });
    }
  },

  fetchSlots: async (date) => {
    set({ isSlotsLoading: true });
    try {
      const slots = await bookingApi.getSlots(date);
      set({ slots, isSlotsLoading: false });
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      set({ slots: [], isSlotsLoading: false });
    }
  },

  createBooking: async () => {
    const { selectedDate, selectedSlot, slots } = get();
    if (!selectedDate || !selectedSlot) {
      throw new Error('日付と時間を選択してください');
    }

    const slot = slots.find((s) => s.id === selectedSlot);
    if (!slot) {
      throw new Error('選択した時間枠が見つかりません');
    }

    const booking = await bookingApi.create({
      date: selectedDate.toISOString(),
      timeSlot: slot.time,
    });

    set((state) => ({
      bookings: [booking, ...state.bookings],
      selectedDate: null,
      selectedSlot: null,
    }));

    return booking;
  },

  cancelBooking: async (id) => {
    await bookingApi.cancel(id);
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, status: 'CANCELLED' as const } : b
      ),
    }));
  },

  reset: () => {
    set({
      selectedDate: null,
      selectedSlot: null,
      slots: [],
    });
  },
}));
