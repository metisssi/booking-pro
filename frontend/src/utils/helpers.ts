import { BookingStatus } from '../types';

// ============================================
// FORMAT PRICE - конвертируем центы в евро
// ============================================
export const formatPrice = (priceInCents: number): string => {
  const euros = priceInCents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(euros);
};

// Пример: formatPrice(5000) → "€50.00"

// ============================================
// FORMAT DATE - форматируем дату
// ============================================
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Пример: formatDate('2024-12-15') → "Dec 15, 2024"

// ============================================
// FORMAT DATE TIME - дата + время
// ============================================
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Пример: formatDateTime('2024-12-15T14:30:00') → "Dec 15, 2024, 02:30 PM"

// ============================================
// GET STATUS COLOR - цвет для статуса бронирования
// ============================================
export const getStatusColor = (status: BookingStatus): string => {
  switch (status) {
    case BookingStatus.PENDING:
      return 'badge-warning'; // жёлтый
    case BookingStatus.CONFIRMED:
      return 'badge-success'; // зелёный
    case BookingStatus.CANCELLED:
      return 'badge-error'; // красный
    case BookingStatus.COMPLETED:
      return 'badge-info'; // синий
    default:
      return 'badge-ghost'; // серый
  }
};

// Использование: <span className={`badge ${getStatusColor(booking.status)}`}>

// ============================================
// CALCULATE NIGHTS - считаем количество ночей
// ============================================
export const calculateNights = (checkIn: string, checkOut: string): number => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Пример: calculateNights('2024-12-15', '2024-12-20') → 5