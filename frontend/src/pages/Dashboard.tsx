import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { Home, Calendar, PlusCircle } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        Welcome, {user?.firstName}! 👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Browse Properties */}
        <Link to="/properties" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
          <div className="card-body items-center text-center">
            <Home className="w-16 h-16 text-primary mb-4" />
            <h2 className="card-title">Browse Properties</h2>
            <p className="text-base-content/70">
              Explore available properties for your next stay
            </p>
            <div className="card-actions mt-4">
              <button className="btn btn-primary">View All</button>
            </div>
          </div>
        </Link>

        {/* My Bookings (GUEST) */}
        {user?.role === 'GUEST' && (
          <Link to="/my-bookings" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body items-center text-center">
              <Calendar className="w-16 h-16 text-secondary mb-4" />
              <h2 className="card-title">My Bookings</h2>
              <p className="text-base-content/70">
                View and manage your bookings
              </p>
              <div className="card-actions mt-4">
                <button className="btn btn-secondary">View Bookings</button>
              </div>
            </div>
          </Link>
        )}

        {/* My Properties (HOST) */}
        {user?.role === 'HOST' && (
          <>
            <Link to="/my-properties" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body items-center text-center">
                <Home className="w-16 h-16 text-accent mb-4" />
                <h2 className="card-title">My Properties</h2>
                <p className="text-base-content/70">
                  Manage your listed properties
                </p>
                <div className="card-actions mt-4">
                  <button className="btn btn-accent">Manage</button>
                </div>
              </div>
            </Link>

            <Link to="/my-properties/new" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body items-center text-center">
                <PlusCircle className="w-16 h-16 text-success mb-4" />
                <h2 className="card-title">Add Property</h2>
                <p className="text-base-content/70">
                  List a new property for rent
                </p>
                <div className="card-actions mt-4">
                  <button className="btn btn-success">Add New</button>
                </div>
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};