import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Home, User, LogOut, LogIn } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl">
          <Home className="w-5 h-5 mr-2" />
          BookingPro
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/properties">Properties</Link></li>
          {isAuthenticated && user?.role === 'HOST' && (
            <li><Link to="/my-properties">My Properties</Link></li>
          )}
          {isAuthenticated && user?.role === 'GUEST' && (
            <li><Link to="/my-bookings">My Bookings</Link></li>
          )}
        </ul>
      </div>

      <div className="navbar-end">
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title">
                <span>{user?.firstName} {user?.lastName}</span>
                <span className="text-xs">{user?.email}</span>
              </li>
              {/* ✅ Dashboard только для HOST */}
              {user?.role === 'HOST' && (
                <li><Link to="/dashboard">Dashboard</Link></li>
              )}
              <li><button onClick={logout}><LogOut className="w-4 h-4" />Logout</button></li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary">
            <LogIn className="w-4 h-4" />
            Login
          </Link>
        )}
      </div>
    </div>
  );
};