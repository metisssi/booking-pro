import { Booking } from '../types';
import { formatPrice, formatDate, getStatusColor, calculateNights } from '../utils/helpers';
import { Calendar, Users, Home } from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  onConfirm?: (id: string) => void;
  onCancel?: (id: string) => void;
  isHost?: boolean;
}

export const BookingCard = ({ booking, onConfirm, onCancel, isHost }: BookingCardProps) => {
  const nights = calculateNights(booking.checkIn, booking.checkOut);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title">
            <Home className="w-5 h-5" />
            {booking.property?.title || 'Property'}
          </h2>
          <span className={`badge ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)} ({nights} nights)
          </p>
          <p className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {booking.totalGuests} guests
          </p>
          {isHost && booking.guest && (
            <p className="text-base-content/70">
              Guest: {booking.guest.firstName} {booking.guest.lastName}
            </p>
          )}
        </div>

        <div className="divider my-2"></div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-base-content/70">Total Price</p>
            <p className="text-2xl font-bold text-primary">
              {formatPrice(booking.totalPrice)}
            </p>
          </div>

          <div className="card-actions">
            {booking.status === 'PENDING' && onConfirm && isHost && (
              <button 
                onClick={() => onConfirm(booking.id)} 
                className="btn btn-success btn-sm"
              >
                Confirm
              </button>
            )}
            {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && onCancel && (
              <button 
                onClick={() => onCancel(booking.id)} 
                className="btn btn-error btn-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};