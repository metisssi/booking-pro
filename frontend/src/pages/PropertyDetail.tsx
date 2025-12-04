import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById } from '../api/properties';
import { createBooking } from '../api/bookings';
import { Property } from '../types';
import { useAuthStore } from '../store/authStore';
import { formatPrice, calculateNights } from '../utils/helpers';
import { MapPin, Users, Bed, Bath, Star, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    totalGuests: 1,
  });

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const data = await getPropertyById(id!);
      setProperty(data);
    } catch (error) {
      toast.error('Failed to load property');
      navigate('/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }

    if (user?.role !== 'GUEST') {
      toast.error('Only guests can book properties');
      return;
    }

    if (!bookingData.checkIn || !bookingData.checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    try {
      await createBooking({ ...bookingData, propertyId: id! });
      toast.success('Booking created successfully!');
      navigate('/my-bookings');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!property) {
    return <div>Property not found</div>;
  }

  const nights = bookingData.checkIn && bookingData.checkOut 
    ? calculateNights(bookingData.checkIn, bookingData.checkOut) 
    : 0;
  const totalPrice = nights * property.pricePerNight;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <img
          src={property.images[0] || 'https://via.placeholder.com/600x400'}
          alt={property.title}
          className="w-full h-96 object-cover rounded-lg"
        />
        <div className="grid grid-cols-2 gap-4">
          {property.images.slice(1, 5).map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${property.title} ${idx + 2}`}
              className="w-full h-44 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Property Info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{property.title}</h1>
            <p className="text-lg text-base-content/70 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {property.address}, {property.city}, {property.country}
            </p>
          </div>

          <div className="flex gap-6 text-lg">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {property.guests} guests
            </span>
            <span className="flex items-center gap-2">
              <Bed className="w-5 h-5" />
              {property.bedrooms} bedrooms
            </span>
            <span className="flex items-center gap-2">
              <Bath className="w-5 h-5" />
              {property.bathrooms} bathrooms
            </span>
          </div>

          {property.averageRating && (
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-warning fill-warning" />
              <span className="text-lg font-semibold">{property.averageRating}</span>
              <span className="text-base-content/70">({property.totalReviews} reviews)</span>
            </div>
          )}

          <div className="divider"></div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-base-content/70 whitespace-pre-line">{property.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity, idx) => (
                <span key={idx} className="badge badge-lg badge-outline">
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {property.host && (
            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title">Hosted by</h3>
                <p className="text-lg">
                  {property.host.firstName} {property.host.lastName}
                </p>
                {property.host.phone && (
                  <p className="text-base-content/70">{property.host.phone}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Booking Card */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-xl sticky top-4">
            <div className="card-body">
              <h3 className="text-3xl font-bold text-primary mb-4">
                {formatPrice(property.pricePerNight)}
                <span className="text-base font-normal text-base-content/70">/night</span>
              </h3>

              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Check-in
                  </span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  value={bookingData.checkIn}
                  onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Check-out
                  </span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  value={bookingData.checkOut}
                  onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Guests
                  </span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  min="1"
                  max={property.guests}
                  value={bookingData.totalGuests}
                  onChange={(e) => setBookingData({ ...bookingData, totalGuests: parseInt(e.target.value) })}
                />
              </div>

              {nights > 0 && (
                <>
                  <div className="divider"></div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{formatPrice(property.pricePerNight)} x {nights} nights</span>
                      <span>{formatPrice(property.pricePerNight * nights)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </>
              )}

              <button onClick={handleBooking} className="btn btn-primary w-full mt-4">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};