import { getAccessToken } from './liff';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
};

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse<T>(response);
  },

  put: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<T>(response);
  },
};

// API型定義
export interface User {
  id: string;
  lineUserId: string;
  displayName: string;
  pictureUrl?: string;
  memberNumber?: string;
  rank: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  points: number;
  courses: string[];
  area?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  date: string;
  timeSlot: string;
  title: string;
  duration: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
}

export interface PointHistory {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
  remainingSeats: number;
}

// API関数
export const userApi = {
  getMe: () => api.get<User>('/users/me'),
  getPointHistory: () => api.get<PointHistory[]>('/users/me/points'),
  updateMe: (data: { courses?: string[]; area?: string }) => api.put<User>('/users/me', data),
};

export const bookingApi = {
  getAll: () => api.get<Booking[]>('/bookings'),
  create: (data: { date: string; timeSlot: string }) => api.post<Booking>('/bookings', data),
  update: (id: string, data: { date: string; timeSlot: string }) => api.put<Booking>(`/bookings/${id}`, data),
  cancel: (id: string) => api.delete<void>(`/bookings/${id}`),
  getSlots: (date: string) => api.get<TimeSlot[]>(`/slots?date=${date}`),
};
