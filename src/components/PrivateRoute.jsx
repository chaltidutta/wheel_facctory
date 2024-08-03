// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Assuming token is stored in local storage

  if (!token) {
    alert('Please login to access this page');
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
