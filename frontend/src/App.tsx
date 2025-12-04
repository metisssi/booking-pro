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

function App() {
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage);

  // Load user from localStorage on app start
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

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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