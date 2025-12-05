import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loadFromStorage } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ✅ Загружаем из localStorage при монтировании
    loadFromStorage();
    setIsLoading(false);
  }, [loadFromStorage]);

  // ✅ Показываем загрузку пока проверяем localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Если не авторизован - редирект на /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Если указаны разрешённые роли - проверяем
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/properties" replace />;
  }

  return <>{children}</>;
};