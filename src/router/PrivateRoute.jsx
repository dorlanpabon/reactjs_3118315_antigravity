import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const PrivateRoute = ({ children, allowedRole }) => {
  const { currentUser } = useApp();

  if (!currentUser) {
    // If not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && currentUser.rol !== allowedRole) {
    // If logged in but role mismatch, redirect to respective dashboard
    return <Navigate to={currentUser.rol === 'instructor' ? '/instructor/dashboard' : '/aprendiz/dashboard'} replace />;
  }

  return children;
};

export default PrivateRoute;
