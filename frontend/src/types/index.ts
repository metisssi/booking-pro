// ============================================
// USER & AUTH ТИПЫ
// ============================================
export enum UserRole {
  GUEST = 'GUEST',
  HOST = 'HOST',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

// ============================================
// PROPERTY ТИПЫ
// ============================================
export enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  VILLA = 'VILLA',
  ROOM = 'ROOM',
  STUDIO = 'STUDIO',
}

export interface Property {
  id: string;
  hostId: string;
  title: string;
  description: string;
  type: PropertyType;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  pricePerNight: number; // в центах! 5000 = 50€
  amenities: string[];
  images: string[];
  averageRating?: string;
  totalReviews?: number;
  totalBookings?: number;
  confirmedBookings?: number;
  host?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyDto {
  title: string;
  description: string;
  type: PropertyType;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  pricePerNight: number;
  amenities: string[];
  images: string[];
}

// ============================================
// BOOKING ТИПЫ
// ============================================
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface Booking {
  id: string;
  guestId: string;
  propertyId: string;
  checkIn: string;
  checkOut: string;
  totalGuests: number;
  pricePerNight: number;
  totalNights: number;
  totalPrice: number;
  status: BookingStatus;
  property?: {
    id: string;
    title: string;
    city: string;
    country: string;
    images: string[];
    host?: {
      firstName: string;
      lastName: string;
      phone?: string;
    };
  };
  guest?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingDto {
  propertyId: string;
  checkIn: string; // 'YYYY-MM-DD'
  checkOut: string; // 'YYYY-MM-DD'
  totalGuests: number;
}

// ============================================
// REVIEW ТИПЫ
// ============================================
export interface Review {
  id: string;
  guestId: string;
  propertyId: string;
  rating: number; // 1-5
  comment?: string;
  guest: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: string;
}