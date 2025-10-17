import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProtectedRoute = ({ children, userType = null }) => {
  const { user, loading, isAuthenticated, isAdmin, isStudent } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated()) {
    // Redirect to appropriate login page
    const loginPath = userType === 'admin' ? '/login/admin' : '/login/student';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Check user type if specified
  if (userType === 'admin' && !isAdmin()) {
    return <Navigate to="/login/admin" state={{ from: location }} replace />;
  }

  if (userType === 'student' && !isStudent()) {
    return <Navigate to="/login/student" state={{ from: location }} replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default ProtectedRoute; 