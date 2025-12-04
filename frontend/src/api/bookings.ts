import axiosInstance from './axios';
import { Booking, CreateBookingDto } from '../types';

// ============================================
// CREATE BOOKING (only for GUEST)
// ============================================

export const createBooking = async (data: CreateBookingDto): Promise<Booking> => {
  const response = await axiosInstance.post<Booking>('/bookings', data);
  return response.data;
};

// ============================================
// GET MY BOOKINGS (only for GUEST)
// ============================================
export const getMyBookings = async (): Promise<Booking[]> => {
  const response = await axiosInstance.get<Booking[]>('/bookings/my');
  return response.data;
};

// ============================================
// GET HOST BOOKINGS (booking my properties for  HOST)
// ============================================

export const getHostBookings = async (): Promise<Booking[]> => {
  const response = await axiosInstance.get<Booking[]>('/bookings/host');
  return response.data;
};

// ============================================
// GET BOOKING BY ID (booking details)
// ============================================
export const getBookingById = async (id: string): Promise<Booking> => {
  const response = await axiosInstance.get<Booking>(`/bookings/${id}`);
  return response.data;
};

// ============================================
// CONFIRM BOOKING (only for HOST)
// ============================================

export const confirmBooking = async (id: string): Promise<Booking> => {
  const response = await axiosInstance.patch<Booking>(`/bookings/${id}/confirm`);
  return response.data;
};

// ============================================
// CANCEL BOOKING (GUEST or HOST)
// ============================================
export const cancelBooking = async (id: string): Promise<Booking> => {
  const response = await axiosInstance.patch<Booking>(`/bookings/${id}/cancel`);
  return response.data;
};