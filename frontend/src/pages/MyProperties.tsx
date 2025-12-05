import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyProperties, deleteProperty } from '../api/properties';
import { Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

export const MyProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    try {
      const data = await getMyProperties();
      setProperties(data);
    } catch (error) {
      toast.error('Failed to load your properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await deleteProperty(id);
      toast.success('Property deleted successfully!');
      // Remove from state
      setProperties(properties.filter((p) => p.id !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete property');
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Properties</h1>
        <Link to="/my-properties/new" className="btn btn-primary gap-2">
          <PlusCircle className="w-5 h-5" />
          Add New Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <PlusCircle className="w-24 h-24 mx-auto text-base-content/30 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No properties yet</h2>
            <p className="text-base-content/70 mb-6">
              Start listing your properties to earn money!
            </p>
            <Link to="/my-properties/new" className="btn btn-primary gap-2">
              <PlusCircle className="w-5 h-5" />
              Add Your First Property
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="relative">
              <PropertyCard property={property} />
              
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Link
                  to={`/my-properties/edit/${property.id}`}
                  className="btn btn-sm btn-circle btn-warning"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(property.id)}
                  className="btn btn-sm btn-circle btn-error"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Stats */}
              <div className="mt-4 p-4 bg-base-200 rounded-lg">
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <p className="font-bold text-lg">{property.totalBookings || 0}</p>
                    <p className="text-base-content/70">Total</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-success">{property.confirmedBookings || 0}</p>
                    <p className="text-base-content/70">Confirmed</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-warning">{property.totalReviews || 0}</p>
                    <p className="text-base-content/70">Reviews</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};