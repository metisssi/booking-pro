import { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '../api/bookings';
import { Booking } from '../types';
import { BookingCard } from '../components/BookingCard';
import { Calendar, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export const GuestBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    // Filter bookings when status changes
    if (statusFilter === 'ALL') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(b => b.status === statusFilter));
    }
  }, [statusFilter, bookings]);

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await cancelBooking(id);
      toast.success('Booking cancelled successfully');
      // Update local state
      setBookings(bookings.map(b => 
        b.id === id ? { ...b, status: 'CANCELLED' as any } : b
      ));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Calendar className="w-10 h-10 text-primary" />
          My Bookings
        </h1>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <select
            className="select select-bordered"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Bookings</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats stats-vertical md:stats-horizontal shadow mb-8 w-full">
        <div className="stat">
          <div className="stat-title">Total Bookings</div>
          <div className="stat-value text-primary">{bookings.length}</div>
        </div>
        
        <div className="stat">
          <div className="stat-title">Pending</div>
          <div className="stat-value text-warning">
            {bookings.filter(b => b.status === 'PENDING').length}
          </div>
        </div>
        
        <div className="stat">
          <div className="stat-title">Confirmed</div>
          <div className="stat-value text-success">
            {bookings.filter(b => b.status === 'CONFIRMED').length}
          </div>
        </div>
        
        <div className="stat">
          <div className="stat-title">Cancelled</div>
          <div className="stat-value text-error">
            {bookings.filter(b => b.status === 'CANCELLED').length}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="w-24 h-24 mx-auto text-base-content/30 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No bookings found</h2>
          <p className="text-base-content/70 mb-6">
            {statusFilter === 'ALL' 
              ? "You haven't made any bookings yet. Start exploring properties!"
              : `No ${statusFilter.toLowerCase()} bookings found.`}
          </p>
          <a href="/properties" className="btn btn-primary">
            Browse Properties
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
              isHost={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};