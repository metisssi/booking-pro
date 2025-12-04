import { Link } from 'react-router-dom';
import { Property } from '../types';
import { formatPrice } from '../utils/helpers';
import { MapPin, Users, Bed, Bath, Star } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Link to={`/properties/${property.id}`} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <figure className="h-48 overflow-hidden">
        <img
          src={property.images[0] || 'https://via.placeholder.com/400x300'}
          alt={property.title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </figure>
      
      <div className="card-body">
        <h2 className="card-title">
          {property.title}
          {property.averageRating && (
            <div className="badge badge-secondary gap-1">
              <Star className="w-3 h-3" />
              {property.averageRating}
            </div>
          )}
        </h2>
        
        <p className="text-sm text-base-content/70 flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {property.city}, {property.country}
        </p>
        
        <div className="flex gap-4 text-sm text-base-content/70 my-2">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {property.guests}
          </span>
          <span className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            {property.bathrooms}
          </span>
        </div>

        <div className="card-actions justify-between items-center">
          <div className="text-2xl font-bold text-primary">
            {formatPrice(property.pricePerNight)}
            <span className="text-sm font-normal text-base-content/70">/night</span>
          </div>
          <button className="btn btn-primary btn-sm">View Details</button>
        </div>
      </div>
    </Link>
  );
};