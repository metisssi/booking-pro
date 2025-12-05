import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface GuestRouteProps {
  children: React.ReactNode;
}

// Component for routes accessible only to non-authenticated users
export const LoggedRoute = ({ children }: GuestRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  // If user is already authenticated - redirect based on role
  if (isAuthenticated) {
    // HOST goes to dashboard
    if (user?.role === 'HOST') {
      return <Navigate to="/dashboard" replace />;
    }
    // GUEST goes to my-bookings
    return <Navigate to="/my-bookings" replace />;
  }

  // If not authenticated - show the page (login/register)
  return <>{children}</>;
};  