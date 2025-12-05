import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { PropertiesList } from './pages/PropertiesList';
import { PropertyDetail } from './pages/PropertyDetail';
import { CreateProperty } from './pages/CreateProperty'; 
import { EditProperty } from './pages/EditProperty'; 
import { MyProperties } from './pages/MyProperties';
import { GuestBookings } from './pages/GuestBookings';
import { HostBookings } from './pages/HostBookings';
import { UserRole } from './types';

function App() {
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/properties" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/properties" element={<PropertiesList />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />

        {/* Protected Routes - ONLY FOR HOST */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={[UserRole.HOST]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/my-properties"
          element={
            <ProtectedRoute allowedRoles={[UserRole.HOST]}>
              <MyProperties />
            </ProtectedRoute>
          }
        />

        {/* ✅ ДОБАВЬ ЭТОТ РОУТ */}
        <Route
          path="/my-properties/new"
          element={
            <ProtectedRoute allowedRoles={[UserRole.HOST]}>
              <CreateProperty />
            </ProtectedRoute>
          }
        />

         {/* ✅ ДОБАВЬ ЭТОТ РОУТ */}
        <Route
          path="/my-properties/edit/:id"
          element={
            <ProtectedRoute allowedRoles={[UserRole.HOST]}>
              <EditProperty />
            </ProtectedRoute>
          }
        />

         <Route
          path="/host-bookings"
          element={
            <ProtectedRoute allowedRoles={[UserRole.HOST]}>
              <HostBookings />
            </ProtectedRoute>
          }
        />

         {/* Protected Routes - GUEST ONLY */}
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute allowedRoles={[UserRole.GUEST]}>
              <GuestBookings /> 
            </ProtectedRoute>
          }
        />



        {/* Fallback */}
        <Route path="*" element={<Navigate to="/properties" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;